import { Statistic } from 'antd';

const { Countdown } = Statistic;

export function CountdownDisplay(props: { initData: () => void }) {
  const { initData } = props;

  const onFinish = () => initData();

  const { refreshTime } = window.electron.store.get('bilibili-config');
  const [hour, minite, second] = refreshTime.split(':');
  const countdownValue = Date.now() + 1000 * (parseInt(hour) * 3600 + parseInt(minite) * 60 + parseInt(second));

  return <Countdown value={countdownValue} onFinish={onFinish}></Countdown>;
}
