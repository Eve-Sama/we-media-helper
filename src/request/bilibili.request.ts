import axios, { AxiosPromise } from 'axios-esm';

export function getStat(): AxiosPromise<any> {
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

export function getAccount(): AxiosPromise<any> {
  return axios({
    method: 'GET',
    url: `https://api.bilibili.com/x/member/web/account`,
  });
}
