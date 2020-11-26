// 4개의 라우터

import Router from 'koa-router';
import * as authCtrl from './auth.ctrl';

const auth = new Router();

auth.post('/register', authCtrl.register);
auth.post('/login', authCtrl.login);
auth.post('/auto_login', authCtrl.autoLogin);
auth.post('/check', authCtrl.check);
auth.post('/logout', authCtrl.logout);
auth.post('/checkapppwd', authCtrl.checkappkpwd);
auth.post('/checkpwd', authCtrl.checkpwd);
//auth.patch('/register/:id', authCtrl.checkObjectId, authCtrl.pwdupdate);
auth.patch('/register', authCtrl.checkObjectId, authCtrl.update);
auth.post('/isExist', authCtrl.isExist);
auth.get('/authResult', authCtrl.authResult);
auth.delete('/:id', authCtrl.remove);

auth.get('/count', authCtrl.count);

export default auth;
