// 5개의 라우터

import Router from 'koa-router';
import * as cardsCtrl from './cards.ctrl';
import cheskLoggedIn from '../../lib/cheskLoggedIn';

const cards = new Router();

cards.get('/', cheskLoggedIn, cardsCtrl.list);
cards.post('/', cheskLoggedIn, cardsCtrl.write);
cards.get('/:id', cheskLoggedIn, cardsCtrl.read);
cards.delete('/:id', cheskLoggedIn, cardsCtrl.remove);
cards.patch('/:id', cheskLoggedIn, cardsCtrl.update);

cards.use('/:id', cardsCtrl.checkObjectId, cards.routes());

export default cards;
