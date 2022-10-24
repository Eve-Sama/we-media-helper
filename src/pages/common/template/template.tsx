import { useEffect, useReducer, useRef, useState } from 'react';
import { combileArrayBy } from '../../../common/utils-function';
import { CountdownDisplay, CountdownDisplayRef } from '../countdown-display/countdown-display';
import { AnalyzeDataCard, AnalyzeRequest, StorageData, TemplateOptions } from './template.interface';
import { message, Spin } from 'antd';
import { DataCard } from '../data-card/data-card';
import { DataCardGroup, Group } from '../../setting/common/group-setting/group.interface';
import styles from './style.module.scss';
import _ from 'lodash';

export function useTemplate(options: TemplateOptions) {
  const { key, cardGroupList, title } = options;
  const broadcastChannel = new BroadcastChannel(key);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_ignore, forceUpdate] = useReducer(x => x + 1, 0);
  const [loading, setLoading] = useState(false);
  const [canRender, setCanRender] = useState(false);
  const [retryTimes, setRetryTimes] = useState(0);
  const [loadData, setLoadData] = useState<() => void>();
  const [getDataCardInfo, setGetDataCardInfo] = useState<
    (type: string) => {
      type: string;
      title: string;
      changeValue: number;
      totalValue: number;
    }
  >();
  const countdownRef = useRef<CountdownDisplayRef>(null);
  const loadDataRef = useRef(loadData);
  const getDataCardInfoRef = useRef(getDataCardInfo);
  loadDataRef.current = loadData;
  getDataCardInfoRef.current = getDataCardInfo;

  /** 全部卡片列表 */
  const cardList = combileArrayBy(cardGroupList, 'children') as unknown as DataCardGroup['children'];
  let storageData = window.electron.store.get(`${key}-data`) as StorageData;

  useEffect(function verifyDataCard() {
    const hasDuplicate = _.uniqBy(cardList, 'value').length !== cardList.length;
    if (hasDuplicate) {
      throw new Error(`The input variable 'cardGroupList' exist duplicate type in different 'cardList'!`);
    }
  }, []);

  useEffect(
    function retryRequest() {
      switch (retryTimes) {
        case 0:
          break;
        case 1:
        case 2:
          message.error(`鉴权失败, 3秒后将重试(${retryTimes}/3).`);
          const maxRequestTimes = 3;
          if (retryTimes < maxRequestTimes) {
            setTimeout(loadDataRef.current, 3 * 1000);
          }
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

  useEffect(function listenBrodcast() {
    broadcastChannel.onmessage = v => {
      if (v.data === `${key}-setting-changed`) {
        updateStorageData();
        loadDataRef.current();
      }
    };
  }, []);

  const setDefaultTitle = () => window.electron.ipcRenderer.send('set-title', { key, title });

  const updateStorageData = () => (storageData = window.electron.store.get(`${key}-data`) as StorageData);

  /** 解析卡片字段 */
  const analyzeDataCard: AnalyzeDataCard = callback => {
    setGetDataCardInfo(() => (type: string) => {
      const { target, dataSource } = callback(type, cardList);
      const changeValue = target.changeValue.reduce((pre, cur) => pre + (dataSource || {})[cur], 0);
      const totalValue = target.totalValue.reduce((pre, cur) => pre + (dataSource || {})[cur], 0);
      return {
        type,
        title: target.label,
        changeValue: changeValue || 0,
        totalValue: totalValue || 0,
      };
    });
  };

  /** 解析接口的逻辑 */
  const analyzeRequest: AnalyzeRequest = (requestList, callback) => {
    setLoadData(() => () => {
      setLoading(true);
      Promise.all(requestList.map(v => v()))
        .then(v => {
          const showError = callback(v as any);
          if (showError) {
            handleRequestError();
          } else {
            handleRequestSuccess();
          }
        })
        .catch(() => handleRequestError())
        .finally(() => setLoading(false));
    });
  };

  useEffect(() => {
    if (loadData && getDataCardInfo) {
      setCanRender(true);
      loadDataRef.current();
    }
  }, [loadData, getDataCardInfo]);

  const handleRequestSuccess = () => {
    setRetryTimes(0);
    countdownRef.current?.setMode('normal');
    countdownRef.current?.startCountdown(storageData.config.refreshTime);
    notify();
  };

  const handleRequestError = () => {
    setRetryTimes(retryTimes => retryTimes + 1);
    setDefaultTitle();
    countdownRef.current?.setMode('error');
    countdownRef.current?.startCountdown('0:0:0');
  };

  const notify = () => {
    const typeList: string[] = [];
    const tempDataCardList: StorageData['dataCardList'] = [];
    storageData.config.groupList.forEach(group =>
      group.cardList.forEach(card => {
        if (card.notify) {
          typeList.push(card.type);
          const data = getDataCardInfoRef.current(card.type);
          tempDataCardList.push({
            type: data.type,
            value: data.totalValue,
          });
        }
      }),
    );
    tempDataCardList.forEach(tempDataCard => {
      const dataCard = storageData.dataCardList.find(v => v.type === tempDataCard.type);
      /**
       * 需要判断 dataCard 是否存在. 因为存在一种场景, 当打开了B站面板与设置面板时, 设置面板的 dataCardList 始终是不会变化的, 而B站面板会在每次请求结束后重新设置 dataCardList
       * 这就导致, B站面板的 dataCardList 会变而设置面板的 dataCardList 不会变. 那就有可能导致保存配置而触发的重渲染时, tempDataCardList 与 dataCardList 长度可能不一样
       */
      if (dataCard) {
        if (tempDataCard.value > dataCard.value) {
          const cardTitle = cardList.find(v => v.value === tempDataCard.type).label;
          window.electron.ipcRenderer.send('notify', { title: `${title} - ${cardTitle}`, url: 'https://juejin.cn/notification' });
        }
      }
    });
    window.electron.store.set(`${key}-data`, { ...storageData, dataCardList: tempDataCardList });
    broadcastChannel.postMessage(`${key}-storage-data-changed`);
    updateStorageData();
  };

  const initGroupComponents = () => {
    const res: JSX.Element[] = [];
    storageData.config.groupList.forEach((group, index) => {
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

  const getDataCardComponents = (cardList: Group['cardList']) => {
    const res: JSX.Element[] = [];
    cardList.forEach(card => {
      const data = getDataCardInfoRef.current(card.type);
      res.push(<DataCard key={data.type} title={data.title} changeValue={data.changeValue} totalValue={data.totalValue}></DataCard>);
    });
    return res;
  };

  const getRenderDOM = () => {
    if (!canRender) {
      return <></>;
    }
    return (
      <div className={styles['template-container']}>
        <div style={{ display: storageData.config.showCountdown ? 'flex' : 'none' }}>
          <CountdownDisplay loadData={loadDataRef.current} ref={countdownRef} />
        </div>
        <Spin tip="Loading..." spinning={loading}>
          <div className={styles['group-container']}>{initGroupComponents()}</div>
        </Spin>
      </div>
    );
  };

  return { getRenderDOM, analyzeRequest, analyzeDataCard, forceUpdate };
}