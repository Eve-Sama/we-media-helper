import { useEffect, useRef, useState } from 'react';
import { Spin, message } from 'antd';
import styles from './style.module.scss';
import { CountdownDisplay } from '../common/countdown-display/countdown-display';
import { DataCard } from '../common/data-card/data-card';
import { getCount, getUser } from '../../request/juejin/bilibili.request';

const broadcastChannel = new BroadcastChannel('juejin');

export function JueJin() {
  const [countData, setCountData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const countdownRef = useRef<{ startCountdown: () => void }>(null);

  const config = window.electron.store.get('juejin-config');
  const displayType = config.displayType as string[];

  useEffect(() => {
    broadcastChannel.onmessage = v => {
      if (v.data === 'juejin-init') {
        loadData();
      }
    };
    loadData();
  }, []);

  const setDefaultTitle = () => {
    window.electron.ipcRenderer.send('juejin-set-title', 'juejin');
  };

  const loadData = () => {
    setLoading(true);
    window.electron.ipcRenderer.send('juejin-set-cookie');
    Promise.all([getCount(), getUser()])
      .then(
        v => {
          let showError = false;
          // 处理统计数据
          const [tempCountData, tempUserData] = v;
          const responseCountData = tempCountData.data;
          if (responseCountData.err_no === 0) {
            setCountData(responseCountData.data);
          } else {
            setCountData({});
            showError = true;
          }
          // 处理账户信息
          const responseUserData = tempUserData.data;
          if (responseUserData.err_no === 0) {
            window.electron.ipcRenderer.send('juejin-set-title', `掘金 - ${responseUserData.data.user_name}`);
          } else {
            setDefaultTitle();
            showError = true;
          }
          // 统一报错
          if (showError) {
            message.error('鉴权失败, 请打开『偏好设置』设置cookie!');
          } else {
            countdownRef.current?.startCountdown();
          }
        },
        () => {
          setCountData({});
          setDefaultTitle();
          message.error('鉴权失败, 请打开『偏好设置』设置cookie!');
        },
      )
      .finally(() => setLoading(false));
  };

  const initComponents: () => JSX.Element[] = () => {
    const res: JSX.Element[] = [];
    if (displayType.includes('reply')) {
      res.push(<DataCard key="reply" title="评论消息" changeValue={countData['3']} totalValue={0}></DataCard>);
    }
    if (displayType.includes('like')) {
      res.push(<DataCard key="like" title="点赞消息" changeValue={countData['1']} totalValue={0}></DataCard>);
    }
    if (displayType.includes('follow')) {
      res.push(<DataCard key="follow" title="关注消息" changeValue={countData['2']} totalValue={0}></DataCard>);
    }
    if (displayType.includes('system')) {
      res.push(<DataCard key="system" title="系统消息" changeValue={countData['4']} totalValue={0}></DataCard>);
    }
    if (displayType.includes('job')) {
      res.push(<DataCard key="job" title="职位沟通" changeValue={countData['5']} totalValue={0}></DataCard>);
    }
    return res;
  };

  const countdownDisplay: () => JSX.Element = () => {
    let content: JSX.Element;
    if (config.showCountdown) {
      content = <CountdownDisplay loadData={loadData} display={config.showCountdown} ref={countdownRef} />;
    }
    return content;
  };

  return (
    <div className={styles['container']}>
      {countdownDisplay()}
      <Spin tip="Loading..." spinning={loading}>
        <div className={styles['panel-container']}>{initComponents()}</div>
      </Spin>
    </div>
  );
}
