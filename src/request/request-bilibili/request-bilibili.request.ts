import axios, { AxiosPromise } from 'axios';

import { Account, BilibiliResponse, Message, Stat, Unread } from './request-bilibili.interface';

export function getStat(): AxiosPromise<BilibiliResponse<Stat>> {
  return axios({
    method: 'GET',
    url: `https://member.bilibili.com/x/web/index/stat`,
  });
}

// export function getIncome(): AxiosPromise<BilibiliResponse<any>> {
//   return axios({
//     method: 'GET',
//     url: `https://member.bilibili.com/x/web/elec/income_center`,
//   });
// }

export function getAccount(): AxiosPromise<BilibiliResponse<Account>> {
  return axios({
    method: 'GET',
    url: `https://api.bilibili.com/x/member/web/account`,
  });
}

export function getUnread(): AxiosPromise<BilibiliResponse<Unread>> {
  return axios({
    method: 'GET',
    url: `https://api.bilibili.com/x/msgfeed/unread`,
  });
}

export function getMessage(): AxiosPromise<BilibiliResponse<Message>> {
  return axios({
    method: 'GET',
    url: `https://api.vc.bilibili.com/session_svr/v1/session_svr/single_unread`,
  });
}
