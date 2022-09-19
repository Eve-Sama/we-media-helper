import axios, { AxiosPromise } from 'axios-esm';
import { Count } from './juejin.interface';

export function getCount(): AxiosPromise<Count> {
  return axios({
    method: 'GET',
    url: `https://api.juejin.cn/interact_api/v1/message/count`,
  });
}
