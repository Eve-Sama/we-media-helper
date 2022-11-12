import { Tabs } from 'antd';
import hotkeys from 'hotkeys-js';
import { Tab } from 'rc-tabs/lib/interface';
import { useEffect, useRef, useState } from 'react';

import { DisplayBilibili } from '../display-bilibili/display-bilibili';
import { DisplayJueJin } from '../display-juejin/display-juejin';
import { DisplayZhihu } from '../display-zhihu/display-zhihu';
import styles from './style.module.scss';

export function DisplayTab() {
  const [items, setItems] = useState<Tab[]>([]);
  const [firstRun, setFirstRun] = useState(true);
  const [activeKey, setActiveKey] = useState('');
  const hotkeyHandlerRef = useRef<(hotkey: string) => void>();

  const map = new Map<string, Tab>([
    ['display/bilibili', { label: '哔哩哔哩', key: 'bilibili', children: <DisplayBilibili></DisplayBilibili> }],
    ['display/juejin', { label: '掘金', key: 'juejin', children: <DisplayJueJin></DisplayJueJin> }],
    ['display/zhihu', { label: '知乎', key: 'zhihu', children: <DisplayZhihu></DisplayZhihu> }],
  ]);

  useEffect(() => {
    addTabHandler();
    (function addTabListener() {
      window.electron.addTab(addTabHandler);
    })();

    (function addHotKeyListener() {
      hotkeys('w,s,a,d,up,down,left,right', (_event, handler) => {
        hotkeyHandlerRef.current?.(handler.key);
      });
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

  hotkeyHandlerRef.current = (hotkey: string) => {
    const doLast = ['w', 'a', 'up', 'left'].includes(hotkey);
    const doNext = ['s', 'd', 'down', 'right'].includes(hotkey);
    let newItem: Tab;
    const index = items.findIndex(item => item.key === activeKey);
    if (items.length <= 1) {
      return;
    }
    if (doNext) {
      const beingLastItem = index === items.length - 1;
      newItem = beingLastItem ? items[0] : items[index + 1];
    } else if (doLast) {
      const beingFirstItem = index === 0;
      newItem = beingFirstItem ? items[items.length - 1] : items[index - 1];
    }
    setActiveKey(() => newItem.key);
    window.electron.store.set(`tab-active-key`, newItem.key);
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
