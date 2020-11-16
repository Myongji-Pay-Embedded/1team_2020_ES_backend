// 사용자 카드 정보 스키마
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const CardSchema = new Schema({
  userId: String, // 사용자 아이디,
  hashedCardnumber: String, // 사용자 카드번호,
  validity: Number, //유효기간 MMYY,
  hashedCardcvc: String, // 사용자 카드cvc,
  hashedCardPassword: String,
});

// 카드번호, CVC, 카드비밀번호 저장
CardSchema.methods.setCardnumbercvc = async function (
  cardnumber,
  cardcvc,
  cardPassword,
) {
  const hash1 = await bcrypt.hash(cardnumber, 10);
  const hash2 = await bcrypt.hash(cardcvc, 10);
  const hash3 = await bcrypt.hash(cardPassword, 10);
  this.hashedCardnumber = hash1;
  this.hashedCardcvc = hash2;
  this.hashedCardnumber = hash3;
};

// 사용자 id 찾기
CardSchema.statics.findByUserId = function (userId) {
  return this.findOne({ userId }); // 여기서 this => Card
};

// 응답할 데이터에서 hashedCardnumber, hashedCardcvc, hashedCardPassword  필드 제거
CardSchema.methods.serialize = function () {
  const data = this.toJSON();
  delete data.hashedCardnumber;
  delete data.hashedCardcvc;
  delete data.hashedCardPassword;
  return data;
};

const Card = mongoose.model('Card', CardSchema);
export default Card;
