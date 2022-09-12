import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useState } from 'react';
import { SettingBilibili } from './setting-bilibili/setting-bilibili';
import { SettingGithub } from './setting-github/setting-github';
import { SettingJuejin } from './setting-juejin/setting-juejin';
import { ContainerStyle } from './setting-style';
import { SettingZhihu } from './setting-zhihu/setting-zhihu';

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
  {
    label: '知乎',
    key: 'ZhiHu',
  },
  {
    label: 'Github',
    key: 'Github',
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
    case 'ZhiHu':
      settingContet = <SettingZhihu />;
      break;
    case 'Github':
      settingContet = <SettingGithub />;
      break;
  }
  return (
    <ContainerStyle>
      <div className="setting-container">
        <Menu onClick={onClick} style={{ width: 256 }} defaultSelectedKeys={['Github']} mode="inline" items={items} />
        <div className="setting-content">{settingContet}</div>
      </div>
    </ContainerStyle>
  );
}
