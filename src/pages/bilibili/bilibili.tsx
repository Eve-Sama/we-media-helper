import { DataCard } from './data-card/data-card';
import { useEffect } from 'react';
import './bilibili.scss';
import { getStat } from '../../request';
// import { ipcRenderer } from 'electron';

export function Bilibili() {
  useEffect(() => {
    getStat().then(v => {
      console.log((window as any).api);
      (window as any).api.send('navigate', {
        location: v,
      });
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
