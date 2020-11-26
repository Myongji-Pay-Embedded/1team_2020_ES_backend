// 5개의 라우터

import Router from 'koa-router';
import * as membershipCtrl from './membership.ctrl';
import checkLoggedIn from '../../lib/checkLoggedIn';

const memberships = new Router();

memberships.post('/', checkLoggedIn, membershipCtrl.add); // 멤버쉽 추가
memberships.get('/', checkLoggedIn, membershipCtrl.list); // 사용자의 모든 멤버쉽 조회
const membership = new Router(); // /api/memberships/:id

membership.get('/', checkLoggedIn, membershipCtrl.read); // 특정 멤버쉽 조회
membership.delete('/', checkLoggedIn, membershipCtrl.remove); // 특정 멤버쉽 삭제
membership.patch('/', checkLoggedIn, membershipCtrl.update); // 특정 멤버쉽 정보 수정

memberships.use('/:id', membershipCtrl.getMemebershipById, membership.routes());

export default memberships;
