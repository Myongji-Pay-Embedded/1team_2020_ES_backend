// 계좌 인증 API
import Joi from '@hapi/joi';
import Account from '../../models/account';
import User from '../../models/user';
import mongoose from 'mongoose';
import { read } from '../card/cards.ctrl';

const axios = require('axios');

//bank_tran_id 생성 함수
function getBankTranId(){
  let countnum = Math.floor(Math.random()* 1000000000) + 1;
  let bank_tran_id = "T991650330U" + countnum;
  return bank_tran_id;
}

//tran_dtime. 현재 시간 return
function getTime(){
  //현재 날짜 : yyyyMMddHHmmSS(14자리)
  let today = new Date();
  let year = today.getFullYear().toString();
  let month = ('0' + (today.getMonth() + 1)).slice(-2);
  let day = ('0' + today.getDate()).slice(-2);
  let hour = ('0' + today.getHours()).slice(-2);
  let minute = ('0' + today.getMinutes()).slice(-2);
  let second = ('0' + today.getSeconds()).slice(-2);
  
  return year + month + day + hour + minute + second;
}

/*
GET /api/account/list
*/
//계좌 목록 조회 (testapi에서 받아온 값을 바로 body로 전송)
export const list = async (ctx) => {
  const user = await User.findById(ctx.state.user._id);
  
  const access_token = user.access_token;
  const user_seq_no = user.user_seq_no;

  const url = 'https://testapi.openbanking.or.kr/v2.0/account/list';
  const config = {
    headers: {'Authorization': 'Bearer '.concat(access_token)},
    params: { user_seq_no: user_seq_no,
              include_cancel_yn: 'N',
              sort_order: 'D' }
  };
  
  await axios
    .get(url, config)
    .then((res) => {
      ctx.body = res.data.res_list;
    })
    .catch((err) => {
      if(err.response){
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      }
      else if(err.request){
        console.log(err.request);
      }
      else{
        console.log("Error: ", err);
      }
      console.log(err.config);
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

  const url = "https://testapi.openbanking.or.kr/v2.0/account/balance/fin_num";
  const config = {
    headers: {'Authorization': 'Bearer '.concat(access_token)},
    params: { bank_tran_id: getBankTranId(),
              fintech_use_num: fintech_use_num,
              tran_dtime: getTime() }
  };
  await axios
    .get(url, config)
    .then((res) => {
      //계좌 잔액 return
      ctx.body = res.data.balance_amt;
    })
    .catch((err) => {
      console.log(err.response);
    });

};

/*
GET /api/account/transaction_list
*/
//거래내역 조회
export const transactionList = async (ctx) => {
  //받을거 : 조회구분 (전체, 입금, 출금), 조회 시작일자, 조회 종료일자,
  const { fintech_use_num, inquiry_type, from_date, to_date } = ctx.query;
  const user = await User.findById(ctx.state.user._id);
  const access_token = user.access_token;

  console.log(fintech_use_num);

  const url = "https://testapi.openbanking.or.kr/v2.0/account/transaction_list/fin_num";
  const config = {
    headers: {'Authorization': 'Bearer '.concat(access_token)},
    params: { bank_tran_id: getBankTranId(),
              fintech_use_num: fintech_use_num,
              inquiry_type: inquiry_type,
              inquiry_base: 'D',
              from_date: from_date,
              to_date: to_date,
              sort_order: 'D',
              tran_dtime: getTime() }
  };
  await axios
    .get(url, config)
    .then((res) => {
      //거래 내역 return
      ctx.body = res.data.res_list;
    })
    .catch((err) => {
      console.log(err.response);
    });
};

//출금 이체
export const transfer = async (ctx) => {
  const { fintech_use_num } = ctx.params;
  const user = await User.findById(ctx.state.user._id);
  const access_token = user.access_token;

  const url = "https://testapi.openbanking.or.kr/v2.0/transfer/withdraw/fin_num";
  const config = {
    headers: {'Authorization': 'Bearer '.concat(access_token)},
    params: { 
      bank_tran_id: getBankTranId(),
      cntr_account_type: 'N',
      cntr_account_num: '',
      dps_print_content: '',
      fintech_use_num: fintech_use_num,
      wd_print_content: '',
      tran_amt: '',
      tran_dtime: getTime(),
      req_client_name: '',
      req_client_fintech_use_num: fintech_use_num,
      }
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
}
