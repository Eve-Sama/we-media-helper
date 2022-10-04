import { useEffect, useRef, useState } from 'react';
import { getAccount, getMessage, getStat, getUnread } from '../../request';
import { Spin, message } from 'antd';
import styles from './style.module.scss';
import { CountdownDisplay } from '../common/countdown-display/countdown-display';
import { DataCard } from '../common/data-card/data-card';
import { Group } from '../setting/common/group-setting/group-setting';
import { BilibiliCardList, BilibiliConfig } from '../setting/setting-bilibili/setting-bilibili.interface';

const key = 'bilibili';
const broadcastChannel = new BroadcastChannel(key);

export function Bilibili() {
  const [statData, setStatData] = useState<any>({});
  const [unreadData, setUnreadData] = useState<any>({});
  const [messageData, setMessageData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [retryTimes, setRetryTimes] = useState(0);
  const countdownRef = useRef<{ startCountdown: () => void }>(null);

  const storageData = window.electron.store.get(`${key}-data`) as BilibiliConfig;
  const dataCardList = storageData.dataCardList;
  const groupList = storageData.config.groupList;
  const config = storageData.config;

  useEffect(() => {
    broadcastChannel.onmessage = v => {
      if (v.data === `${key}-init`) {
        loadData();
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (Object.keys(messageData).length === 0) {
      return;
    }
    const typeList: string[] = [];
    groupList.forEach(group =>
      group.cardList.forEach(card => {
        if (card.notify) {
          typeList.push(card.type);
        }
      }),
    );
    const tempDataCardList: BilibiliConfig['dataCardList'] = [
      {
        type: 'fan',
        value: statData.total_fans,
      },
      {
        type: 'click',
        value: statData.total_click,
      },
      {
        type: 'totalReply',
        value: statData.total_reply,
      },
      {
        type: 'dm',
        value: statData.total_dm,
      },
      {
        type: 'totalLike',
        value: statData.total_like,
      },
      {
        type: 'share',
        value: statData.total_share,
      },
      {
        type: 'favorite',
        value: statData.total_fav,
      },
      {
        type: 'coin',
        value: statData.total_coin,
      },
      {
        type: 'reply',
        value: unreadData.reply,
      },
      {
        type: 'at',
        value: unreadData.at,
      },
      {
        type: 'like',
        value: unreadData.like,
      },
      {
        type: 'systemMessage',
        value: unreadData.sys_msg,
      },
      {
        type: 'message',
        value: messageData.follow_unread + messageData.unfollow_unread,
      },
    ];
    window.electron.store.set(`${key}-data`, { ...storageData, dataCardList: tempDataCardList });
    // 第一次运行项目的话, dataCardList 为空数组
    if (dataCardList.length === 0) {
      return;
    }
    tempDataCardList.forEach((tempDataCard, index) => {
      const dataCard = dataCardList[index];
      const needNotify = typeList.some(v => v === tempDataCard.type);
      if (tempDataCard.value > dataCard.value && needNotify) {
        const title = BilibiliCardList.find(v => v.value === tempDataCard.type).label;
        window.electron.ipcRenderer.send('notify', { title: `哔哩哔哩 - ${title}`, url: 'https://member.bilibili.com/platform/home' });
      }
    });
  }, [messageData]);

  useEffect(() => {
    if (retryTimes > 0 && retryTimes < 3) {
      message.error(`鉴权失败, 3秒后将重试(${retryTimes}/3).`);
      setTimeout(() => {
        loadData();
      }, 3 * 1000);
    }
    if (retryTimes === 3) {
      message.error('鉴权失败, 请打开『偏好设置』设置cookie!');
    }
  }, [retryTimes]);

  const setDefaultTitle = () => window.electron.ipcRenderer.send(`${key}-set-title`, '哔哩哔哩');

  const loadData = () => {
    setLoading(true);
    setRetryTimes(0);
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
            window.electron.ipcRenderer.send(`${key}-set-title`, `哔哩哔哩 - ${responseTempAccountData.data.uname}`);
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

  const initGroupComponents = () => {
    const res: JSX.Element[] = [];
    groupList.forEach((group, index) => {
      const cardComponents = getCardComponents(group.cardList);
      res.push(
        <div key={index}>
          <span className={styles['group-label']}>{group.label}</span>
          <div className={styles['group-card-list']} style={{ gridTemplateColumns: `repeat(${group.columnNum}, 1fr)` }}>
            {cardComponents}
          </div>
        </div>,
      );
    });
    return res;
  };

  const getCardComponents = (cardList: Group['cardList']) => {
    const res: JSX.Element[] = [];
    cardList.forEach(card => {
      if (card.type.includes('fan')) {
        res.push(<DataCard key="fan" title="净增粉丝" changeValue={statData.incr_fans} totalValue={statData.total_fans}></DataCard>);
      }
      if (card.type.includes('click')) {
        res.push(<DataCard key="click" title="播放量" changeValue={statData.incr_click} totalValue={statData.total_click}></DataCard>);
      }
      if (card.type.includes('totalReply')) {
        res.push(<DataCard key="totalReply" title="评论" changeValue={statData.incr_reply} totalValue={statData.total_reply}></DataCard>);
      }
      if (card.type.includes('dm')) {
        res.push(<DataCard key="dm" title="弹幕" changeValue={statData.incr_dm} totalValue={statData.total_dm}></DataCard>);
      }
      if (card.type.includes('totalLike')) {
        res.push(<DataCard key="totalLike" title="点赞" changeValue={statData.inc_like} totalValue={statData.total_like}></DataCard>);
      }
      if (card.type.includes('share')) {
        res.push(<DataCard key="share" title="分享" changeValue={statData.inc_share} totalValue={statData.total_share}></DataCard>);
      }
      if (card.type.includes('favorite')) {
        res.push(<DataCard key="favorite" title="收藏" changeValue={statData.inc_fav} totalValue={statData.total_fav}></DataCard>);
      }
      if (card.type.includes('coin')) {
        res.push(<DataCard key="coin" title="投币" changeValue={statData.inc_coin} totalValue={statData.total_coin}></DataCard>);
      }
      if (card.type.includes('reply')) {
        res.push(<DataCard key="reply" title="回复我的" changeValue={0} totalValue={unreadData.reply}></DataCard>);
      }
      if (card.type.includes('at')) {
        res.push(<DataCard key="at" title="@我的" changeValue={0} totalValue={unreadData.at}></DataCard>);
      }
      if (card.type.includes('like')) {
        res.push(<DataCard key="like" title="收到的赞" changeValue={0} totalValue={unreadData.like}></DataCard>);
      }
      if (card.type.includes('systemMessage')) {
        res.push(<DataCard key="systemMessage" title="系统消息" changeValue={0} totalValue={unreadData.sys_msg}></DataCard>);
      }
      if (card.type.includes('message')) {
        res.push(<DataCard key="message" title="我的消息" changeValue={0} totalValue={messageData.follow_unread + messageData.unfollow_unread}></DataCard>);
      }
    });
    return res;
  };

  return (
    <div className={styles['bilibili-container']}>
      <div style={{ display: config.showCountdown ? 'flex' : 'none' }}>
        <CountdownDisplay loadData={loadData} refreshTime={config.refreshTime} ref={countdownRef} />
      </div>
      <Spin tip="Loading..." spinning={loading}>
        <div className={styles['group-container']}>{initGroupComponents()}</div>
      </Spin>
    </div>
  );
}
