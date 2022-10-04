import { Button, Divider, Form, Input, Switch, TimePicker } from 'antd';
import moment, { Moment } from 'moment';
import { useEffect, useRef, useState } from 'react';
import { GroupSettingRef, GroupSetting } from '../common/group-setting/group-setting';
import { JuejinDefaultConfig, JuejinConfig, JuejinCardList } from './setting-juejin.interface';
import styles from './style.module.scss';

const { TextArea } = Input;
const key = 'juejin';
const broadcastChannel = new BroadcastChannel('juejin');

export function SettingJuejin() {
  const storageData = (window.electron.store.get(`${key}-data`) || JuejinDefaultConfig) as JuejinConfig;
  const [config, setConfig] = useState<JuejinConfig['config']>(storageData.config);
  const groupSettingRef = useRef<GroupSettingRef>(null);
  const [form] = Form.useForm();

  useEffect(
    function initForm() {
      // TimePicker 只接受 moment 类型的时间
      const refreshTime = moment(config.refreshTime, 'HH:mm:ss');
      form.setFieldsValue({ ...config, refreshTime });
    },
    [config],
  );

  const onSubmit = (values: any) => {
    const groupList = groupSettingRef.current.getData();
    Object.assign(config, { ...values, groupList });
    config.refreshTime = (values.refreshTime as unknown as Moment).format('HH:mm:ss');
    window.electron.store.set(`${key}-data`, { ...storageData, config });
    broadcastChannel.postMessage(`${key}-init`);
  };

  const resetConfig = () => {
    const refreshTime = moment(JuejinDefaultConfig.config.refreshTime, 'HH:mm:ss');
    form.setFieldsValue({ ...JuejinDefaultConfig.config, refreshTime });
    groupSettingRef.current.setGroupListData(JuejinDefaultConfig.config.groupList);
    setConfig({ ...JuejinDefaultConfig.config });
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
