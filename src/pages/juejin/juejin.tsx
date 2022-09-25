import { useEffect, useRef, useState } from 'react';
import { Spin, message } from 'antd';
import styles from './style.module.scss';
import { CountdownDisplay } from '../common/countdown-display/countdown-display';
import { DataCard } from '../common/data-card/data-card';
import { getCount, getUser } from '../../request/juejin/juejin.request';
import _ from 'lodash';

const key = 'juejin';
const broadcastChannel = new BroadcastChannel(key);

export function JueJin() {
  const [countData, setCountData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [retryTimes, setRetryTimes] = useState(0);
  const countdownRef = useRef<{ startCountdown: () => void }>(null);

  const storageData = window.electron.store.get(`${key}-data`);
  const config = storageData.config;
  const dataCardList = storageData.dataCardList as Array<{ type: string; value: number }>;
  const displayType = config.displayType as string[];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    broadcastChannel.onmessage = v => {
      if (v.data === `${key}-init`) {
        loadData();
      }
    };
  }, []);

  useEffect(() => {
    if (config.notify) {
      ['reply', 'system'].forEach(type => {
        let target = dataCardList.find(v => v.type === type);
        let currentValue: number;
        let title: string;
        if (type === 'reply') {
          currentValue = countData['3'];
          title = '评论消息';
        } else if (type === 'system') {
          currentValue = countData['4'];
          title = '系统消息';
        }
        // 初始化执行时, 未请求过数据, 导致初始化的值都是空的
        if (_.isNil(currentValue)) {
          return;
        }
        if (target) {
          if (currentValue > target.value) {
            window.electron.ipcRenderer.send('notify', { title: `掘金 - ${title}` });
          }
          target.value = currentValue;
        } else {
          target = {
            type,
            value: currentValue,
          };
          dataCardList.push(target);
        }
      });
      window.electron.store.set(`${key}-data`, { ...storageData, dataCardList });
    }
  }, [countData]);

  useEffect(() => {
    if (retryTimes > 0 && retryTimes < 5) {
      message.error(`鉴权失败, 3秒后将重试(${retryTimes}/5).`);
      setTimeout(() => {
        loadData();
      }, 3 * 1000);
    }
    if (retryTimes === 5) {
      message.error('鉴权失败, 请打开『偏好设置』设置cookie!');
    }
  }, [retryTimes]);

  const setDefaultTitle = () => window.electron.ipcRenderer.send(`${key}-set-title`, '掘金');

  const loadData = () => {
    setLoading(true);
    window.electron.ipcRenderer.send(`${key}-set-cookie`);
    Promise.all([getCount(), getUser()])
      .then(
        v => {
          let showError = false;
          // 处理统计数据
          const [tempCountData, tempUserData] = v;
          const responseCountData = tempCountData.data;
          if (responseCountData.err_no === 0) {
            setCountData(responseCountData.data.count);
          } else {
            setCountData({});
            showError = true;
          }
          // 处理账户信息
          const responseUserData = tempUserData.data;
          if (responseUserData.err_no === 0) {
            window.electron.ipcRenderer.send(`${key}-set-title`, `掘金 - ${responseUserData.data.user_name}`);
          } else {
            setDefaultTitle();
            showError = true;
          }
          // 统一报错
          if (showError) {
            handleRequestError();
          } else {
            setRetryTimes(0);
            countdownRef.current?.startCountdown();
          }
        },
        () => handleRequestError(),
      )
      .finally(() => setLoading(false));
  };

  const handleRequestError: () => void = () => {
    setRetryTimes(retryTimes + 1);
    setDefaultTitle();
  };

  const initComponents: () => JSX.Element[] = () => {
    const res: JSX.Element[] = [];
    if (displayType.includes('reply')) {
      res.push(<DataCard key="reply" title="评论消息" changeValue={0} totalValue={countData['3']}></DataCard>);
    }
    if (displayType.includes('like')) {
      res.push(<DataCard key="like" title="点赞消息" changeValue={0} totalValue={countData['1']}></DataCard>);
    }
    if (displayType.includes('follow')) {
      res.push(<DataCard key="follow" title="关注消息" changeValue={0} totalValue={countData['2']}></DataCard>);
    }
    if (displayType.includes('system')) {
      res.push(<DataCard key="system" title="系统消息" changeValue={0} totalValue={countData['4']}></DataCard>);
    }
    if (displayType.includes('job')) {
      res.push(<DataCard key="job" title="职位沟通" changeValue={0} totalValue={countData['5']}></DataCard>);
    }
    return res;
  };

  return (
    <div className={styles['container']}>
      <div style={{ display: config.showCountdown ? 'flex' : 'none' }}>
        <CountdownDisplay loadData={loadData} refreshTime={config.refreshTime} ref={countdownRef} />
      </div>
      <Spin tip="Loading..." spinning={loading}>
        <div className={styles['panel-container']}>{initComponents()}</div>
      </Spin>
    </div>
  );
}
