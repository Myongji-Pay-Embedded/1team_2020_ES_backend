// 사용자 계좌 정보 스키마
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const AccountSchema = new Schema({
  user: {
    // 로그인했을 때만 계좌 관련된 것에 접근할 수 있도록
    _id: mongoose.Types.ObjectId,
    userId: String,
    user_seq_no: String,
    access_token: String,
  },
});

// 비밀번호 저장
AccountSchema.methods.setPassword = async function (password) {
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash;
};

// 입력한 비밀번호의 해쉬값과 해쉬되어 저장되어 있는 비밀번호의 해쉬값이 같은지 확인
AccountSchema.methods.checkPassword = async function (password) {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result; // true or false
};

// 사용자 id 찾기
AccountSchema.statics.findByUserId = function (userId) {
  return this.findOne({ userId }); // 여기서 this => User
};

// 응답할 데이터에서 hashedPassword 필드 제거
AccountSchema.methods.serialize = function () {
  const data = this.toJSON();
  delete data.hashedPassword;
  return data;
};

const Account = mongoose.model('Account', AccountSchema);
export default Account;
