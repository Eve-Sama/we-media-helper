import { Menu, MenuProps } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';

import styles from './style.module.scss';

const items: MenuProps['items'] = [
  {
    label: '监听器设置',
    type: 'group',
  },
  {
    label: '哔哩哔哩',
    key: 'bilibili',
  },
  {
    label: '掘金',
    key: 'juejin',
  },
  {
    label: '知乎',
    key: 'zhihu',
  },
];

export function Setting() {
  const pathname = location.hash;
  const navigate = useNavigate();

  const onClick: MenuProps['onClick'] = v => {
    navigate(v.key, { relative: 'route' });
  };

  return (
    <div className={styles['setting-container']}>
      <div className={styles['setting-menu']}>
        <Menu onClick={onClick} style={{ width: 256 }} defaultSelectedKeys={[pathname.split('/').at(-1)]} mode="inline" items={items} />
      </div>
      <div className={styles['setting-content']}>
        <Outlet></Outlet>
      </div>
    </div>
  );
}
