import { RouteObject } from 'react-router-dom';
import { Bilibili } from '../pages/bilibili/bilibili';
import { JueJin } from '../pages/juejin/juejin';
import { Setting } from '../pages/setting/setting';

export const router: RouteObject[] = [
  {
    path: '/',
    element: <Setting />,
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