import { DataCard } from './data-card/data-card';
import { useEffect, useState } from 'react';
import { getStat } from '../../request';
import { ContainerStyle } from './bilibili-style';

export function Bilibili() {
  const [
    data = {
      inc_coin: 0,
      inc_elec: 0,
      inc_fav: 0,
      inc_like: 0,
      inc_share: 0,
      incr_click: 0,
      incr_dm: 0,
      incr_fans: 0,
      incr_reply: 0,
      total_click: 0,
      total_coin: 0,
      total_dm: 0,
      total_elec: 0,
      total_fans: 0,
      total_fav: 0,
      total_like: 0,
      total_reply: 0,
      total_share: 0,
    },
    setData,
  ] = useState();
  useEffect(() => {
    getStat().then(v => {
      const responseData = v.data;
      if (responseData.code === 0) {
        setData(responseData.data);
      }
    });
  }, []);
  return (
    <ContainerStyle>
      <div className="bilibili-container">
        <div className="line-1">
          <DataCard title="净增粉丝" changeValue={data.incr_fans} totalValue={data.total_fans}></DataCard>
          <DataCard title="播放量" changeValue={data.incr_click} totalValue={data.total_click}></DataCard>
          <DataCard title="评论" changeValue={data.incr_reply} totalValue={data.total_reply}></DataCard>
          <DataCard title="弹幕" changeValue={data.incr_dm} totalValue={data.total_dm}></DataCard>
        </div>
        <div className="line-2">
          <DataCard title="点赞" changeValue={data.inc_like} totalValue={data.total_like}></DataCard>
          <DataCard title="分享" changeValue={data.inc_share} totalValue={data.total_share}></DataCard>
          <DataCard title="收藏" changeValue={data.inc_fav} totalValue={data.total_fav}></DataCard>
          <DataCard title="投币" changeValue={data.inc_coin} totalValue={data.total_coin}></DataCard>
        </div>
      </div>
    </ContainerStyle>
  );
}
