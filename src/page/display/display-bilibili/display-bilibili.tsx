import { useEffect } from 'react';

import { Stat, Unread, Message } from '../../../request/request-bilibili/request-bilibili.interface';
import { getStat, getAccount, getUnread, getMessage } from '../../../request/request-bilibili/request-bilibili.request';
import { DataCardGroup } from '../../common/group-setting/group.interface';
import { useDisplayTemplate } from '../../common/template/display-template/display-template';
import { BilibiliOptionalCardGroupList } from '../../setting/setting-bilibili/setting-bilibili.interface';

export function Bilibili() {
  const key = 'bilibili';

  let statData: Stat;
  let unreadData: Unread;
  let messageData: Message;

  const { getRenderDOM, analyzeRequest, analyzeDataCard, forceUpdate } = useDisplayTemplate({ key, cardGroupList: BilibiliOptionalCardGroupList, title: '哔哩哔哩' });

  useEffect(() => {
    analyzeRequest(
      [getStat, getAccount, getUnread, getMessage],
      data => {
        let showError = false;
        // 处理统计数据
        const [tempStatData, tempAccountData, tempUnreadData, tempMessageData] = data;
        const responseTempStatData = tempStatData.data;
        if (responseTempStatData.code === 0) {
          statData = responseTempStatData.data;
        } else {
          statData = null;
          showError = true;
        }
        // 处理账户信息
        const responseTempAccountData = tempAccountData.data;
        if (responseTempAccountData.code === 0) {
          // 可以优化
          window.electron.ipcRenderer.send('set-title', { key, title: `哔哩哔哩 - ${responseTempAccountData.data.uname}` });
        } else {
          showError = true;
        }
        // 获取回复条数
        const responseTempUnreadData = tempUnreadData.data;
        if (responseTempUnreadData.code === 0) {
          unreadData = responseTempUnreadData.data;
        } else {
          unreadData = null;
          showError = true;
        }
        // 获取私信条数
        const responseTempMessageData = tempMessageData.data;
        if (responseTempMessageData.code === 0) {
          messageData = responseTempMessageData.data;
        } else {
          messageData = null;
          showError = true;
        }
        forceUpdate();
        return showError;
      },
      () => {
        statData = null;
        unreadData = null;
        messageData = null;
      },
    );
  }, []);

  useEffect(() => {
    analyzeDataCard((type: string, allCardList: DataCardGroup['children']) => {
      const target = allCardList.find(v => v.value === type);
      let dataSource: object;
      if (['fan', 'click', 'totalReply', 'dm', 'totalLike', 'share', 'favorite', 'coin'].includes(type)) {
        dataSource = statData;
      } else if (['reply', 'at', 'like', 'systemMessage'].includes(type)) {
        dataSource = unreadData;
      } else if (['message'].includes(type)) {
        dataSource = messageData;
      } else {
        throw new Error(`Can not find type of card: ${type}`);
      }
      return { target, dataSource };
    });
  }, []);

  return getRenderDOM();
}
