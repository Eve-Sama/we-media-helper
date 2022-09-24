import { Divider, Statistic } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import styles from './style.module.scss';

const { Countdown } = Statistic;

interface BilibiliRef {
  startCountdown: () => void;
}

interface BilibiliProps {
  loadData: () => void;
  refreshTime: string;
}

export const CountdownDisplay = forwardRef<BilibiliRef, BilibiliProps>((props, ref) => {
  const { loadData, refreshTime } = props;

  const [countdownValue, setCountdownValue] = useState<number>(0);

  useImperativeHandle(ref, () => ({
    startCountdown,
  }));

  const startCountdown = () => {
    const [hour, minite, second] = refreshTime.split(':').map(v => parseInt(v));
    setCountdownValue(Date.now() + 1000 * (hour * 3600 + minite * 60 + second) + 1000);
  };

  return (
    <div className={styles['container']}>
      <Divider>
        <Countdown value={countdownValue} onFinish={loadData}></Countdown>
      </Divider>
    </div>
  );
});
