import { Button, Divider, Form, Input, Switch, TimePicker } from 'antd';
import moment, { Moment } from 'moment';
import { useEffect, useRef, useState } from 'react';
import { GroupSettingRef, GroupSetting, Group } from '../common/group-setting/group-setting';
import styles from './style.module.scss';
import { v4 as uuidv4 } from 'uuid';

const { TextArea } = Input;
const key = 'juejin';
const broadcastChannel = new BroadcastChannel('juejin');

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

const defaultConfig: JuejinConfig = {
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

export function SettingJuejin() {
  const storageData = (window.electron.store.get(`${key}-data`) || defaultConfig) as JuejinConfig;
  const [config, setConfig] = useState<JuejinConfig['config']>(storageData.config);
  const groupSettingRef = useRef<GroupSettingRef>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    // TimePicker 只接受 moment 类型的时间
    const refreshTime = moment(config.refreshTime, 'HH:mm:ss');
    form.setFieldsValue({ ...config, refreshTime });
  }, [config]);

  const onSubmit = (values: any) => {
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
          <GroupSetting ref={groupSettingRef} cardList={JuejinCardList} groupList={config.groupList} />
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
