import { DataCardGroup } from '../common/group-setting/group.interface';
import { v4 as uuidv4 } from 'uuid';
import { StorageData } from '../../common/template/template.interface';

export const BilibiliDefaultConfig: StorageData = {
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

export const BilibiliCardGroupList: DataCardGroup[] = [
  {
    group: '数据总量',
    children: [
      { label: '粉丝总量', value: 'fan', changeValue: ['incr_fans'], totalValue: ['total_fans'] },
      { label: '播放总量', value: 'click', changeValue: ['incr_click'], totalValue: ['total_click'] },
      { label: '评论总量', value: 'totalReply', changeValue: ['incr_reply'], totalValue: ['total_reply'] },
      { label: '弹幕总量', value: 'dm', changeValue: ['incr_dm'], totalValue: ['total_dm'] },
      { label: '点赞总量', value: 'totalLike', changeValue: ['inc_like'], totalValue: ['total_like'] },
      { label: '分享总量', value: 'share', changeValue: ['inc_share'], totalValue: ['total_share'] },
      { label: '收藏总量', value: 'favorite', changeValue: ['inc_fav'], totalValue: ['total_fav'] },
      { label: '投币总量', value: 'coin', changeValue: ['inc_coin'], totalValue: ['total_coin'] },
    ],
  },
  {
    group: '实时交互',
    children: [
      { label: '回复我的', value: 'reply', changeValue: [], totalValue: ['reply'] },
      { label: '@我的', value: 'at', changeValue: [], totalValue: ['at'] },
      { label: '收到的赞', value: 'like', changeValue: [], totalValue: ['like'] },
      { label: '系统消息', value: 'systemMessage', changeValue: [], totalValue: ['sys_msg'] },
      { label: '我的消息', value: 'message', changeValue: [], totalValue: ['follow_unread', 'unfollow_unread'] },
    ],
  },
];
