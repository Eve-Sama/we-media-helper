import { getCount, getUser, getUserBaiscInfo } from '../../request/juejin/juejin.request';
import { JuejinCardGroupList } from '../setting/setting-juejin/setting-juejin.interface';
import { useTemplate } from '../common/template/template';
import { Count, UserBasicInfo } from '../../request/juejin/juejin.interface';
import { useEffect } from 'react';
import { DataCardGroup } from '../setting/common/group-setting/group.interface';

export function JueJin() {
  const key = 'juejin';

  let countData: Count;
  let basicInfoData: UserBasicInfo;

  const { getRenderDOM, analyzeRequest, analyzeDataCard, forceUpdate } = useTemplate({ key, cardGroupList: JuejinCardGroupList, title: '掘金' });

  useEffect(() => {
    analyzeRequest([getCount, getUser, getUserBaiscInfo], data => {
      let showError = false;
      // 处理实时交互数据
      const [tempCountData, tempUserData, tempUserBasicInfoData] = data;
      const responseCountData = tempCountData.data;
      if (responseCountData.err_no === 0) {
        countData = responseCountData.data;
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
    });
  }, []);

  useEffect(() => {
    analyzeDataCard((type: string, cardList: DataCardGroup['children']) => {
      const target = cardList.find(v => v.value === type);
      let dataSource: object;
      if (['reply', 'like', 'follow', 'system', 'job'].includes(type)) {
        dataSource = countData;
      } else if (['likeTotal', 'read', 'power', 'fan'].includes(type)) {
        dataSource = basicInfoData;
      }
      return { target, dataSource };
    });
  }, []);

  return getRenderDOM();
}
