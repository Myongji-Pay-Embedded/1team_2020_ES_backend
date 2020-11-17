// 5개의 라우터

import Router from 'koa-router';
import * as membershipCtrl from './membership.ctrl';
import checkLoggedIn from '../../lib/checkLoggedIn';

const memberships = new Router();

memberships.get('/', checkLoggedIn, membershipCtrl.list);
memberships.post('/', checkLoggedIn, membershipCtrl.add);

const membership = new Router(); // /api/memberships/:id
membership.get('/', checkLoggedIn, membershipCtrl.read);
membership.delete('/', checkLoggedIn, membershipCtrl.remove);
membership.patch('/', checkLoggedIn, membershipCtrl.update);

memberships.use('/:id', membershipCtrl.getMemebershipById, membership.routes());
export default memberships;
