import { Button, Divider, Form, Input, Switch, TimePicker, message } from 'antd';
import moment, { Moment } from 'moment';
import { useEffect, useRef } from 'react';

import { combileArrayBy } from '../../../../common/utils-function';
import { GroupSetting } from '../../group-setting/group-setting';
import { DataCardGroup, GroupSettingRef } from '../../group-setting/group.interface';
import { StorageData } from '../display-template/display-template.interface';
import { SettingTemplateOptions } from './setting-template.interface';
import styles from './style.module.scss';

const { TextArea } = Input;

export function useSettingTemplate(options: SettingTemplateOptions) {
  const { key, defaultConfig, cardGroupList } = options;
  const broadcastChannel = new BroadcastChannel(key);

  const groupSettingRef = useRef<GroupSettingRef>(null);
  const [form] = Form.useForm();

  const storageData = (window.electron.store.get(`${key}-data`) || defaultConfig) as StorageData;

  useEffect(() => {
    (function verifyDefaultDataCard() {
      const allOptionalCardList = combileArrayBy(cardGroupList, 'children') as unknown as DataCardGroup['children'];
      const allDefaultCardList = combileArrayBy(defaultConfig.config.groupList, 'cardList') as unknown as StorageData['config']['groupList'][number]['cardList'];
      const notMatched = allDefaultCardList.some(defaultItem => !allOptionalCardList.find(optionalItem => optionalItem.value === defaultItem.type));
      if (notMatched) {
        throw new Error(`The input variable 'defaultConfig' exist some types doesn't match value of 'cardGroupList'!`);
      }
    })();
    (function listenBrodcast() {
      broadcastChannel.onmessage = v => {
        if (v.data === `${key}-storage-data-changed`) {
          const newStorageData = window.electron.store.get(`${key}-data`) as StorageData;
          storageData.dataCardList = newStorageData.dataCardList;
        }
      };
    })();
  }, []);

  useEffect(
    function initForm() {
      // TimePicker 只接受 moment 类型的时间
      const refreshTime = moment(storageData.config.refreshTime, 'HH:mm:ss');
      form.setFieldsValue({ ...storageData.config, refreshTime });
    },
    [storageData.config],
  );

  const onSubmit = (values: StorageData['config']) => {
    if (values.cookie.includes('\n')) {
      message.error('cookie中不允许包含换行符!');
      return;
    }
    const groupList = groupSettingRef.current.getData();
    Object.assign(storageData.config, { ...values, groupList });
    storageData.config.refreshTime = (values.refreshTime as unknown as Moment).format('HH:mm:ss');
    window.electron.store.set(`${key}-data`, { ...storageData, config: storageData.config });
    broadcastChannel.postMessage(`${key}-setting-changed`);
    message.success('设置成功!');
  };

  const resetConfig = () => {
    const refreshTime = moment(defaultConfig.config.refreshTime, 'HH:mm:ss');
    const cookie = form.getFieldValue('cookie');
    form.setFieldsValue({ ...defaultConfig.config, cookie, refreshTime });
    groupSettingRef.current.setGroupListData(defaultConfig.config.groupList);
  };

  const getRenderDOM = () => {
    return (
      <div className={styles['setting-container']}>
        <Form form={form} name="basic" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} onFinish={onSubmit} autoComplete="off">
          <Form.Item label="cookie" name="cookie">
            <TextArea rows={4} placeholder="Input your cookie" />
          </Form.Item>
          <Form.Item label="分组设置" tooltip={{ title: () => '卡片上的绿灯表示是否开启系统通知. 开启后, 每当该卡片的数据量有新增时, 会进行系统通知. 可以点击卡片切换绿灯状态.' }}>
            <GroupSetting ref={groupSettingRef} cardGroupList={cardGroupList} groupList={storageData.config.groupList} />
          </Form.Item>
          <Form.Item label="刷新间隔时间" name="refreshTime">
            <TimePicker />
          </Form.Item>
          <Form.Item label="显示倒计时" name="showCountdown" valuePropName="checked" tooltip={{ title: () => '只影响显示, 不影响倒计时刷新功能' }}>
            <Switch />
          </Form.Item>
          <Form.Item label="卡片跳转链接" name="enableJumpLink" valuePropName="checked" tooltip={{ title: () => '开启时, 点击卡片可以跳转到相关链接' }}>
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
  };

  return { getRenderDOM };
}
