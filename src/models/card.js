// 사용자 카드 정보 스키마
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const CardSchema = new Schema({
  userId: String, // 사용자 아이디
  hashedCardnumber: String, // 사용자 카드번호,

  hashedCardcvc: String, // 사용자 카드번호,
  
});

// 카드번호, CVC 저장
CardSchema.methods.setCardnumbercvc = async function (cardnumber, cardcvc) {
    const hash = await b crypt.hash(cardnumber, 10);
    const hashs = await bcrypt.hash(cardcvc,10);
    this.hashedCardnumber = hash;
    this.hashedCardcvc = hashs;
  };



// 응답할 데이터에서 hashedPassword 필드 제거
CardSchema.methods.serialize = function () {
  const data = this.toJSON();
  delete data.hashedPassword;
  delete data.hashedCardnumber;
  return data;
};

const Card = mongoose.model('Card', CardSchema);
export default Card;
