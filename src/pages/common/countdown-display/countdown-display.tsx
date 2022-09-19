import { Statistic } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';

const { Countdown } = Statistic;

interface BilibiliRef {
  startCountdown: () => void;
}

interface BilibiliProps {
  loadData: () => void;
}

export const CountdownDisplay = forwardRef<BilibiliRef, BilibiliProps>((props, ref) => {
  const { loadData } = props;

  const [countdownValue, setCountdownValue] = useState<number>(0);

  useImperativeHandle(ref, () => ({
    startCountdown,
  }));

  const startCountdown = () => {
    const { refreshTime } = window.electron.store.get('bilibili-config');
    const [hour, minite, second] = refreshTime.split(':');
    setCountdownValue(Date.now() + 1000 * (parseInt(hour) * 3600 + parseInt(minite) * 60 + parseInt(second)) + 1000);
  };

  return <Countdown value={countdownValue} onFinish={loadData}></Countdown>;
});
