// 4개의 라우터

import Router from 'koa-router';
import * as accountCtrl from './account.ctrl';

const account = new Router();

account.post('/accounts', accountCtrl.accounts);
account.post('/wire', accountCtrl.wire);
account.post('/history', accountCtrl.history);

export default account;
