import { RouteObject } from 'react-router-dom';
import { About } from '../pages/about/about';
import { Bilibili } from '../pages/bilibili/bilibili';
import { JueJin } from '../pages/juejin/juejin';
import { Setting } from '../pages/setting/setting';

export const router: RouteObject[] = [
  {
    path: '/',
  },
  {
    path: '/setting',
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
  {
    path: '/about',
    element: <About />,
  },
];
