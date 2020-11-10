// 4개의 라우터

import Router from 'koa-router';
import * as authCtrl from './auth.ctrl';

const auth = new Router();

auth.post('/register', authCtrl.register);
auth.post('/login', authCtrl.login);
auth.post('/check', authCtrl.check);
auth.post('/logout', authCtrl.logout);

auth.get('/authResult', authCtrl.authResult);
auth.post('', authCtrl.token);

export default auth;
