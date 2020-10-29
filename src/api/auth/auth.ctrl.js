// 회원 인증 API
import Joi from '@hapi/joi';
import User from '../../models/user';

/*
POST /api/auth/register{
  username: 김현경
  userCel: 01042820978
  userId: 'example'
  password: 'Mypass123!' // 비밀번호(“8자 이상, 대문자와 소문자, 숫자, 특수문자를 포함하는 비밀번호” 같은 형태)
}
*/

export const register = async (ctx) => {
  // Request Body 검증
  const schema = Joi.object().keys({
    username: Joi.string().required(),
    userCel: Joi.number().integer().min(10).max(11).required(),
    userId: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/,
      )
      .required(),
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
      userCel,
      userId,
    });
    await user.setPassword(password); // 비밀번호 설정
    await user.save(); // 데이터베이스에 저장

    // 응답할 데이터에서 hashedPassword 필드 제거
    const data = user.toJSON();
    delete data.hashedPassword;
    ctx.body = data;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const login = async (ctx) => {
  // 로그인
};

export const check = async (ctx) => {
  // 로그인 상태 확인
};

export const logout = async (ctx) => {
  // 로그아웃
};
