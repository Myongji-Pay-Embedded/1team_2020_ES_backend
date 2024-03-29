import Card from '../../models/card';
import Joi from '@hapi/joi';
import mongoose from 'mongoose';
import User from '../../models/user';

const { ObjectId } = mongoose.Types;

// ObjectId 검증하기 => update에서 사용
export const getCardById = async (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400; //Bad Request
    return;
  }
  try {
    const card = await Card.findById(id);
    //멤버쉽이 존재하지 않을 때
    if (!Card) {
      ctx.status = 404; // Not Found
      return;
    }
    ctx.state.card = card;
    return next();
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
POST /api/cards
{
    Cardnumber_d: 앞 4자리
  Cardnumber: 뒷 12자리 숫자, // 사용자 카드번호,
  validity: 4자리 숫자, //유효기간 MMYY,
  Cardcvc: 3자리 숫자, // 사용자 카드cvc,
  CardPassword: 2자리 숫자,// 사용자 카드비밀번호 앞 두자리
  AppPwd: 6자리 숫자, // 사용자 앱 비밀번호
}
*/
//카드 등록
export const add = async (ctx) => {
  // Requeset Body 검증
  const schema = Joi.object().keys({
    bank: Joi.string().required(),
    cardNumber_d: Joi.string().min(4).max(4).required(),
    cardNumber: Joi.string().min(12).max(12).required(),
    cardColor: Joi.string().required(),
    validity: Joi.string().min(4).max(4).required(),
    cardCvc: Joi.string().min(3).max(3).required(),
    cardPassword: Joi.string().min(2).max(2).required(),
  });
  // 양식이 맞지 않으면 400 에러
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }
  const {
    bank,
    cardNumber_d,
    cardNumber,
    cardColor,
    validity,
    cardCvc,
    cardPassword,
  } = ctx.request.body;

  try {
    const card = new Card({
      bank,
      cardNumber_d,
      cardColor,
      validity,
      user: ctx.state.user,
    });
    await card.setCard(cardNumber, cardCvc, cardPassword); // 카드 정보 설정
    await card.save(); // 데이터베이스에 저장

    // 응답할 데이터에서 hashed 필드 제거
    ctx.body = card.serialize();
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
GET /api/cards/
*/
// 멤버쉽카드 리스트 조회

export const list = async (ctx) => {
  try {
    const user = ctx.state.user._id;

    const cards = await Card.find({ 'user._id': user }).exec();

    ctx.body = cards;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
GET /api/cards/:id
*/
// 특정 카드 조회
export const read = (ctx) => {
  ctx.body = ctx.state.card;
};

/*
  DELETE /api/cards/:id
  */
// 특정 카드 삭제
export const remove = async (ctx) => {
  const { id } = ctx.params;
  try {
    await Card.findByIdAndRemove(id).exec();
    ctx.status = 204; // No Content(성공하기는 했지만 응답할 데이터는 없음)
  } catch (e) {
    ctx.throw(500, e);
  }
};
