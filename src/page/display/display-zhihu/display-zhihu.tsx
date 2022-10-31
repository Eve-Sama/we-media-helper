import { useEffect } from 'react';

import { BasicInfo, Follow, Message } from '../../../request/request-zhihu/request-zhihu.interface';
import { getBaiscInfo, getFollow, getMessage } from '../../../request/request-zhihu/request-zhihu.request';
import { DataCardGroup } from '../../common/group-setting/group.interface';
import { useTemplate } from '../../common/template/display-template/display-template';
import { ZhihuDefaultConfig, ZhihuOptionalCardGroupList } from '../../setting/setting-zhihu/setting-zhihu.interface';

export function Zhihu() {
  const key = 'zhihu';

  let basicInfo: BasicInfo;
  let message: Message;
  let follow: Follow['List'][number];

  const { getRenderDOM, analyzeRequest, analyzeDataCard, forceUpdate } = useTemplate({ key, cardGroupList: ZhihuOptionalCardGroupList, defaultConfig: ZhihuDefaultConfig, title: '知乎' });

  useEffect(() => {
    analyzeRequest(
      [getBaiscInfo, getMessage, getFollow],
      data => {
        let showError = false;
        // 处理基础信息
        const [tempBasicInfo, tempMessage, tempFollow] = data;
        const responseBasicInfoData = tempBasicInfo.data;
        if (responseBasicInfoData.pv && !(responseBasicInfoData.pv === 6454813784 && responseBasicInfoData.share === 5244324)) {
          basicInfo = tempBasicInfo.data;
        } else {
          basicInfo = null;
          showError = true;
        }
        // 处理账户信息
        const responseMessage = tempMessage.data;
        if (responseMessage.name) {
          window.electron.ipcRenderer.send('set-title', { key, title: `知乎 - ${responseMessage.name}` });
          message = responseMessage;
        } else {
          message = null;
          showError = true;
        }
        // 处理关注信息
        const responseFollowData = tempFollow.data;
        if (responseFollowData.List.length > 0) {
          follow = responseFollowData.List[0];
        } else {
          follow = null;
          showError = true;
        }
        forceUpdate();
        return showError;
      },
      () => {
        basicInfo = null;
        message = null;
      },
    );
  }, []);

  useEffect(() => {
    analyzeDataCard((type: string, cardList: DataCardGroup['children']) => {
      const target = cardList.find(v => v.value === type);
      let dataSource: object;
      if (['play', 'collect', 'comment', 'like', 'like_and_reaction', 'pv', 'share', 'upvote'].includes(type)) {
        dataSource = basicInfo;
      } else if (['messages_count'].includes(type)) {
        dataSource = message;
      } else if (['total_follow', 'active_follow'].includes(type)) {
        dataSource = follow;
      } else {
        throw new Error(`Can not find type of card: ${type}`);
      }
      return { target, dataSource };
    });
  }, []);

  return getRenderDOM();
}
