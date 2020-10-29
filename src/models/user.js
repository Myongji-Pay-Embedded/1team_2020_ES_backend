// 사용자 정보 스키마
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new Schema({
  username: String, // 사용자 이름
  userCel: String, // 사용자 전화번호
  userId: String, // 사용자 아이디
  hashedPassword: String, // 사용자 비밀번호
});

UserSchema.method.setPassword = async function (password) {
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash;
};

UserSchema.method.checkPassword = async function (password) {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result; // true or false
};

UserSchema.statics.findByUserId = function (userId) {
  return this.findOne({ userId }); // 여기서 this => User
};

const User = mongoose.model('User', UserSchema);
export default User;
