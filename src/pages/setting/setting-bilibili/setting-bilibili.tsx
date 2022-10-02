import { Button, Form, Input, Switch, TimePicker } from 'antd';
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
    notify: boolean;
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
    notify: true,
    groupList: [
      {
        label: '基础数据',
        cardList: ['fan', 'click', 'totalReply', 'dm', 'totalLike', 'share', 'favorite', 'coin'],
        uuid: uuidv4(),
      },
      {
        label: '消息通知',
        cardList: ['reply', 'at', 'systemMessage', 'message'],
        uuid: uuidv4(),
      },
    ],
  },
  dataCardList: [],
};

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
    console.log(config, `config`);
    window.electron.store.set(`${key}-data`, { ...storageData, config });
    broadcastChannel.postMessage(`${key}-init`);
  };

  const resetConfig = () => {
    console.log('resetConfig');
    // setStorageData(defaultConfig);
    const refreshTime = moment(defaultConfig.config.refreshTime, 'HH:mm:ss');
    form.setFieldsValue({ ...defaultConfig.config, refreshTime });
    groupSettingRef.current.setGroupListData(defaultConfig.config.groupList);
    setConfig(defaultConfig.config);
  };

  const cardList = [
    { label: '粉丝量', value: 'fan' },
    { label: '播放量', value: 'click' },
    { label: '评论', value: 'totalReply' },
    { label: '弹幕', value: 'dm' },
    { label: '点赞', value: 'totalLike' },
    { label: '分享', value: 'share' },
    { label: '收藏', value: 'favorite' },
    { label: '投币', value: 'coin' },
    { label: '回复我的', value: 'reply' },
    { label: '@我的', value: 'at' },
    { label: '收到的赞', value: 'like' },
    { label: '系统消息', value: 'systemMessage' },
    { label: '我的消息', value: 'message' },
  ];

  return (
    <div className={styles['container']}>
      <Form form={form} name="basic" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} onFinish={onSubmit} autoComplete="off">
        <Form.Item label="cookie" name="cookie">
          <TextArea rows={4} placeholder="Input your cookie" />
        </Form.Item>
        <Form.Item label="分组设置">
          <GroupSetting ref={groupSettingRef} cardList={cardList} groupList={config.groupList} />
        </Form.Item>
        <Form.Item label="刷新间隔" name="refreshTime">
          <TimePicker />
        </Form.Item>
        <Form.Item label="显示倒计时" name="showCountdown" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="动态通知" name="notify" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4, span: 24 }}>
          <div className={styles['btn-container']}>
            <Button type="primary" htmlType="submit">
              应用
            </Button>
            <Button type="default" onClick={() => resetConfig()}>
              恢复默认
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}
