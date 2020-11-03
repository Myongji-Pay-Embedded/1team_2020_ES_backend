// 4개의 라우터

import Router from 'koa-router';
import * as authCtrl from './account.ctrl';

const auth = new Router();

auth.post('/accounts', authCtrl.accounts);
auth.post('/wire', authCtrl.wire);
auth.post('/history', authCtrl.history);

export default account;
