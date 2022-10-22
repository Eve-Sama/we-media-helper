import { useEffect, useRef, useState } from 'react';
import { combileArrayBy } from '../../../common/utils-function';
import { CountdownDisplay, CountdownDisplayRef } from '../countdown-display/countdown-display';
import { AnalyzeRequest, StorageData, TemplateOptions } from './template.interface';
import { message, Spin } from 'antd';
import { DataCard } from '../data-card/data-card';
import { Group } from '../../setting/common/group-setting/group.interface';
import _ from 'lodash';

export function useTemplate(options: TemplateOptions) {
  const { key, cardGroupList, title, getDataCardInfo, styles } = options;

  const [loading, setLoading] = useState(true);
  const [retryTimes, setRetryTimes] = useState(0);
  const countdownRef = useRef<CountdownDisplayRef>(null);

  /** 全部卡片列表 */
  const cardList = combileArrayBy(cardGroupList, 'children');
  let storageData = window.electron.store.get(`${key}-data`) as StorageData;
  let loadData: () => void;

  useEffect(function verifyDataCard() {
    const hasDuplicate = _.uniqBy(cardList, 'value').length !== cardList.length;
    if (hasDuplicate) {
      throw new Error(`The input variable 'cardGroupList' exist duplicate type in different 'cardList'!`);
    }
  }, []);

  useEffect(
    function retryRequest() {
      switch (retryTimes) {
        /** @todo: 这个0是初始化导致的执行, 后面可以看看有没有办法避开 */
        case 0:
          break;
        case 1:
        case 2:
          message.error(`鉴权失败, 3秒后将重试(${retryTimes}/3).`);
          const maxRequestTimes = 3;
          if (retryTimes < maxRequestTimes) {
            setTimeout(loadData, 3 * 1000);
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
    new BroadcastChannel(key).onmessage = v => {
      if (v.data === `${key}-init`) {
        storageData = window.electron.store.get(`${key}-data`) as StorageData;
        loadData();
      }
    };
    loadData();
  }, []);

  const setDefaultTitle: () => void = () => window.electron.ipcRenderer.send('set-title', { key, title });

  /** 解析接口的逻辑 */
  const analyzeRequest: AnalyzeRequest = (requestList, callback) => {
    loadData = () => {
      setLoading(true);
      setRetryTimes(0);
      Promise.all(requestList)
        .then(v => {
          const showError = callback(v);
          if (showError) {
            handleRequestError();
          } else {
            handleRequestSuccess();
          }
        })
        .catch(() => handleRequestError())
        .finally(() => setLoading(false));
    };
  };

  const handleRequestSuccess = () => {
    setRetryTimes(0);
    countdownRef.current?.setMode('normal');
    countdownRef.current?.startCountdown(storageData.config.refreshTime);
    notify();
  };

  const notify = () => {
    const typeList: string[] = [];
    const tempDataCardList: StorageData['dataCardList'] = [];
    storageData.config.groupList.forEach(group =>
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
      const dataCard = storageData.dataCardList.find(v => v.type === tempDataCard.type);
      /**
       * 需要判断 dataCard 是否存在. 因为存在一种场景, 当打开了B站面板与设置面板时, 设置面板的 dataCardList 始终是不会变化的, 而B站面板会在每次请求结束后重新设置 dataCardList
       * 这就导致, B站面板的 dataCardList 会变而设置面板的 dataCardList 不会变. 那就有可能导致保存配置而触发的重渲染时, tempDataCardList 与 dataCardList 长度可能不一样
       */
      if (dataCard) {
        if (tempDataCard.value > dataCard.value) {
          const title = cardList.find(v => v.value === tempDataCard.type).label;
          window.electron.ipcRenderer.send('notify', { title: `掘金 - ${title}`, url: 'https://juejin.cn/notification' });
        }
      }
    });
  };

  const handleRequestError = () => {
    setRetryTimes(retryTimes + 1);
    setDefaultTitle();
    countdownRef.current?.setMode('error');
    countdownRef.current?.startCountdown('0:0:0');
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
      const data = getDataCardInfo(card.type);
      res.push(<DataCard key={data.type} title={data.title} changeValue={data.changeValue} totalValue={data.totalValue}></DataCard>);
    });
    return res;
  };

  const getRenderDOM = () => {
    return (
      <div className={styles[`${key}-container`]}>
        <div style={{ display: storageData.config.showCountdown ? 'flex' : 'none' }}>
          <CountdownDisplay loadData={loadData} ref={countdownRef} />
        </div>
        <Spin tip="Loading..." spinning={loading}>
          <div className={styles['group-container']}>{initGroupComponents()}</div>
        </Spin>
      </div>
    );
  };

  return { cardList, getRenderDOM, analyzeRequest };
}
