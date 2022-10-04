import { useEffect, useRef, useState } from 'react';
import { Spin, message } from 'antd';
import styles from './style.module.scss';
import { CountdownDisplay } from '../common/countdown-display/countdown-display';
import { DataCard } from '../common/data-card/data-card';
import { getCount, getUser } from '../../request/juejin/juejin.request';
import { Group } from '../setting/common/group-setting/group-setting';
import { JuejinConfig, JuejinCardList } from '../setting/setting-juejin/setting-juejin.interface';

const key = 'juejin';
const broadcastChannel = new BroadcastChannel(key);

export function JueJin() {
  const [countData, setCountData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [retryTimes, setRetryTimes] = useState(0);
  const countdownRef = useRef<{ startCountdown: () => void }>(null);

  const storageData = window.electron.store.get(`${key}-data`) as JuejinConfig;
  const dataCardList = storageData.dataCardList;
  const groupList = storageData.config.groupList;
  const config = storageData.config;

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
    if (Object.keys(countData).length === 0) {
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
    const tempDataCardList: JuejinConfig['dataCardList'] = [
      {
        type: 'reply',
        value: countData['3'],
      },
      {
        type: 'like',
        value: countData['1'],
      },
      {
        type: 'follow',
        value: countData['2'],
      },
      {
        type: 'system',
        value: countData['4'],
      },
      {
        type: 'job',
        value: countData['5'],
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
        const title = JuejinCardList.find(v => v.value === tempDataCard.type).label;
        window.electron.ipcRenderer.send('notify', { title: `掘金 - ${title}`, url: 'https://juejin.cn/notification' });
      }
    });
  }, [countData]);

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

  const setDefaultTitle = () => window.electron.ipcRenderer.send(`${key}-set-title`, '掘金');

  const loadData = () => {
    setLoading(true);
    setRetryTimes(0);
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
      if (card.type.includes('reply')) {
        res.push(<DataCard key="reply" title="评论消息" changeValue={0} totalValue={countData['3']}></DataCard>);
      }
      if (card.type.includes('like')) {
        res.push(<DataCard key="like" title="点赞消息" changeValue={0} totalValue={countData['1']}></DataCard>);
      }
      if (card.type.includes('follow')) {
        res.push(<DataCard key="follow" title="关注消息" changeValue={0} totalValue={countData['2']}></DataCard>);
      }
      if (card.type.includes('system')) {
        res.push(<DataCard key="system" title="系统消息" changeValue={0} totalValue={countData['4']}></DataCard>);
      }
      if (card.type.includes('job')) {
        res.push(<DataCard key="job" title="职位沟通" changeValue={0} totalValue={countData['5']}></DataCard>);
      }
    });
    return res;
  };

  return (
    <div className={styles['container']}>
      <div style={{ display: config.showCountdown ? 'flex' : 'none' }}>
        <CountdownDisplay loadData={loadData} refreshTime={config.refreshTime} ref={countdownRef} />
      </div>
      <Spin tip="Loading..." spinning={loading}>
        <div className={styles['group-container']}>{initGroupComponents()}</div>
      </Spin>
    </div>
  );
}
