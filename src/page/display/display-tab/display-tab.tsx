import { Tabs } from 'antd';
import { useEffect, useState } from 'react';

import { Bilibili } from '../display-bilibili/display-bilibili';
import { JueJin } from '../display-juejin/display-juejin';
import { Zhihu } from '../display-zhihu/display-zhihu';
import styles from './style.module.scss';

export function Tab() {
  const [items, setItems] = useState([]);
  const [firstRun, setFirstRun] = useState(true);
  const [activeKey, setActiveKey] = useState('');

  const map = new Map([
    ['bilibili', { label: '哔哩哔哩', key: 'bilibili', children: <Bilibili></Bilibili> }],
    ['juejin', { label: '掘金', key: 'juejin', children: <JueJin></JueJin> }],
    ['zhihu', { label: '知乎', key: 'zhihu', children: <Zhihu></Zhihu> }],
  ]);

  useEffect(() => {
    addTabHandler();
    (function addTabListener() {
      window.electron.addTab(addTabHandler);
    })();
  }, []);

  useEffect(() => {
    if (items.length === 0) {
      return;
    }
    if (firstRun) {
      const key = window.electron.store.get(`tab-active-key`) as string;
      if (key) {
        setActiveKey(() => key);
      } else {
        updateActiveKeyByLast();
      }
      setFirstRun(false);
    } else {
      updateActiveKeyByLast();
    }
  }, [items]);

  const updateActiveKeyByLast = () => {
    const last = items.at(-1);
    if (last) {
      setActiveKey(() => last.key);
      window.electron.store.set(`tab-active-key`, last.key);
    }
  };

  const addTabHandler = () => {
    const keyList = getKeyList();
    const newItems = keyList.map(key => map.get(key));
    setItems(() => [...newItems]);
  };

  const getKeyList = () => {
    const keyList = window.electron.store.get(`tab-config`) as string[];
    return keyList;
  };

  const onTabClick = (key: string) => {
    setActiveKey(() => key);
    window.electron.store.set(`tab-active-key`, key);
  };

  return (
    <div className={styles['tab-container']}>
      <div className={styles['tabs-container']}>
        <Tabs size="large" items={items} centered activeKey={activeKey} onTabClick={onTabClick} />
      </div>
    </div>
  );
}
