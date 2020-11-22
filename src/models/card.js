// 사용자 카드 정보 스키마
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const CardSchema = new Schema({
  cardNumber_d: Number, // 사용자 카드번호 앞 4자리
  hashedcardNumber: String, // 사용자 카드번호 뒷 12자리,
  validity: Number, //유효기간 MMYY,
  hashedcardCvc: String, // 사용자 카드cvc,
  hashedcardPassword: String,
  user: {
    // 로그인했을 때만 카드 관련된 것에 접근할 수 있도록
    _id: mongoose.Types.ObjectId,
    userId: String,
  },
});

// 카드번호, CVC, 카드비밀번호 저장
CardSchema.methods.setCard = async function (
  cardNumber,
  cardCvc,
  cardPassword,
) {
  const hash1 = await bcrypt.hash(cardNumber, 10);
  const hash2 = await bcrypt.hash(cardCvc, 10);
  const hash3 = await bcrypt.hash(cardPassword, 10);
  this.hashedcardNumber = hash1;
  this.hashedcardCvc = hash2;
  this.hashedcardNumber = hash3;
};

// 응답할 데이터에서 hashedCardnumber, hashedCardcvc, hashedCardPassword  필드 제거
CardSchema.methods.serialize = function () {
  const data = this.toJSON();
  delete data.hashedcardNumber;
  delete data.hashedcardCvc;
  delete data.hashedcardNumber;
  return data;
};

const Card = mongoose.model('Card', CardSchema);
export default Card;
