// // 5개의 라우터

// import Router from 'koa-router';
// import * as cardsCtrl from './cards.ctrl';
// import checkLoggedIn from '../../lib/checkLoggedIn';

// const cards = new Router();

// cards.get('/', checkLoggedIn, cardsCtrl.list);
// cards.post('/', checkLoggedIn, cardsCtrl.add);

// const card = new Router(); // /api/cards/:id
// card.get('/', checkLoggedIn, cardsCtrl.read);
// card.delete('/', checkLoggedIn, cardsCtrl.remove);
// card.patch('/', checkLoggedIn, cardsCtrl.update);

// cards.use('/:id', cardsCtrl.getCardById, card.routes());
