import { RouteObject } from 'react-router-dom';

import { Bilibili } from '../page/display/display-bilibili/display-bilibili';
import { JueJin } from '../page/display/display-juejin/display-juejin';
import { Tab } from '../page/display/display-tab/display-tab';
import { Zhihu } from '../page/display/display-zhihu/display-zhihu';
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
    path: '/tab',
    element: <Tab />,
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
