// 5개의 라우터

import Router from 'koa-router';
import * as cardsCtrl from './cards.ctrl';

const cards = new Router();

cards.get('/', cardsCtrl.list);
cards.post('/', cardsCtrl.write);
cards.get('/:id', cardsCtrl.read);
cards.delete('/:id', cardsCtrl.remove);
cards.patch('/:id', cardsCtrl.update);

export default cards;
