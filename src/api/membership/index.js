// 5개의 라우터

import Router from 'koa-router';
import * as membershipCtrl from './membership.ctrl.ctrl';
import checkLoggedIn from '../../lib/checkLoggedIn';

const memberships = new Router();

memberships.get('/', checkLoggedIn, membershipCtrl.list);
memberships.post('/', checkLoggedIn, membershipCtrl.add);

const membership = new Router(); // /api/memberships/:id
membership.get('/:id', checkLoggedIn, membershipCtrl.read);
membership.delete('/:id', checkLoggedIn, membershipCtrl.remove);
membership.patch('/:id', checkLoggedIn, membershipCtrl.update);

memberships.use('/:id', membershipCtrl.checkObjectId, membership.routes());
export default memberships;
