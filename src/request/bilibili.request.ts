import axios, { AxiosPromise } from 'axios-esm';

export function getStat(): AxiosPromise<any> {
  return axios({
    method: 'GET',
    url: `https://member.bilibili.com/x/web/index/stat`,
  });
}
