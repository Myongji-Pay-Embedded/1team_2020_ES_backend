// 5개의 라우터

import Router from 'koa-router';
import * as cardsCtrl from './cards.ctrl';
import checkLoggedIn from '../../lib/checkLoggedIn';

const cards = new Router();

cards.post('/', checkLoggedIn, cardsCtrl.add); // 사용자 카드 신규 등록
cards.get('/', checkLoggedIn, cardsCtrl.list); // 사용자의 카드 조회
const card = new Router(); // /api/cards/:id

card.get('/', checkLoggedIn, cardsCtrl.read); // 특정 카드 조회
card.delete('/', checkLoggedIn, cardsCtrl.remove); // 특정 카드 삭제
cards.use('/:id', cardsCtrl.getCardById, card.routes());

export default cards;
