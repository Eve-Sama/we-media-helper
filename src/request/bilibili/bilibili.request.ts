import axios, { AxiosPromise } from 'axios-esm';
import { Account, Stat } from './bilibili.interface';

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
