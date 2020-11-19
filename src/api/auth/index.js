// 4개의 라우터

import Router from 'koa-router';
import * as authCtrl from './auth.ctrl';

const auth = new Router();

auth.post('/register', authCtrl.register);
auth.post('/login', authCtrl.login);
auth.post('/check', authCtrl.check);
auth.post('/logout', authCtrl.logout);
auth.post('/checkapppwd', authCtrl.checkappkpwd);
//auth.patch('/register/:id', authCtrl.checkObjectId, authCtrl.pwdupdate);
auth.patch('/register/:id', authCtrl.checkObjectId, authCtrl.update);
auth.post('/isExist', authCtrl.isExist);
auth.get('/authResult', authCtrl.authResult);

export default auth;
