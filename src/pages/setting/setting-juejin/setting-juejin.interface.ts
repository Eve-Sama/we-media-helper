import { Group } from '../common/group-setting/group-setting';
import { v4 as uuidv4 } from 'uuid';

export interface JuejinConfig {
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

export const JuejinDefaultConfig: JuejinConfig = {
  config: {
    cookie: '',
    refreshTime: '00:00:30',
    showCountdown: true,
    groupList: [
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

export const JuejinCardList = [
  { label: '评论消息', value: 'reply' },
  { label: '点赞消息', value: 'like' },
  { label: '关注消息', value: 'follow' },
  { label: '系统消息', value: 'system' },
  { label: '职位沟通', value: 'job' },
];
