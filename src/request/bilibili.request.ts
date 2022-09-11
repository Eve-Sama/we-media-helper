import axios, { AxiosPromise } from 'axios-esm';

export function getStat(): AxiosPromise<any> {
  return axios({
    method: 'GET',
    url: `/bilibili/x/web/index/stat`,
  });
}
