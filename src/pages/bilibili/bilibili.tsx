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
      }
    };
    initData();
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

  return (
    <Spin tip="Loading..." spinning={loading}>
      <div className={styles['bilibili-container']}>
        <DataCard title="净增粉丝" changeValue={data.incr_fans} totalValue={data.total_fans}></DataCard>
        <DataCard title="播放量" changeValue={data.incr_click} totalValue={data.total_click}></DataCard>
        <DataCard title="评论" changeValue={data.incr_reply} totalValue={data.total_reply}></DataCard>
        <DataCard title="弹幕" changeValue={data.incr_dm} totalValue={data.total_dm}></DataCard>
        <DataCard title="点赞" changeValue={data.inc_like} totalValue={data.total_like}></DataCard>
        <DataCard title="分享" changeValue={data.inc_share} totalValue={data.total_share}></DataCard>
        <DataCard title="收藏" changeValue={data.inc_fav} totalValue={data.total_fav}></DataCard>
        <DataCard title="投币" changeValue={data.inc_coin} totalValue={data.total_coin}></DataCard>
        {/* <div className={styles['line-1']}>
        </div>
        <div className={styles['line-2']}>
        </div> */}
      </div>
    </Spin>
  );
}
