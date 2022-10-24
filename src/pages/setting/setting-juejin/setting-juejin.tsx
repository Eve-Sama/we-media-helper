import { Button, Divider, Form, Input, Switch, TimePicker } from 'antd';
import moment, { Moment } from 'moment';
import { useEffect, useRef } from 'react';
import { StorageData } from '../../common/template/template.interface';
import { GroupSetting } from '../common/group-setting/group-setting';
import { GroupSettingRef } from '../common/group-setting/group.interface';
import { JuejinDefaultConfig, JuejinCardGroupList } from './setting-juejin.interface';
import styles from './style.module.scss';

const { TextArea } = Input;
const key = 'juejin';
const broadcastChannel = new BroadcastChannel('juejin');

export function SettingJuejin() {
  const storageData = (window.electron.store.get(`${key}-data`) || JuejinDefaultConfig) as StorageData;
  const groupSettingRef = useRef<GroupSettingRef>(null);
  const [form] = Form.useForm();

  useEffect(function listenBrodcast() {
    broadcastChannel.onmessage = v => {
      if (v.data === `${key}-storage-data-changed`) {
        const newStorageData = window.electron.store.get(`${key}-data`) as StorageData;
        storageData.dataCardList = newStorageData.dataCardList;
      }
    };
  }, []);

  useEffect(
    function initForm() {
      // TimePicker 只接受 moment 类型的时间
      const refreshTime = moment(storageData.config.refreshTime, 'HH:mm:ss');
      form.setFieldsValue({ ...storageData.config, refreshTime });
    },
    [storageData.config],
  );

  const onSubmit = (values: any) => {
    const groupList = groupSettingRef.current.getData();
    Object.assign(storageData.config, { ...values, groupList });
    storageData.config.refreshTime = (values.refreshTime as unknown as Moment).format('HH:mm:ss');
    window.electron.store.set(`${key}-data`, { ...storageData, config: storageData.config });
    broadcastChannel.postMessage(`${key}-setting-changed`);
  };

  const resetConfig = () => {
    const refreshTime = moment(JuejinDefaultConfig.config.refreshTime, 'HH:mm:ss');
    const cookie = form.getFieldValue('cookie');
    form.setFieldsValue({ ...JuejinDefaultConfig.config, cookie, refreshTime });
    groupSettingRef.current.setGroupListData(JuejinDefaultConfig.config.groupList);
  };

  return (
    <div className={styles['container']}>
      <Form form={form} name="basic" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} onFinish={onSubmit} autoComplete="off">
        <Form.Item label="cookie" name="cookie">
          <TextArea rows={4} placeholder="Input your cookie" />
        </Form.Item>
        <Form.Item label="分组设置" tooltip={{ title: () => '卡片上的绿点表示是否开启系统通知. 当开启时, 该卡片的数据量有新增时, 会进行系统通知. 可以点击卡片切换系统通知状态.' }}>
          <GroupSetting ref={groupSettingRef} cardGroupList={JuejinCardGroupList} groupList={storageData.config.groupList} />
        </Form.Item>
        <Form.Item label="刷新间隔时间" name="refreshTime">
          <TimePicker />
        </Form.Item>
        <Form.Item label="显示倒计时" name="showCountdown" valuePropName="checked" tooltip={{ title: () => '只影响显示, 不影响倒计时刷新功能' }}>
          <Switch />
        </Form.Item>
      </Form>
      <div className="footer-container">
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
    </div>
  );
}
