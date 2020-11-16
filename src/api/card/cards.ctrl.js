import Cards from '../../models/card';

/*
POST /api/cards
{
  Cardnumber: 16자리 숫자, // 사용자 카드번호,
  validity: 4자리 숫자, //유효기간 MMYY,
  Cardcvc: 3자리 숫자, // 사용자 카드cvc,
  CardPassword: 2자리 숫자,// 사용자 카드비밀번호 앞 두자리
}
*/
export const write = async (ctx) => {
  const { Cardnumber, validity, Cardcvc, CardPassword } = ctx.request.body;
  const card = new Cards({
    Cardnumber,
    validity,
    Cardcvc,
    CardPassword,
    user: ctx.state.user,
  });
  try {
  }
};
export const list = (ctx) => {};
export const read = (ctx) => {};
export const remove = (ctx) => {};
export const update = (ctx) => {};
