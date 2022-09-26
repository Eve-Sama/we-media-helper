import { Button, Form, Input, Switch, TimePicker } from 'antd';
import moment from 'moment';
import { useRef } from 'react';
import { GroupSetting, GroupSettingRef } from '../common/group-setting/group-setting';
import styles from './style.module.scss';

const { TextArea } = Input;
const key = 'bilibili';
const broadcastChannel = new BroadcastChannel(key);

export function SettingBilibili() {
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
