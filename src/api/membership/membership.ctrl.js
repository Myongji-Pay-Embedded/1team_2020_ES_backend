import Membership from '../../models/membership';
import Joi from '@hapi/joi';
import mongoose from 'mongoose';

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
  const {
    membershipName,
    membershipNumber,
    membershipColor,
  } = ctx.request.body;
  const membership = new Membership({
    membershipName,
    membershipNumber,
    membershipColor,
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
export const read = async (ctx) => {
  const { id } = ctx.params;
  try {
    const membership = await Membership.findById(id).exec();
    if (!membership) {
      ctx.status = 404; // Not Found
      return;
    }
    ctx.body = membership;
  } catch (e) {
    ctx.throw(500, e);
  }
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
