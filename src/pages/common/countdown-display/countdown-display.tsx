import { Divider, Statistic } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import styles from './style.module.scss';

const { Countdown } = Statistic;

interface BilibiliRef {
  startCountdown: () => void;
}

interface BilibiliProps {
  loadData: () => void;
  display: boolean;
}

export const CountdownDisplay = forwardRef<BilibiliRef, BilibiliProps>((props, ref) => {
  const { loadData, display } = props;

  const [countdownValue, setCountdownValue] = useState<number>(0);

  useImperativeHandle(ref, () => ({
    startCountdown,
  }));

  const startCountdown = () => {
    const { refreshTime } = window.electron.store.get('bilibili-config');
    const [hour, minite, second] = refreshTime.split(':');
    setCountdownValue(Date.now() + 1000 * (parseInt(hour) * 3600 + parseInt(minite) * 60 + parseInt(second)) + 1000);
  };

  return (
    <div className={styles['container']} style={{ display: display ? 'flex' : 'none' }}>
      <Divider>
        <Countdown value={countdownValue} onFinish={loadData}></Countdown>
      </Divider>
    </div>
  );
});
