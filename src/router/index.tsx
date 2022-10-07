import { RouteObject } from 'react-router-dom';
import { Bilibili } from '../pages/bilibili/bilibili';
import { Home } from '../pages/home/home';
import { JueJin } from '../pages/juejin/juejin';
import { Setting } from '../pages/setting/setting';
import { SettingBilibili } from '../pages/setting/setting-bilibili/setting-bilibili';
import { SettingJuejin } from '../pages/setting/setting-juejin/setting-juejin';

export const router: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/setting',
    element: <Setting />,
    children: [
      {
        path: 'bilibili',
        element: <SettingBilibili />,
      },
      {
        path: 'juejin',
        element: <SettingJuejin />,
      },
    ],
  },
  {
    path: '/bilibili',
    element: <Bilibili />,
  },
  {
    path: '/juejin',
    element: <JueJin />,
  },
];
