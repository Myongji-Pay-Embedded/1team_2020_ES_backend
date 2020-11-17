// 5개의 라우터

import Router from 'koa-router';
import * as cardsCtrl from './cards.ctrl';
import checkLoggedIn from '../../lib/checkLoggedIn';

const cards = new Router();

// cards.get('/', checkLoggedIn, cardsCtrl.list);
// cards.post('/', checkLoggedIn, cardsCtrl.write);
// cards.get('/:id', checkLoggedIn, cardsCtrl.read);
// cards.delete('/:id', checkLoggedIn, cardsCtrl.remove);
// cards.patch('/:id', checkLoggedIn, cardsCtrl.update);

// cards.use('/:id', cardsCtrl.checkLoggedIn, cards.routes());

export default cards;
