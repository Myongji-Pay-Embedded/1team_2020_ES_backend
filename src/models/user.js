// 사용자 정보 스키마
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = new Schema({
  username: String, // 사용자 이름
  userId: String, // 사용자 아이디
  hashedPassword: String, // 사용자 비밀번호
  access_token: String,
  refresh_token: String,
  user_seq_no: String,
  hashedAppPwd: String, // 앱 6자리 비밀번호
  user_number: Number,
});

// 비밀번호 저장
UserSchema.methods.setPassword = async function (password) {
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash;
};

// 입력한 비밀번호의 해쉬값과 해쉬되어 저장되어 있는 비밀번호의 해쉬값이 같은지 확인
UserSchema.methods.checkPassword = async function (password) {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result; // true or false
};

// 입력한 앱 비밀번호의 해쉬값과 해쉬되어 저장되어 있는 앱 비밀번호의 해쉬값이 같은지 확인
UserSchema.methods.checkAppPassword = async function (AppPwd) {
  const result = await bcrypt.compare(AppPwd, this.hashedAppPwd);
  return result; // true or false
};

// 앱 비밀번호 6자리 저장
UserSchema.methods.setAppPwd = async function (AppPwd) {
  const hash = await bcrypt.hash(AppPwd, 10);
  this.hashedAppPwd = hash;
};

// 사용자 id 찾기
UserSchema.statics.findByUserId = function (userId) {
  return this.findOne({ userId }); // 여기서 this => User
};

// 응답할 데이터에서 hashedPassword 필드 제거
UserSchema.methods.serialize = function () {
  const data = this.toJSON();
  delete data.hashedPassword;
  delete data.hashedAppPwd;
  return data;
};

UserSchema.methods.generateToken = function () {
  const token = jwt.sign(
    // 첫번째 파라미터에는 토큰 안에 집어넣고 싶은 데이터를 넣음.
    {
      _id: this.id,
      userId: this.userId,
    },
    process.env.JWT_SECRET, // 두번째 파라미터에는 JWT 암호 넣음
    {
      expiresIn: '7d', // 7일 동안 유효
    },
  );
  return token;
};

const User = mongoose.model('User', UserSchema);
export default User;
