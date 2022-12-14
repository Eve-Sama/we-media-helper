import axios, { AxiosPromise } from 'axios';

import { BasicInfo, Follow, Message } from './request-zhihu.interface';

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

export function getFollow(): AxiosPromise<Follow> {
  return axios({
    method: 'GET',
    url: `https://www.zhihu.com/api/v4/creators/analysis/aggregation/tab/follow/detail?day=-1`,
  });
}
