import { DataCard } from './data-card/data-card';
import { useEffect, useState } from 'react';
import { getStat } from '../../request';
import { Spin, message } from 'antd';
import styles from './style.module.scss';

const broadcastChannel = new BroadcastChannel('bilibili');

export function Bilibili() {
  const [data, setData] = useState<any>({});
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
    getStat()
      .then(
        v => {
          const responseData = v.data;
          if (responseData.code === 0) {
            setData(responseData.data);
            setLoading(false);
          } else {
            setData({});
            message.error('鉴权失败, 请打开『鉴权中心』设置cookie!');
          }
        },
        () => {
          setData({});
          message.error('鉴权失败, 请打开『鉴权中心』设置cookie!');
        },
      )
      .finally(() => setLoading(false));
  };

  const initComponents = () => {
    const config = window.electron.store.get('bilibili-config');
    const displayType = config.displayType as string[];
    const res: JSX.Element[] = [];
    if (displayType.includes('fan')) {
      res.push(<DataCard key="fan" title="净增粉丝" changeValue={data.incr_fans} totalValue={data.total_fans}></DataCard>);
    }
    if (displayType.includes('click')) {
      res.push(<DataCard key="click" title="播放量" changeValue={data.incr_click} totalValue={data.total_click}></DataCard>);
    }
    if (displayType.includes('reply')) {
      res.push(<DataCard key="reply" title="评论" changeValue={data.incr_reply} totalValue={data.total_reply}></DataCard>);
    }
    if (displayType.includes('dm')) {
      res.push(<DataCard key="dm" title="弹幕" changeValue={data.incr_dm} totalValue={data.total_dm}></DataCard>);
    }
    if (displayType.includes('like')) {
      res.push(<DataCard key="like" title="点赞" changeValue={data.inc_like} totalValue={data.total_like}></DataCard>);
    }
    if (displayType.includes('share')) {
      res.push(<DataCard key="share" title="分享" changeValue={data.inc_share} totalValue={data.total_share}></DataCard>);
    }
    if (displayType.includes('favorite')) {
      res.push(<DataCard key="favorite" title="收藏" changeValue={data.inc_fav} totalValue={data.total_fav}></DataCard>);
    }
    if (displayType.includes('coin')) {
      res.push(<DataCard key="coin" title="投币" changeValue={data.inc_coin} totalValue={data.total_coin}></DataCard>);
    }
    return res;
  };

  return (
    <Spin tip="Loading..." spinning={loading}>
      <div className={styles['bilibili-container']}>{initComponents()}</div>
    </Spin>
  );
}
