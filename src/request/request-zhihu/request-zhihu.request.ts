import axios, { AxiosPromise } from 'axios-esm';

import { BasicInfo, Message } from './request-zhihu.interface';

export function getBaiscInfo(): AxiosPromise<BasicInfo> {
  return axios({
    method: 'GET',
    url: `https://www.zhihu.com/api/v4/creators/analysis/realtime/member/aggr?tab=all`,
  });
}

export function getMessage(): AxiosPromise<Message> {
  return axios({
    method: 'GET',
    url: `https://www.zhihu.com/api/v4/me`,
  });
}
