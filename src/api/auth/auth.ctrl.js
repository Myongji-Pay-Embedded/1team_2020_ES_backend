// 회원 인증 API
import Joi from '@hapi/joi';
import User from '../../models/user';
import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

// ObjectId 검증하기 => update에서 사용
export const checkObjectId = (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400; //Bad Request
    return;
  }
  return next();
};

// 오픈 뱅킹 Api 연결 (access_token, refresh_token, user_seq_no) 받아와서 DB에 저장
const axios = require('axios');
const qs = require('querystring');
var access_token;
var refresh_token;
var user_seq_no;
export const authResult = async (ctx) => {
  const { code, scope, state } = ctx.query;

  let authCode = code;
  //ctx.body = code;
  const url = 'https://testapi.openbanking.or.kr/oauth/2.0/token';
  const data = {
    code: authCode,
    client_id: 'EsOL6RK1exea8gMpXtVhKjDoEW7mf6aYsw7fcwvu',
    client_secret: 'kDz4mqX1lQsUUqnrJ5jJI8Lo4bqKm2IoFGShKoZ5',
    redirect_uri: 'http://10.0.2.2:4000/api/auth/authResult/',
    grant_type: 'authorization_code',
  };
  const axiosConfig = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  };

  axios
    .post(url, qs.stringify(data), axiosConfig)
    .then((res) => {
      console.log(res.data);
      access_token = res.data.access_token;
      refresh_token = res.data.refresh_token;
      user_seq_no = res.data.user_seq_no;
      console.log(user_seq_no);
    })
    .catch((err) => {
      console.log(err.response);
    });
};

/* 
POST /api/auth/isExist
*/
export const isExist = async (ctx) => {
  const { userId } = ctx.request.body;

  //userId가 이미 존재하는지 확인(중복계정 생성 방지)
  const exists = await User.findByUserId(userId);
  if (exists) {
    ctx.status = 409; // Conflict(충돌)
    return;
  } else {
    ctx.body = userId;
    return;
  }
};

/*
POST /api/auth/register{
  "username": "김현경",
  "userId": "example12",
  "password": "Mypass123!", // 비밀번호(“8자 이상, 영어, 숫자, 특수문자를 포함하는 비밀번호” 같은 형태)
  "access_token":"오픈뱅킹api에서 받아온 access_token",
  "refresh_token":"오픈뱅킹api에서 받아온 refresh_token",
  "user_seq_no":"오픈뱅킹api에서 받아온 user_seq_no",
}
*/
// 회원가입
export const register = async (ctx) => {
  // Request Body 검증
  const schema = Joi.object().keys({
    username: Joi.string().required(),
    userId: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string()
      .regex(/^(?=.*[a-z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/)
      .required(),
  });
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { username, userId, password } = ctx.request.body;
  try {
    //userId가 이미 존재하는지 확인(중복계정 생성 방지)
    const exists = await User.findByUserId(userId);
    if (exists) {
      ctx.status = 409; // Conflict(충돌)
      return;
    }
    const user_number =
      Math.random() * (99999999999999999999 - 10000000000000000000) +
      10000000000000000000;
    const user = new User({
      username,
      userId,
      access_token,
      refresh_token,
      user_seq_no,
      user_number,
    });
    const AppPwd = '000000';
    await user.setAppPwd(AppPwd);
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
  if (!userId) {
    ctx.status = 401; //Unauthorized
    return;
  } else if (!password) {
    ctx.status = 402; //Unauthorized
    return;
  }

  try {
    const user = await User.findByUserId(userId);
    // 계정이 존재하지 않으면 에러 처리
    if (!user.userId) {
      ctx.status = 401;
      return;
    }

    const valid = await user.checkPassword(password);
    // 잘못된 비밀번호
    if (!valid) {
      ctx.status = 402;
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
POST /api/auth/checkaapwd{
  appPwd  수정 전에 확인
*/
export const checkappkpwd = async (ctx) => {
  const { id, AppPwd } = ctx.request.body;
  console.log(id, AppPwd);
  try {
    const user = await User.findById(id);
    const valid = await user.checkAppPassword(AppPwd);
    // 잘못된 비밀번호
    if (!valid) {
      ctx.status = 401;
      return;
    }
    ctx.body = id;
  } catch (e) {
    ctx.throw(500, e);
  }
};
/*
POST /api/auth/checkaapwd{
  appPwd  수정 전에 확인
*/
export const checkpwd = async (ctx) => {
  const { id, password } = ctx.request.body;
  console.log(id, password);
  try {
    const user = await User.findById(id);
    const valid = await user.checkPassword(password);
    // 잘못된 비밀번호
    if (!valid) {
      ctx.status = 401;
      return;
    }
    ctx.body = id;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
PATCH /api/auth/register/:id
{
  AppPwd, Password 수정
}
*/
// 회원정보 수정 => 비밀번호 수정 및 앱 비밀번호 수정
export const update = async (ctx) => {
  const { id } = ctx.params;
  const schema = Joi.object().keys({
    AppPwd: Joi.string().length(6).regex(/^\d+$/),
    password: Joi.string().regex(
      /^(?=.*[a-z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/,
    ),
  });

  // 양식이 맞지 않으면 400 에러
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error;
    return;
  }
  const { AppPwd, password } = ctx.request.body;
  console.log(AppPwd, password);
  try {
    const user = await User.findByIdAndUpdate(id, ctx.request.body, {
      new: true, // 업데이트된 데이터를 반환한다.
      // false => 업데이트되기 전의 데이터 반환
    }).exec();
    if (!user) {
      ctx.status = 404;
      return;
    }
    console.log(ctx.request.body);
    if (ctx.request.body.AppPwd) {
      // 앱 비밀번호 수정
      await user.setAppPwd(AppPwd);
    } else if (ctx.request.body.password) {
      // 회원정보수정 => 비밀번호 수정
      await user.setPassword(password);
    }

    await user.save();
    ctx.body = user.serialize();
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

/* 
DELETE /api/auth/:id
*/
// 회원탈퇴
export const remove = async (ctx) => {
  const { id } = ctx.params;
  try {
    await User.findByIdAndRemove(id).exec();
    ctx.status = 204; // No Content(성공하기는 했지만 응답할 데이터는 없음)
  } catch (e) {
    ctx.throw(500, e);
  }
};
