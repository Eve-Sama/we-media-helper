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

  useEffect(function listenBrodcast() {
    broadcastChannel.onmessage = v => {
      if (v.data === `${key}-init`) {
        loadData();
      }
    };
    loadData();
  }, []);

  useEffect(
    function notify() {
      if (Object.keys(countData).length === 0) {
        return;
      }
      const typeList: string[] = [];
      const tempDataCardList: JuejinConfig['dataCardList'] = [];
      groupList.forEach(group =>
        group.cardList.forEach(card => {
          if (card.notify) {
            typeList.push(card.type);
            const data = getDataCardInfo(card.type);
            tempDataCardList.push({
              type: data.type,
              value: data.totalValue,
            });
          }
        }),
      );
      window.electron.store.set(`${key}-data`, { ...storageData, dataCardList: tempDataCardList });
      tempDataCardList.forEach(tempDataCard => {
        const dataCard = dataCardList.find(v => v.type === tempDataCard.type);
        if (dataCard) {
          const needNotify = typeList.some(v => v === tempDataCard.type);
          if (needNotify && tempDataCard.value > dataCard.value) {
            const title = JuejinCardList.find(v => v.value === tempDataCard.type).label;
            window.electron.ipcRenderer.send('notify', { title: `掘金 - ${title}`, url: 'https://member.bilibili.com/platform/home' });
          }
        }
      });
    },
    [countData],
  );

  useEffect(
    function retryRequest() {
      if (retryTimes > 0 && retryTimes < 3) {
        message.error(`鉴权失败, 3秒后将重试(${retryTimes}/3).`);
        setTimeout(() => {
          loadData();
        }, 3 * 1000);
      }
      if (retryTimes === 3) {
        message.error('鉴权失败, 请打开『偏好设置』设置cookie!');
      }
    },
    [retryTimes],
  );

  const beingInit = () => Object.keys(countData).length === 0;

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
      const cardComponents = getDataCardComponents(group.cardList);
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

  const getDataCardInfo = (type: string) => {
    const target = JuejinCardList.find(v => v.value === type);
    let dataSource: object;
    if (['reply', 'like', 'follow', 'system', 'job'].includes(type)) {
      dataSource = countData;
    }
    const changeValue = target.changeValue.reduce((pre, cur) => pre + dataSource[cur], 0);
    const totalValue = target.totalValue.reduce((pre, cur) => pre + dataSource[cur], 0);
    return {
      type,
      title: target.label,
      changeValue: changeValue,
      // totalValue 在 'message' 类型下, 可能为 NaN
      totalValue: totalValue || 0,
    };
  };

  const getDataCardComponents = (cardList: Group['cardList']) => {
    const res: JSX.Element[] = [];
    if (beingInit()) {
      return res;
    }
    cardList.forEach(card => {
      const data = getDataCardInfo(card.type);
      res.push(<DataCard key={data.type} title={data.title} changeValue={data.changeValue} totalValue={data.totalValue}></DataCard>);
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
