import { DataCard } from './data-card/data-card';
import { useEffect, useState } from 'react';
import { getAccount, getStat } from '../../request';
import { Spin, message } from 'antd';
import styles from './style.module.scss';
import { Account } from '../../request/bilibili/bilibili.interface';

const broadcastChannel = new BroadcastChannel('bilibili');

export function Bilibili() {
  const [stat, setStat] = useState<any>({});
  const [account, setAccount] = useState<Account['data']>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    broadcastChannel.onmessage = v => {
      if (v.data === 'bilibili-init') {
        setLoading(true);
        initData();
        initComponents();
      }
    };
    initData();
    initComponents();
  }, []);

  const initData = () => {
    window.electron.ipcRenderer.send('bilibili-set-cookie');
    Promise.all([getStat(), getAccount()])
      .then(
        v => {
          // 处理统计数据
          const [tempStat, tempAccount] = v;
          const responseTempStatData = tempStat.data;
          if (responseTempStatData.code === 0) {
            setStat(responseTempStatData.data);
          } else {
            setStat({});
            message.error('getStat 出错, 请联系作者!');
          }
          // 处理账户信息
          const responseTempAccountData = tempAccount.data;
          if (responseTempAccountData.code === 0) {
            setAccount(responseTempAccountData.data);
            // 因为 setState 是异步, 所以这里的 account 是undefined, 先临时处理下
            window.electron.ipcRenderer.send('bilibili-set-title', `Bilibili - ${responseTempAccountData.data!.uname}`);
          } else {
            setAccount(undefined);
            window.electron.ipcRenderer.send('bilibili-set-title', 'Bilibili');
            message.error('getAccount 出错, 请联系作者!');
          }
        },
        () => {
          setStat({});
          setAccount(undefined);
          window.electron.ipcRenderer.send('bilibili-set-title', 'Bilibili');
          message.error('鉴权失败, 请打开『偏好设置』设置cookie!');
        },
      )
      .finally(() => setLoading(false));
  };

  const initComponents = () => {
    const config = window.electron.store.get('bilibili-config');
    const displayType = config.displayType as string[];
    const res: JSX.Element[] = [];
    if (displayType.includes('fan')) {
      res.push(<DataCard key="fan" title="净增粉丝" changeValue={stat.incr_fans} totalValue={stat.total_fans}></DataCard>);
    }
    if (displayType.includes('click')) {
      res.push(<DataCard key="click" title="播放量" changeValue={stat.incr_click} totalValue={stat.total_click}></DataCard>);
    }
    if (displayType.includes('reply')) {
      res.push(<DataCard key="reply" title="评论" changeValue={stat.incr_reply} totalValue={stat.total_reply}></DataCard>);
    }
    if (displayType.includes('dm')) {
      res.push(<DataCard key="dm" title="弹幕" changeValue={stat.incr_dm} totalValue={stat.total_dm}></DataCard>);
    }
    if (displayType.includes('like')) {
      res.push(<DataCard key="like" title="点赞" changeValue={stat.inc_like} totalValue={stat.total_like}></DataCard>);
    }
    if (displayType.includes('share')) {
      res.push(<DataCard key="share" title="分享" changeValue={stat.inc_share} totalValue={stat.total_share}></DataCard>);
    }
    if (displayType.includes('favorite')) {
      res.push(<DataCard key="favorite" title="收藏" changeValue={stat.inc_fav} totalValue={stat.total_fav}></DataCard>);
    }
    if (displayType.includes('coin')) {
      res.push(<DataCard key="coin" title="投币" changeValue={stat.inc_coin} totalValue={stat.total_coin}></DataCard>);
    }
    return res;
  };

  return (
    <Spin tip="Loading..." spinning={loading}>
      <div className={styles['bilibili-container']}>{initComponents()}</div>
    </Spin>
  );
}
