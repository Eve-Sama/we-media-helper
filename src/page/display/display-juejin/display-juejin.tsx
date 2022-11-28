import { useEffect } from 'react';

import { Count, UserBasicInfo } from '../../../request/request-juejin/request-juejin.interface';
import { getCount, getUser, getUserBaiscInfo } from '../../../request/request-juejin/request-juejin.request';
import { DataCardGroup } from '../../common/group-setting/group.interface';
import { useDisplayTemplate } from '../../common/template/display-template/display-template';
import { JuejinDefaultConfig, JuejinOptionalCardGroupList } from '../../setting/setting-juejin/setting-juejin.interface';

export function DisplayJueJin() {
  const key = 'juejin';

  let countData: Count['count'];
  let basicInfoData: UserBasicInfo;

  const { getRenderDOM, analyzeRequest, analyzeDataCard, forceUpdate } = useDisplayTemplate({ key, cardGroupList: JuejinOptionalCardGroupList, defaultConfig: JuejinDefaultConfig, title: '掘金' });

  useEffect(() => {
    analyzeRequest(
      [getCount, getUser, getUserBaiscInfo] as const,
      data => {
        let showError = false;
        // 处理实时交互数据
        const [tempCountData, tempUserData, tempUserBasicInfoData] = data;
        const responseCountData = tempCountData.data;
        if (responseCountData.err_no === 0) {
          countData = responseCountData.data.count;
        } else {
          countData = null;
          showError = true;
        }
        // 处理账户信息
        const responseUserData = tempUserData.data;
        if (responseUserData.err_no === 0) {
          window.electron.ipcRenderer.send('set-title', { key, title: `掘金 - ${responseUserData.data.user_name}` });
        } else {
          showError = true;
        }
        // 处理统计数据
        const responseUserBasicInfoData = tempUserBasicInfoData.data;
        if (responseUserBasicInfoData.err_no === 0) {
          basicInfoData = responseUserBasicInfoData.data;
        } else {
          basicInfoData = null;
          showError = true;
        }
        forceUpdate();
        return showError;
      },
      () => {
        countData = null;
        basicInfoData = null;
      },
    );
  }, []);

  useEffect(() => {
    analyzeDataCard((type: string, cardList: DataCardGroup['children']) => {
      const target = cardList.find(v => v.value === type);
      let dataSource: object;
      if (['reply', 'like', 'follow', 'system', 'job', 'message'].includes(type)) {
        dataSource = countData;
      } else if (['likeTotal', 'read', 'power', 'fan'].includes(type)) {
        dataSource = basicInfoData;
      } else {
        throw new Error(`Can not find type of card: ${type}`);
      }
      return { target, dataSource };
    });
  }, []);

  return getRenderDOM();
}
