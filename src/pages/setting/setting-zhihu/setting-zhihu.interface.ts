import { v4 as uuidv4 } from 'uuid';

import { DataCardGroup } from '../../common/group-setting/group.interface';
import { StorageData } from '../../common/template/display-template/display-template.interface';

export const ZhihuOptionalCardGroupList: DataCardGroup[] = [
  {
    group: '数据总量',
    children: [
      { label: '阅读总量', value: 'pv', changeValue: [], totalValue: ['pv'], url: 'https://www.zhihu.com/creator/analytics/work/all' },
      { label: '播放总量', value: 'play', changeValue: [], totalValue: ['play'], url: 'https://www.zhihu.com/creator/analytics/work/all' },
      { label: '喜欢总量', value: 'like_and_reaction', changeValue: [], totalValue: ['like_and_reaction'], url: 'https://www.zhihu.com/creator/analytics/work/all' },
      { label: '评论总量', value: 'comment', changeValue: [], totalValue: ['comment'], url: 'https://www.zhihu.com/creator/analytics/work/all' },
      { label: '收藏总量', value: 'collect', changeValue: [], totalValue: ['collect'], url: 'https://www.zhihu.com/creator/analytics/work/all' },
      { label: '分享总量', value: 'share', changeValue: [], totalValue: ['share'], url: 'https://www.zhihu.com/creator/analytics/work/all' },
    ],
  },
  {
    group: '实时交互',
    children: [{ label: '私信', value: 'messages_count', changeValue: [], totalValue: ['messages_count'], url: 'https://www.zhihu.com/messages' }],
  },
];

export const ZhihuDefaultConfig: StorageData = {
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
            type: 'pv',
            notify: false,
          },
          {
            type: 'play',
            notify: false,
          },
          {
            type: 'like_and_reaction',
            notify: false,
          },
          {
            type: 'comment',
            notify: false,
          },
          {
            type: 'collect',
            notify: false,
          },
          {
            type: 'share',
            notify: false,
          },
        ],
        uuid: uuidv4(),
        columnNum: 3,
      },
      {
        label: '消息通知',
        cardList: [
          {
            type: 'messages_count',
            notify: true,
          },
        ],
        uuid: uuidv4(),
        columnNum: 1,
      },
    ],
  },
  dataCardList: [],
};
