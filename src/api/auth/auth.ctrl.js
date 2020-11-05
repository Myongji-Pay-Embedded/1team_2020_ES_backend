// 회원 인증 API
import Joi from '@hapi/joi';
import User from '../../models/user';

/*
POST /api/auth/register{
  "username": "김현경",
  "userId": "example12",
  "password": "Mypass123!", // 비밀번호(“8자 이상, 대문자와 소문자, 숫자, 특수문자를 포함하는 비밀번호” 같은 형태)
  "access_token":"",
  "refresh_token":"",
  "user_seq_no":"",
}
*/
// 회원가입
export const register = async (ctx) => {
  // Request Body 검증
  const schema = Joi.object().keys({
    username: Joi.string().required(),
    userId: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/,
      )
      .required(),
    access_token: Joi.string().required(),
    refresh_token: Joi.string().required(),
    user_seq_no: Joi.string().required(),
  });
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }
  const { username, userCel, userId, password } = ctx.request.body;
  try {
    //userId가 이미 존재하는지 확인(중복계정 생성 방지)
    const exists = await User.findByUserId(userId);
    if (exists) {
      ctx.status = 409; // Conflict(충돌)
      return;
    }
    const user = new User({
      username,
      userId,
      access_token,
      refresh_token,
      user_seq_no,
    });
    await user.setPassword(password); // 비밀번호 설정
    await user.save(); // 데이터베이스에 저장

    // 응답할 데이터에서 hashedPassword 필드 제거
    ctx.body = user.serialize();

    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
POST /api/auth/login{
  "userId": "example12",
  "password": "Mypass123!"
*/
// 로그인
export const login = async (ctx) => {
  const { userId, password } = ctx.request.body;

  // userId, password 없으면 에러 처리
  if (!userId || !password) {
    ctx.status = 401; //Unauthorized
    return;
  }

  try {
    const user = await User.findByUserId(userId);
    // 계정이 존재하지 않으면 에러 처리
    if (!user) {
      ctx.status = 401;
      return;
    }

    const valid = await user.checkPassword(password);
    // 잘못된 비밀번호
    if (!valid) {
      ctx.status = 401;
      return;
    }
    ctx.body = user.serialize();
    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* 
GET /api/auth/check
*/
// 로그인 상태 확인
export const check = async (ctx) => {
  const { user } = ctx.state;
  if (!user) {
    //로그인 중 아님
    ctx.status = 401; //Unauthorized
    return;
  }
  ctx.body = user;
};

/* 
POST /api/auth/logout
*/
// 로그아웃
export const logout = async (ctx) => {
  ctx.cookies.set('access_token');
  ctx.status = 204; // No Content
};
