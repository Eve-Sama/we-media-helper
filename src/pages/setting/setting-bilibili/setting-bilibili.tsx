import { Button, Checkbox, Form, Input } from 'antd';
import styles from './style.module.scss';

const { TextArea } = Input;
const broadcastChannel = new BroadcastChannel('bilibili');

export function SettingBilibili() {
  const config = window.electron.store.get('bilibili-config') || {
    cookie: '',
    displayType: [],
  };
  const onFinish = (values: any) => {
    Object.assign(config, values);
    window.electron.store.set('bilibili-config', config);
    broadcastChannel.postMessage('bilibili-init');
  };
  const displayType = [
    { label: '净增粉丝', value: 'fan' },
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
      <Form name="basic" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} initialValues={{ ...config }} onFinish={onFinish} autoComplete="off">
        <Form.Item label="cookie" name="cookie">
          <TextArea rows={4} placeholder="Input your cookie" />
        </Form.Item>
        <Form.Item label="显示模块" name="displayType">
          <Checkbox.Group options={displayType} />
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
