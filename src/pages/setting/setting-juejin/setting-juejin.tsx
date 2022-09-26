import { Button, Form, Input, Switch, TimePicker } from 'antd';
import moment from 'moment';
import { useRef } from 'react';
import { GroupSettingRef, GroupSetting } from '../common/group-setting/group-setting';
import styles from './style.module.scss';

const { TextArea } = Input;
const key = 'juejin';
const broadcastChannel = new BroadcastChannel('juejin');

export function SettingJuejin() {
  const storageData = window.electron.store.get(`${key}-data`);
  const config = storageData.config;
  // TimePicker 只接受 moment 类型的时间
  config.refreshTime = moment(config.refreshTime, 'HH:mm:ss');

  const groupSettingRef = useRef<GroupSettingRef>(null);

  const onSubmit = (values: any) => {
    const groupList = groupSettingRef.current.getData();
    Object.assign(config, { ...values, groupList });
    config.refreshTime = values.refreshTime.format('HH:mm:ss');
    window.electron.store.set(`${key}-data`, { ...storageData, config });
    broadcastChannel.postMessage(`${key}-init`);
  };

  const cardList = [
    { label: '评论消息', value: 'reply' },
    { label: '点赞消息', value: 'like' },
    { label: '关注消息', value: 'follow' },
    { label: '系统消息', value: 'system' },
    { label: '职位沟通', value: 'job' },
  ];

  return (
    <div className={styles['container']}>
      <Form name="basic" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} initialValues={{ ...config }} onFinish={onSubmit} autoComplete="off">
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
          <Button type="primary" htmlType="submit" block>
            应用
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
