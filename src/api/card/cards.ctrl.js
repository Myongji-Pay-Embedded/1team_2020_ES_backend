// import Cards from '../../models/card';
// import Joi from '@hapi/joi';
// import mongoose from 'mongoose';

// const { ObjectId } = mongoose.Types;

// // ObjectId 검증하기 => update에서 사용
// export const getCardById = async (ctx, next) => {
//   const { id } = ctx.params;
//   if (!ObjectId.isValid(id)) {
//     ctx.status = 400; //Bad Request
//     return;
//   }
//   try {
//     const card = await Cards.findById(id);
//     //멤버쉽이 존재하지 않을 때
//     if (!Cards) {
//       ctx.status = 404; // Not Found
//       return;
//     }
//     ctx.state.membership = card;
//     return next();
//   } catch (e) {
//     ctx.throw(500, e);
//   }
// };

// /*
// POST /api/cards
// {
//   Cardnumber: 16자리 숫자, // 사용자 카드번호,
//   validity: 4자리 숫자, //유효기간 MMYY,
//   Cardcvc: 3자리 숫자, // 사용자 카드cvc,
//   CardPassword: 2자리 숫자,// 사용자 카드비밀번호 앞 두자리
//   AppPwd: 6자리 숫자, // 사용자 앱 비밀번호
// }
// */
// //카드 등록
// export const add = async (ctx) => {
//   // Requeset Body 검증
//   const schema = Joi.object().keys({
//     cardNumber: Joi.number.integer().min(16).max(16).required(),
//     validity: Joi.number.integer().min(4).max(4).required(),
//     cardCvc: Joi.number.integer().min(3).max(3).required(),
//     cardPassword: Joi.number.integer().min(2).max(2).required(),
//     AppPwd: Joi.number.length(6).required(),
//   });
//   // 양식이 맞지 않으면 400 에러
//   const result = schema.validate(ctx.request.body);
//   if (result.error) {
//     ctx.status = 400;
//     ctx.body = result.error;
//     return;
//   }
//   const {
//     cardNumber,
//     validity,
//     cardCvc,
//     cardPassword,
//     AppPwd,
//   } = ctx.request.body;

//   try {
//     // 이미 존재하는 카드번호인지 확인(카드가 중복될 수는 없음)
//     const exists = await Cards.findCardNumber(cardNumber);
//     if (exists) {
//       ctx.status = 409; // Conflict(충돌)
//       return;
//     }
//     const card = new Cards({
//       validity,
//       user: ctx.state.user,
//     });
//     await card.setCard(cardNumber, cardCvc, cardPassword); // 카드 정보 설정
//     await card.save(); // 데이터베이스에 저장

//     // 응답할 데이터에서 hashed 필드 제거
//     ctx.body = card.serialize();
//   } catch (e) {
//     ctx.throw(500, e);
//   }
// };
// export const list = (ctx) => {};
// export const read = (ctx) => {};
// export const remove = (ctx) => {};
// export const update = (ctx) => {};
