import { RouteObject } from 'react-router-dom';

import { Bilibili } from '../pages/display/display-bilibili/display-bilibili';
import { JueJin } from '../pages/display/display-juejin/display-juejin';
import { Zhihu } from '../pages/display/display-zhihu/display-zhihu';
import { Home } from '../pages/home/home';
import { Setting } from '../pages/setting/setting';
import { SettingBilibili } from '../pages/setting/setting-bilibili/setting-bilibili';
import { SettingJuejin } from '../pages/setting/setting-juejin/setting-juejin';
import { SettingZhihu } from '../pages/setting/setting-zhihu/setting-zhihu';

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
      {
        path: 'zhihu',
        element: <SettingZhihu />,
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
  {
    path: '/zhihu',
    element: <Zhihu />,
  },
];
