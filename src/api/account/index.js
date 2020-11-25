// 4개의 라우터

import Router from 'koa-router';
import * as accountCtrl from './account.ctrl';

const account = new Router();

account.get('/list', accountCtrl.list); // 사용자의 등록된 계좌정보 조회
account.get('/balance/:fintech_use_num', accountCtrl.balance); // 사용자의 계좌 잔액 조회
account.get('/transaction_list', accountCtrl.transactionList);  //계좌 거래내역 조회
account.get('/transaction_all', accountCtrl.transactionAll);  //통합거래내역 조회
account.get('/transaction_graph', accountCtrl.transactionGraph);  //통합거래내역 조회

account.post('/transfer', accountCtrl.transfer);


//account.post('/wire', accountCtrl.wire);


export default account;
