import { useEffect, useRef, useState } from 'react';
import { Spin, message } from 'antd';
import styles from './style.module.scss';
import { CountdownDisplay, CountdownDisplayRef } from '../common/countdown-display/countdown-display';
import { DataCard } from '../common/data-card/data-card';
import { getCount, getUser, getUserBaiscInfo } from '../../request/juejin/juejin.request';
import { Group } from '../setting/common/group-setting/group.interface';
import { JuejinConfig, JuejinCardGroupList } from '../setting/setting-juejin/setting-juejin.interface';
import { combileArrayBy } from '../../common/utils-function';

const key = 'juejin';
const broadcastChannel = new BroadcastChannel(key);

export function JueJin() {
  const [countData, setCountData] = useState<any>({});
  const [basicInfoData, setBasicInfoData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [retryTimes, setRetryTimes] = useState(0);
  const countdownRef = useRef<CountdownDisplayRef>(null);

  const storageData = window.electron.store.get(`${key}-data`) as JuejinConfig;
  const dataCardList = storageData.dataCardList;
  const groupList = storageData.config.groupList;
  const config = storageData.config;
  const juejinCardList = combileArrayBy(JuejinCardGroupList, 'children');
  const maxRequestTimes = 3;

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
      if (beingInit()) {
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
        /**
         * 需要判断 dataCard 是否存在. 因为存在一种场景, 当打开了B站面板与设置面板时, 设置面板的 dataCardList 始终是不会变化的, 而B站面板会在每次请求结束后重新设置 dataCardList
         * 这就导致, B站面板的 dataCardList 会变而设置面板的 dataCardList 不会变. 那就有可能导致保存配置而触发的重渲染时, tempDataCardList 与 dataCardList 长度可能不一样
         */
        if (dataCard) {
          if (tempDataCard.value > dataCard.value) {
            const title = juejinCardList.find(v => v.value === tempDataCard.type).label;
            window.electron.ipcRenderer.send('notify', { title: `掘金 - ${title}`, url: 'https://juejin.cn/notification' });
          }
        }
      });
    },
    [countData],
  );

  useEffect(
    function retryRequest() {
      switch (retryTimes) {
        case 0:
          break;
        case 1:
        case 2:
          message.error(`鉴权失败, 3秒后将重试(${retryTimes}/3).`);
          setTimeout(() => {
            loadData();
          }, 3 * 1000);
          break;
        case 3:
          message.error('鉴权失败, 请打开『偏好设置』设置cookie!');
          break;
        default:
          message.error('鉴权失败, 请打开『偏好设置』设置cookie!');
          break;
      }
    },
    [retryTimes],
  );

  const beingInit = () => Object.keys(countData).length === 0;

  const setDefaultTitle = () => window.electron.ipcRenderer.send(`${key}-set-title`, '掘金');

  const loadData = () => {
    setLoading(true);
    setRetryTimes(0);
    Promise.all([getCount(), getUser(), getUserBaiscInfo()])
      .then(
        v => {
          let showError = false;
          // 处理实时交互数据
          const [tempCountData, tempUserData, tempUserBasicInfoData] = v;
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
          // 处理统计数据
          const responseUserBasicInfoData = tempUserBasicInfoData.data;
          if (responseUserBasicInfoData.err_no === 0) {
            setBasicInfoData(responseUserBasicInfoData.data);
          } else {
            setBasicInfoData({});
            showError = true;
          }

          // 统一报错
          if (showError) {
            handleRequestError();
            countdownRef.current?.setMode('error');
            countdownRef.current?.startCountdown('0:0:0');
          } else {
            setRetryTimes(0);
            countdownRef.current?.setMode('normal');
            countdownRef.current?.startCountdown(config.refreshTime);
          }
        },
        () => handleRequestError(),
      )
      .finally(() => setLoading(false));
  };

  const handleRequestError: () => void = () => {
    if (retryTimes < maxRequestTimes) {
      setRetryTimes(retryTimes + 1);
      setDefaultTitle();
    }
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
    const target = juejinCardList.find(v => v.value === type);
    let dataSource: object;
    if (['reply', 'like', 'follow', 'system', 'job'].includes(type)) {
      dataSource = countData;
    } else if (['likeTotal', 'read', 'power', 'fan'].includes(type)) {
      dataSource = basicInfoData;
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
