import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useState } from 'react';
import { SettingBilibili } from './setting-bilibili/setting-bilibili';
import { SettingJuejin } from './setting-juejin/setting-juejin';
import styles from './style.module.scss';

const items: MenuProps['items'] = [
  {
    label: '监听器设置',
    type: 'group',
  },
  {
    label: '哔哩哔哩',
    key: 'Bilibili',
  },
  {
    label: '掘金',
    key: 'JueJin',
  },
];

export function Setting() {
  const [data, setData] = useState('Bilibili');
  const onClick: MenuProps['onClick'] = v => setData(v.key);
  let settingContet: JSX.Element | null = null;
  switch (data) {
    case 'Bilibili':
      settingContet = <SettingBilibili />;
      break;
    case 'JueJin':
      settingContet = <SettingJuejin />;
      break;
  }
  return (
    <div className={styles['setting-container']}>
      <div className={styles['setting-menu']}>
        <Menu onClick={onClick} style={{ width: 256 }} defaultSelectedKeys={['Bilibili']} mode="inline" items={items} />
      </div>
      <div className={styles['setting-content']}>{settingContet}</div>
    </div>
  );
}
