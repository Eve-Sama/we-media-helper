import { RouteObject } from 'react-router-dom';

import { DisplayBilibili } from '../page/display/display-bilibili/display-bilibili';
import { DisplayJueJin } from '../page/display/display-juejin/display-juejin';
import { DisplayTab } from '../page/display/display-tab/display-tab';
import { DisplayZhihu } from '../page/display/display-zhihu/display-zhihu';
import { Home } from '../page/home/home';
import { Setting } from '../page/setting/setting';
import { SettingBilibili } from '../page/setting/setting-bilibili/setting-bilibili';
import { SettingJuejin } from '../page/setting/setting-juejin/setting-juejin';
import { SettingZhihu } from '../page/setting/setting-zhihu/setting-zhihu';

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
    path: '/display',
    children: [
      {
        path: 'tab',
        element: <DisplayTab />,
      },
      {
        path: 'bilibili',
        element: <DisplayBilibili />,
      },
      {
        path: 'juejin',
        element: <DisplayJueJin />,
      },
      {
        path: 'zhihu',
        element: <DisplayZhihu />,
      },
    ],
  },
];
