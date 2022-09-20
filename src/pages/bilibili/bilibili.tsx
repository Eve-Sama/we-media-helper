import { useEffect, useRef, useState } from 'react';
import { getAccount, getMessage, getStat, getUnread } from '../../request';
import { Spin, message } from 'antd';
import styles from './style.module.scss';
import { CountdownDisplay } from '../common/countdown-display/countdown-display';
import { DataCard } from '../common/data-card/data-card';

const broadcastChannel = new BroadcastChannel('bilibili');

export function Bilibili() {
  const [statData, setStatData] = useState<any>({});
  const [unreadData, setUnreadData] = useState<any>({});
  const [messageData, setMessageData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const countdownRef = useRef<{ startCountdown: () => void }>(null);

  const config = window.electron.store.get('bilibili-config');
  const displayType = config.displayType as string[];

  useEffect(() => {
    broadcastChannel.onmessage = v => {
      if (v.data === 'bilibili-init') {
        loadData();
      }
    };
    loadData();
  }, []);

  const setDefaultTitle = () => {
    window.electron.ipcRenderer.send('bilibili-set-title', 'Bilibili');
  };

  const loadData = () => {
    setLoading(true);
    window.electron.ipcRenderer.send('bilibili-set-cookie');
    Promise.all([getStat(), getAccount(), getUnread(), getMessage()])
      .then(
        v => {
          let showError = false;
          // 处理统计数据
          const [tempStatData, tempAccountData, tempUnreadData, tempMessageData] = v;
          const responseTempStatData = tempStatData.data;
          if (responseTempStatData.code === 0) {
            setStatData(responseTempStatData.data);
          } else {
            setStatData({});
            showError = true;
          }
          // 处理账户信息
          const responseTempAccountData = tempAccountData.data;
          if (responseTempAccountData.code === 0) {
            window.electron.ipcRenderer.send('bilibili-set-title', `Bilibili - ${responseTempAccountData.data.uname}`);
          } else {
            setDefaultTitle();
            showError = true;
          }
          // 获取回复条数
          const responseTempUnreadData = tempUnreadData.data;
          if (responseTempUnreadData.code === 0) {
            setUnreadData(responseTempUnreadData.data);
          } else {
            setUnreadData({});
            showError = true;
          }
          // 获取私信条数
          const responseTempMessageData = tempMessageData.data;
          if (responseTempMessageData.code === 0) {
            setMessageData(responseTempMessageData.data);
          } else {
            setMessageData({});
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
          setStatData({});
          setUnreadData({});
          setMessageData({});
          setDefaultTitle();
          message.error('鉴权失败, 请打开『偏好设置』设置cookie!');
        },
      )
      .finally(() => setLoading(false));
  };

  const initComponents: () => JSX.Element[] = () => {
    const res: JSX.Element[] = [];
    if (displayType.includes('fan')) {
      res.push(<DataCard key="fan" title="净增粉丝" changeValue={statData.incr_fans} totalValue={statData.total_fans}></DataCard>);
    }
    if (displayType.includes('click')) {
      res.push(<DataCard key="click" title="播放量" changeValue={statData.incr_click} totalValue={statData.total_click}></DataCard>);
    }
    if (displayType.includes('totalReply')) {
      res.push(<DataCard key="totalReply" title="评论" changeValue={statData.incr_reply} totalValue={statData.total_reply}></DataCard>);
    }
    if (displayType.includes('dm')) {
      res.push(<DataCard key="dm" title="弹幕" changeValue={statData.incr_dm} totalValue={statData.total_dm}></DataCard>);
    }
    if (displayType.includes('totalLike')) {
      res.push(<DataCard key="totalLike" title="点赞" changeValue={statData.inc_like} totalValue={statData.total_like}></DataCard>);
    }
    if (displayType.includes('share')) {
      res.push(<DataCard key="share" title="分享" changeValue={statData.inc_share} totalValue={statData.total_share}></DataCard>);
    }
    if (displayType.includes('favorite')) {
      res.push(<DataCard key="favorite" title="收藏" changeValue={statData.inc_fav} totalValue={statData.total_fav}></DataCard>);
    }
    if (displayType.includes('coin')) {
      res.push(<DataCard key="coin" title="投币" changeValue={statData.inc_coin} totalValue={statData.total_coin}></DataCard>);
    }
    if (displayType.includes('reply')) {
      res.push(<DataCard key="reply" title="回复我的" changeValue={0} totalValue={unreadData.reply}></DataCard>);
    }
    if (displayType.includes('at')) {
      res.push(<DataCard key="at" title="@我的" changeValue={0} totalValue={unreadData.at}></DataCard>);
    }
    if (displayType.includes('like')) {
      res.push(<DataCard key="like" title="收到的赞" changeValue={0} totalValue={unreadData.like}></DataCard>);
    }
    if (displayType.includes('systemMessage')) {
      res.push(<DataCard key="systemMessage" title="系统消息" changeValue={0} totalValue={unreadData.sys_msg}></DataCard>);
    }
    if (displayType.includes('message')) {
      res.push(<DataCard key="message" title="我的消息" changeValue={0} totalValue={messageData.follow_unread + messageData.unfollow_unread}></DataCard>);
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
    <div className={styles['bilibili-container']}>
      {countdownDisplay()}
      <Spin tip="Loading..." spinning={loading}>
        <div className={styles['panel-container']}>{initComponents()}</div>
      </Spin>
    </div>
  );
}
