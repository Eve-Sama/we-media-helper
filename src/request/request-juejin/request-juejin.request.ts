import axios, { AxiosPromise } from 'axios-esm';
import { Count, JuejinResponse, User, UserBasicInfo } from './request-juejin.interface';

export function getCount(): AxiosPromise<JuejinResponse<Count>> {
  return axios({
    method: 'GET',
    url: `https://api.juejin.cn/interact_api/v1/message/count`,
  });
}

export function getUser(): AxiosPromise<JuejinResponse<User>> {
  return axios({
    method: 'GET',
    url: `https://api.juejin.cn/user_api/v1/user/get`,
  });
}

export function getUserBaiscInfo(): AxiosPromise<JuejinResponse<UserBasicInfo>> {
  return axios({
    method: 'GET',
    url: `https://api.juejin.cn/user_api/v1/user/get`,
  });
}
