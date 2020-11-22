// 4개의 라우터

import Router from 'koa-router';
import * as accountCtrl from './account.ctrl';

const account = new Router();

account.get('/list', accountCtrl.list); // 사용자의 등록된 계좌정보 조회
account.get('/balance/:fintech_use_num', accountCtrl.balance); // 사용자의 계좌 잔액 조회
//account.post('/account', accountCtrl.accounts); // 사용자의 계좌등록
//account.post('/wire', accountCtrl.wire);
//account.post('/history', accountCtrl.history);

export default account;
