import { Button, Form, Input } from 'antd';
const { TextArea } = Input;

export function SettingBilibili() {
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  return (
    // <ContainerStyle>
    //   {/* initialValues={{ cookie: '123' }} */}
    // </ContainerStyle>
    <Form name="basic" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} onFinish={onFinish} autoComplete="off">
      <Form.Item label="cookie" name="cookie">
        {/* <Input /> */}
        <TextArea rows={4} placeholder="Input your cookie" />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
}
