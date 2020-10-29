// 사용자 정보 스키마
import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  username: String, // 사용자 이름
  userCel: String, // 사용자 전화번호
  userId: String, // 사용자 아이디
  hashedPassword: String, // 사용자 비밀번호
});

const User = mongoose.model('User', UserSchema);
export default User;
