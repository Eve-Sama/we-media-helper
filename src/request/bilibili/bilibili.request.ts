import axios, { AxiosPromise } from 'axios-esm';
import { Account, Message, Stat, Unread } from './bilibili.interface';

export function getStat(): AxiosPromise<Stat> {
  return axios({
    method: 'GET',
    url: `https://member.bilibili.com/x/web/index/stat`,
  });
}

export function getIncome(): AxiosPromise<any> {
  return axios({
    method: 'GET',
    url: `https://member.bilibili.com/x/web/elec/income_center`,
  });
}

export function getAccount(): AxiosPromise<Account> {
  return axios({
    method: 'GET',
    url: `https://api.bilibili.com/x/member/web/account`,
  });
}

export function getUnread(): AxiosPromise<Unread> {
  return axios({
    method: 'GET',
    url: `https://api.bilibili.com/x/msgfeed/unread`,
  });
}

export function getMessage(): AxiosPromise<Message> {
  return axios({
    method: 'GET',
    url: `https://api.vc.bilibili.com/session_svr/v1/session_svr/single_unread`,
  });
}
