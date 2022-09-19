import { Button, Checkbox, Form, Input, TimePicker } from 'antd';
import moment from 'moment';

const { TextArea } = Input;
const broadcastChannel = new BroadcastChannel('juejin');

export function SettingJuejin() {
  const config = window.electron.store.get('juejin-config') || {
    cookie: '',
    displayType: [],
    refreshTime: '00:00:30',
  };
  // TimePicker 只接受 moment 类型的时间
  config.refreshTime = moment(config.refreshTime, 'HH:mm:ss');

  const onSubmit = (values: any) => {
    Object.assign(config, values);
    config.refreshTime = values.refreshTime.format('HH:mm:ss');
    window.electron.store.set('juejin-config', config);
    broadcastChannel.postMessage('juejin-init');
  };

  const displayType = [
    { label: '评论消息', value: 'reply' },
    { label: '点赞消息', value: 'like' },
    { label: '关注消息', value: 'follow' },
    { label: '系统消息', value: 'system' },
    { label: '职位沟通', value: 'job' },
  ];

  return (
    <Form name="basic" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} initialValues={{ ...config }} onFinish={onSubmit} autoComplete="off">
      <Form.Item label="cookie" name="cookie">
        <TextArea rows={4} placeholder="Input your cookie" />
      </Form.Item>
      <Form.Item label="显示模块" name="displayType">
        <Checkbox.Group options={displayType} />
      </Form.Item>
      <Form.Item label="刷新间隔" name="refreshTime">
        <TimePicker />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 4, span: 24 }}>
        <Button type="primary" htmlType="submit" block>
          应用
        </Button>
      </Form.Item>
    </Form>
  );
}
