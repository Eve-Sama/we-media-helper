import { useDebounceFn } from 'ahooks';
import { Divider, Statistic } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import styles from './style.module.scss';

const { Countdown } = Statistic;

export interface CountdownDisplayRef {
  startCountdown: (refreshTime: string) => void;
  setMode: (mode: 'error' | 'normal') => void;
}

interface CountdownDisplayProps {
  loadData: () => void;
  setDefaultTitle: () => void;
}

export const CountdownDisplay = forwardRef<CountdownDisplayRef, CountdownDisplayProps>((props, ref) => {
  const { loadData, setDefaultTitle } = props;

  const [countdownValue, setCountdownValue] = useState<number>(0);
  const [mode, setMode] = useState<'normal' | 'error'>('normal');

  const startCountdown = (refreshTime: string) => {
    const [hour, minite, second] = refreshTime.split(':').map(v => parseInt(v));
    setCountdownValue(Date.now() + 1000 * (hour * 3600 + minite * 60 + second) + 1000);
  };

  const countdownFinish = () => {
    // 当请求失败时, 会重置倒计时为0, 而0作为值依旧会进行倒计时从而触发重新请求(loadData)而导致无限循环. 因此对于倒计时结束的场景再+一个 mode 字段作为区分
    if (mode === 'normal') {
      loadData();
    }
  };

  const { run: countdownClickCB } = useDebounceFn(loadData, { wait: 300 });

  useEffect(() => {
    (function listenNetwork() {
      window.addEventListener('online', loadData);
      window.addEventListener('offline', () => {
        setMode('error');
        startCountdown('0:0:0');
        setDefaultTitle();
      });
    })();
  }, []);

  useImperativeHandle(ref, () => ({
    setMode: (mode: 'error' | 'normal') => setMode(mode),
    startCountdown: (refreshTime: string) => startCountdown(refreshTime),
  }));

  return (
    <div className={styles['container']}>
      <Divider>
        <div className={styles['countdown-container']} onClick={countdownClickCB}>
          <Countdown className={styles[mode]} value={countdownValue} onFinish={countdownFinish}></Countdown>
        </div>
      </Divider>
    </div>
  );
});
