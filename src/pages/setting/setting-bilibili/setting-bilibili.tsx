import { Button, Form, Input } from 'antd';
const { TextArea } = Input;
export function SettingBilibili() {
  const config = window.electron.store.get('bilibili-config') || {};
  console.log(config, `config`);
  const onFinish = (values: any) => {
    config.cookie = values.cookie;
    window.electron.store.set('bilibili-config', config);
  };

  return (
    <Form name="basic" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={{ cookie: config.cookie }} onFinish={onFinish} autoComplete="off">
      <Form.Item label="cookie" name="cookie">
        <TextArea rows={4} placeholder="Input your cookie" />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" block>
          提交
        </Button>
      </Form.Item>
    </Form>
  );
}
