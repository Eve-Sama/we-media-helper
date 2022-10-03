import { Button, Divider, Form, Input, Switch, TimePicker } from 'antd';
import moment, { Moment } from 'moment';
import { useEffect, useRef, useState } from 'react';
import { Group, GroupSetting, GroupSettingRef } from '../common/group-setting/group-setting';
import styles from './style.module.scss';
import { v4 as uuidv4 } from 'uuid';

const { TextArea } = Input;
const key = 'bilibili';
const broadcastChannel = new BroadcastChannel(key);

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

const defaultConfig: BilibiliConfig = {
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

export function SettingBilibili() {
  const storageData = (window.electron.store.get(`${key}-data`) || defaultConfig) as BilibiliConfig;
  const [config, setConfig] = useState<BilibiliConfig['config']>(storageData.config);
  const groupSettingRef = useRef<GroupSettingRef>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    // TimePicker 只接受 moment 类型的时间
    const refreshTime = moment(config.refreshTime, 'HH:mm:ss');
    form.setFieldsValue({ ...config, refreshTime });
  }, [config]);

  const onSubmit = (values: BilibiliConfig['config']) => {
    const groupList = groupSettingRef.current.getData();
    Object.assign(config, { ...values, groupList });
    config.refreshTime = (values.refreshTime as unknown as Moment).format('HH:mm:ss');
    window.electron.store.set(`${key}-data`, { ...storageData, config });
    broadcastChannel.postMessage(`${key}-init`);
  };

  const resetConfig = () => {
    const refreshTime = moment(defaultConfig.config.refreshTime, 'HH:mm:ss');
    form.setFieldsValue({ ...defaultConfig.config, refreshTime });
    groupSettingRef.current.setGroupListData(defaultConfig.config.groupList);
    setConfig({ ...defaultConfig.config });
  };

  return (
    <div className={styles['container']}>
      <Form form={form} name="basic" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} onFinish={onSubmit} autoComplete="off">
        <Form.Item label="cookie" name="cookie">
          <TextArea rows={4} placeholder="Input your cookie" />
        </Form.Item>
        <Form.Item label="分组设置">
          <GroupSetting ref={groupSettingRef} cardList={BilibiliCardList} groupList={config.groupList} />
        </Form.Item>
        <Form.Item label="刷新间隔时间" name="refreshTime">
          <TimePicker />
        </Form.Item>
        <Form.Item label="显示倒计时" name="showCountdown" valuePropName="checked" tooltip={{ title: () => '只影响显示, 不影响倒计时刷新功能' }}>
          <Switch />
        </Form.Item>
        <Form.Item label="动态通知" name="notify" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
      <Divider></Divider>
      <div className={styles['btn-container']}>
        <Button type="primary" onClick={() => form.submit()}>
          应用
        </Button>
        <Button type="default" onClick={() => resetConfig()}>
          恢复默认
        </Button>
      </div>
    </div>
  );
}
