import { useSettingTemplate } from '../../common/template/setting-template/setting-template';
import { ZhihuDefaultConfig, ZhihuOptionalCardGroupList } from './setting-zhihu.interface';

export function SettingZhihu() {
  const key = 'zhihu';
  const { getRenderDOM } = useSettingTemplate({ key, defaultConfig: ZhihuDefaultConfig, cardGroupList: ZhihuOptionalCardGroupList });

  return getRenderDOM();
}
