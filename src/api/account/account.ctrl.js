// 계좌 인증 API
import Joi from '@hapi/joi';
import Account from '../../models/account';
import User from '../../models/user';
import mongoose from 'mongoose';

const axios = require('axios');

//bank_tran_num 생성하여 return
export const getBankTranNumber = (ctx) => {
  return transId;
};

/*
GET /api/account/list
*/
//계좌 목록 조회
export const list = async (ctx) => {
  const user = await User.findById(ctx.state.user._id);

  const access_token = user.access_token;
  const user_seq_no = user.user_seq_no;

  const url = 'https://testapi.openbanking.or.kr/v2.0/account/list';
  const config = {
    headers: { Authorization: 'Bearer '.concat(access_token) },
    params: {
      user_seq_no: user_seq_no,
      include_cancel_yn: 'N',
      sort_order: 'D',
    },
  };
  axios
    .get(url, config)
    .then((res) => {
      console.log(res.data);
      //계좌 정보 받아오기까지 성공. 이후 저장 등 처리 해야 함.
    })
    .catch((err) => {
      console.log(err.response);
    });
};

/*
GET /api/account/balance/:fintech_use_num
*/
//계좌 잔액 조회
export const balance = async (ctx) => {
  const { fintech_use_num } = ctx.params;
  const user = await User.findById(ctx.state.user._id);
  const access_token = user.access_token;

  let countnum = Math.floor(Math.random() * 1000000000) + 1;
  const bank_tran_id = 'T991650330U' + countnum;

  //현재 날짜 : YYYYMMDDHHmmSS(14자리)
  let today = new Date();
  const tran_dtime =
    today.getFullYear().toString() +
    (today.getMonth() + 1).toString() +
    today.getDate().toString() +
    today.getHours().toString() +
    today.getMinutes().toString() +
    today.getSeconds().toString();

  //console.log(ctx.params);
  console.log(fintech_use_num);
  console.log(bank_tran_id);
  console.log(tran_dtime);

  const url = 'https://testapi.openbanking.or.kr/v2.0/account/balance/fin_num';
  const config = {
    headers: { Authorization: 'Bearer '.concat(access_token) },
    params: {
      bank_tran_id: bank_tran_id,
      fintech_use_num: fintech_use_num,
      tran_dtime: tran_dtime,
    },
  };
  axios
    .get(url, config)
    .then((res) => {
      console.log(res.data);
      //계좌 정보 받아오기까지 성공. 이후 저장 등 처리 해야 함.
    })
    .catch((err) => {
      console.log(err.response);
    });
};
