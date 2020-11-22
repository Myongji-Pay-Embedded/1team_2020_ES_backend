// 계좌 인증 API
import Joi from '@hapi/joi';
import Account from '../../models/account';
import User from '../../models/user';
import mongoose from 'mongoose';

const axios = require('axios');

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
    headers: {'Authorization': 'Bearer '.concat(access_token)},
    params: { user_seq_no: user_seq_no,
              include_cancel_yn: 'N',
              sort_order: 'D' }
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