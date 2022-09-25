import axios, { AxiosPromise } from 'axios-esm';
import { Count, User } from './juejin.interface';

export function getCount(): AxiosPromise<Count> {
  return axios({
    method: 'GET',
    url: `https://api.juejin.cn/interact_api/v1/message/count`,
  });
}

export function getUser(): AxiosPromise<User> {
  return axios({
    method: 'GET',
    url: `https://api.juejin.cn/user_api/v1/user/get`,
  });
}
