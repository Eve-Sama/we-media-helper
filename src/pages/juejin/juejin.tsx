import { useState } from 'react';
import styles from './style.module.scss';
import { getCount, getUser, getUserBaiscInfo } from '../../request/juejin/juejin.request';
import { JuejinCardGroupList } from '../setting/setting-juejin/setting-juejin.interface';
import { useTemplate } from '../common/template/template';

export function JueJin() {
  const [countData, setCountData] = useState<any>({});
  const [basicInfoData, setBasicInfoData] = useState<any>({});
  const key = 'juejin';

  const getDataCardInfo = (type: string) => {
    const target = cardList.find(v => v.value === type);
    let dataSource: object;
    if (['reply', 'like', 'follow', 'system', 'job'].includes(type)) {
      dataSource = countData;
    } else if (['likeTotal', 'read', 'power', 'fan'].includes(type)) {
      dataSource = basicInfoData;
    }
    const changeValue = target.changeValue.reduce((pre, cur) => pre + dataSource[cur], 0);
    const totalValue = target.totalValue.reduce((pre, cur) => pre + dataSource[cur], 0);
    return {
      type,
      title: target.label,
      changeValue: changeValue,
      // totalValue 在 'message' 类型下, 可能为 NaN
      totalValue: totalValue || 0,
    };
  };

  const { cardList, getRenderDOM, analyzeRequest } = useTemplate({ key, cardGroupList: JuejinCardGroupList, title: '掘金', getDataCardInfo, styles });

  analyzeRequest([getCount(), getUser(), getUserBaiscInfo()], data => {
    let showError = false;
    // 处理实时交互数据
    const [tempCountData, tempUserData, tempUserBasicInfoData] = data;
    const responseCountData = tempCountData.data;
    if (responseCountData.err_no === 0) {
      setCountData(responseCountData.data.count);
    } else {
      setCountData({});
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
      setBasicInfoData(responseUserBasicInfoData.data);
    } else {
      setBasicInfoData({});
      showError = true;
    }
    return showError;
  });

  return getRenderDOM();
}
