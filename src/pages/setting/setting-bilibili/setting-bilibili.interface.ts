import { v4 as uuidv4 } from 'uuid';

import { DataCardGroup } from '../../common/group-setting/group.interface';
import { StorageData } from '../../common/template/display-template/display-template.interface';

export const BilibiliOptionalCardGroupList: DataCardGroup[] = [
  {
    group: '数据总量',
    children: [
      { label: '粉丝总量', value: 'fan', changeValue: ['incr_fans'], totalValue: ['total_fans'], url: 'https://member.bilibili.com/platform/home' },
      { label: '播放总量', value: 'click', changeValue: ['incr_click'], totalValue: ['total_click'], url: 'https://member.bilibili.com/platform/home' },
      { label: '评论总量', value: 'totalReply', changeValue: ['incr_reply'], totalValue: ['total_reply'], url: 'https://member.bilibili.com/platform/home' },
      { label: '弹幕总量', value: 'dm', changeValue: ['incr_dm'], totalValue: ['total_dm'], url: 'https://member.bilibili.com/platform/home' },
      { label: '点赞总量', value: 'totalLike', changeValue: ['inc_like'], totalValue: ['total_like'], url: 'https://member.bilibili.com/platform/home' },
      { label: '分享总量', value: 'share', changeValue: ['inc_share'], totalValue: ['total_share'], url: 'https://member.bilibili.com/platform/home' },
      { label: '收藏总量', value: 'favorite', changeValue: ['inc_fav'], totalValue: ['total_fav'], url: 'https://member.bilibili.com/platform/home' },
      { label: '投币总量', value: 'coin', changeValue: ['inc_coin'], totalValue: ['total_coin'], url: 'https://member.bilibili.com/platform/home' },
    ],
  },
  {
    group: '实时交互',
    children: [
      { label: '回复我的', value: 'reply', changeValue: [], totalValue: ['reply'], url: 'https://message.bilibili.com/#/reply' },
      { label: '@我的', value: 'at', changeValue: [], totalValue: ['at'], url: 'https://message.bilibili.com/#/at' },
      { label: '收到的赞', value: 'like', changeValue: [], totalValue: ['like'], url: 'https://message.bilibili.com/#/love' },
      { label: '系统消息', value: 'systemMessage', changeValue: [], totalValue: ['sys_msg'], url: 'https://message.bilibili.com/#/system' },
      { label: '我的消息', value: 'message', changeValue: [], totalValue: ['follow_unread', 'unfollow_unread'], url: 'https://message.bilibili.com/#/whisper' },
    ],
  },
];

export const BilibiliDefaultConfig: StorageData = {
  config: {
    cookie: '',
    refreshTime: '00:00:30',
    showCountdown: true,
    enableJumpLink: false,
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
