import { DataCardGroup } from '../common/group-setting/group.interface';
import { v4 as uuidv4 } from 'uuid';
import { StorageData } from '../../common/template/template.interface';

export const JuejinDefaultConfig: StorageData = {
  config: {
    cookie: '',
    refreshTime: '00:00:30',
    showCountdown: true,
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
            type: 'system',
            notify: true,
          },
        ],
        uuid: uuidv4(),
        columnNum: 2,
      },
    ],
  },
  dataCardList: [],
};

export const JuejinCardGroupList: DataCardGroup[] = [
  {
    group: '数据总量',
    children: [
      { label: '点赞总量', value: 'likeTotal', changeValue: [], totalValue: ['got_digg_count'] },
      { label: '阅读总量', value: 'read', changeValue: [], totalValue: ['got_view_count'] },
      { label: '掘力值', value: 'power', changeValue: [], totalValue: ['power'] },
      { label: '粉丝总量', value: 'fan', changeValue: [], totalValue: ['follower_count'] },
    ],
  },
  {
    group: '实时交互',
    children: [
      { label: '评论消息', value: 'reply', changeValue: [], totalValue: ['3'] },
      { label: '点赞消息', value: 'like', changeValue: [], totalValue: ['1'] },
      { label: '关注消息', value: 'follow', changeValue: [], totalValue: ['2'] },
      { label: '系统消息', value: 'system', changeValue: [], totalValue: ['4'] },
      { label: '职位沟通', value: 'job', changeValue: [], totalValue: ['5'] },
    ],
  },
];
