import { v4 as uuidv4 } from 'uuid';

import { DataCardGroup } from '../../common/group-setting/group.interface';
import { StorageData } from '../../common/template/display-template/template.interface';

export const JuejinDefaultConfig: StorageData = {
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
            type: 'likeTotal',
            notify: false,
          },
          {
            type: 'read',
            notify: false,
          },
          {
            type: 'power',
            notify: false,
          },
          {
            type: 'fan',
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
            type: 'message',
            notify: true,
          },
          {
            type: 'system',
            notify: true,
          },
        ],
        uuid: uuidv4(),
        columnNum: 3,
      },
    ],
  },
  dataCardList: [],
};

export const JuejinOptionalCardGroupList: DataCardGroup[] = [
  {
    group: '数据总量',
    children: [
      { label: '点赞总量', value: 'likeTotal', changeValue: [], totalValue: ['got_digg_count'], url: '' },
      { label: '阅读总量', value: 'read', changeValue: [], totalValue: ['got_view_count'], url: '' },
      { label: '掘力值', value: 'power', changeValue: [], totalValue: ['power'], url: '' },
      { label: '粉丝总量', value: 'fan', changeValue: [], totalValue: ['follower_count'], url: '' },
    ],
  },
  {
    group: '实时交互',
    children: [
      { label: '评论消息', value: 'reply', changeValue: [], totalValue: ['3'], url: 'https://juejin.cn/notification' },
      { label: '点赞消息', value: 'like', changeValue: [], totalValue: ['1'], url: 'https://juejin.cn/notification/digg' },
      { label: '关注消息', value: 'follow', changeValue: [], totalValue: ['2'], url: 'https://juejin.cn/notification/follow' },
      { label: '私信', value: 'message', changeValue: [], totalValue: ['7'], url: 'https://juejin.cn/notification/im' },
      { label: '系统消息', value: 'system', changeValue: [], totalValue: ['4'], url: 'https://juejin.cn/notification/system' },
    ],
  },
];
