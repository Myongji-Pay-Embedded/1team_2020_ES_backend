import Router from 'koa-router';
import cards from './card';
import auth from './auth';
import account from './account';

const api = new Router();
//api.use('/cards', cards.routes());
api.use('/auth', auth.routes());
api.use('/account', account.routes());

//라우터 보내기
export default api;
