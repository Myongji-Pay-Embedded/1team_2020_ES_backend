// 사용자 정보 스키마
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new Schema({
  username: String, // 사용자 이름
  userCel: Number, // 사용자 전화번호
  userId: String, // 사용자 아이디
  hashedPassword: String, // 사용자 비밀번호
});

// 비밀번호 저장
UserSchema.method.setPassword = async function (password) {
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash;
};

// 입력한 비밀번호의 해쉬값과 해쉬되어 저장되어 있는 비밀번호의 해쉬값이 같은지 확인
UserSchema.method.checkPassword = async function (password) {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result; // true or false
};

// 사용자 id 찾기
UserSchema.statics.findByUserId = function (userId) {
  return this.findOne({ userId }); // 여기서 this => User
};

// 응답할 데이터에서 hashedPassword 필드 제거
UserSchema.methods.serialize = function () {
  const data = this.toJSON();
  delete data.hashedPassword;
  return data;
};

const User = mongoose.model('User', UserSchema);
export default User;
