import Membership from '../../models/membership';
import Joi from '@hapi/joi';
import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

// 해당 id로 멤버쉽을 찾은 후에 ctx.state에 넣어주기.
export const getMemebershipById = async (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400; //Bad Request
    return;
  }
  try {
    const membership = await Membership.findById(id);
    //멤버쉽이 존재하지 않을 때
    if (!Membership) {
      ctx.status = 404; // Not Found
      return;
    }
    ctx.state.membership = membership;
    return next();
  } catch (e) {
    ctx.throw(500, e);
  }
};

//
/*
POST /api/memberships
{
  membershipName: // 멤버쉽 이름,
  membershipNumber: // 멤버쉽번호,
  membershipColor: // 멤버쉽 카드 색
}
*/
// 멤버쉽카드 등록
export const add = async (ctx) => {
  const schema = Joi.object().keys({
    membershipName: Joi.string().required(),
    membershipNumber: Joi.number().integer().required(),
    membershipColor: Joi.string().required(),
  });

  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const {
    membershipName,
    membershipNumber,
    membershipColor,
  } = ctx.request.body;
  const membership = new Membership({
    membershipName,
    membershipNumber,
    membershipColor,
    user: ctx.state.user,
  });
  try {
    await membership.save();
    ctx.body = membership;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
GET /api/memberships
*/
// 멤버쉽카드 리스트 조회
export const list = async (ctx) => {
  try {
    // 서버에 쿼리 요청 (멤버쉽카드 리스트 조회)
    const memberships = await Membership.find().exec();
    ctx.body = memberships;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
GET /api/memberships/:id
*/
// 특정 멤버쉽 카드 조회
export const read = (ctx) => {
  ctx.body = ctx.state.membership;
};

/*
DELETE /api/memberships/:id
*/
// 특정 멤버쉽 삭제
export const remove = async (ctx) => {
  const { id } = ctx.params;
  try {
    await Membership.findByIdAndRemove(id).exec();
    ctx.status = 204; // No Content(성공하기는 했지만 응답할 데이터는 없음)
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
PATCH /api/memberships/:id
{
  membershipName: // 멤버쉽 이름,
  membershipNumber: // 멤버쉽번호,
  membershipColor: // 멤버쉽 카드 색
}
*/
// 특정 멤버쉽 수정
export const update = async (ctx) => {
  const { id } = ctx.params;
  const schema = Joi.object().keys({
    membershipName: Joi.string(),
    membershipNumber: Joi.number(),
    membershipColor: Joi.string(),
  });

  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }
  try {
    const membership = await Membership.findByIdAndUpdate(
      id,
      ctx.request.body,
      {
        new: true, // 업데이트된 데이터 반환
      },
    ).exec();
    if (!membership) {
      ctx.status = 404;
      return;
    }
    ctx.body = membership;
  } catch (e) {
    ctx.throw(500, e);
  }
};
