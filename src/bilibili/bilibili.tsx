import { DataCard } from './data-card/data-card';
import { useEffect } from 'react';
import './bilibili.scss';
import { getStat } from '../request';

export function Bilibili() {
  useEffect(() => {
    getStat().then(v => {
      console.log(v);
    });
  });
  return (
    <div className="bilibili-container">
      <div className="line-1">
        <DataCard />
        <DataCard />
        <DataCard />
        <DataCard />
      </div>
    </div>
  );
}
