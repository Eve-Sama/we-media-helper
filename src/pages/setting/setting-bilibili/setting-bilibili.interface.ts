import { Group } from '../common/group-setting/group-setting';
import { v4 as uuidv4 } from 'uuid';

export interface BilibiliConfig {
  /** 偏好设置 */
  config: {
    cookie: string;
    refreshTime: string;
    showCountdown: boolean;
    groupList: Group[];
  };
  /** 卡片最新数据, 用于推送提醒 */
  dataCardList: Array<{ type: string; value: number }>;
}

export const BilibiliDefaultConfig: BilibiliConfig = {
  config: {
    cookie: '',
    refreshTime: '00:00:30',
    showCountdown: true,
    groupList: [
      {
        label: '基础数据',
        cardList: [
          {
            type: 'fan',
            notify: false,
          },
          {
            type: 'click',
            notify: false,
          },
          {
            type: 'totalReply',
            notify: false,
          },
          {
            type: 'dm',
            notify: false,
          },
          {
            type: 'totalLike',
            notify: false,
          },
          {
            type: 'share',
            notify: false,
          },
          {
            type: 'favorite',
            notify: false,
          },
          {
            type: 'coin',
            notify: false,
          },
        ],
        uuid: uuidv4(),
        columnNum: 4,
      },
      {
        label: '消息通知',
        cardList: [
          {
            type: 'reply',
            notify: true,
          },
          {
            type: 'at',
            notify: true,
          },
          {
            type: 'systemMessage',
            notify: true,
          },
          {
            type: 'message',
            notify: true,
          },
        ],
        uuid: uuidv4(),
        columnNum: 4,
      },
    ],
  },
  dataCardList: [],
};

export const BilibiliCardList = [
  { label: '粉丝总量', value: 'fan' },
  { label: '播放总量', value: 'click' },
  { label: '评论总量', value: 'totalReply' },
  { label: '弹幕总量', value: 'dm' },
  { label: '点赞总量', value: 'totalLike' },
  { label: '分享总量', value: 'share' },
  { label: '收藏总量', value: 'favorite' },
  { label: '投币总量', value: 'coin' },
  { label: '回复我的', value: 'reply' },
  { label: '@我的', value: 'at' },
  { label: '收到的赞', value: 'like' },
  { label: '系统消息', value: 'systemMessage' },
  { label: '我的消息', value: 'message' },
];
