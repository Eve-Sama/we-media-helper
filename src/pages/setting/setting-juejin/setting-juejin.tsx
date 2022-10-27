import { useSettingTemplate } from '../../common/template/setting-template/setting-template';
import { JuejinDefaultConfig, JuejinOptionalCardGroupList } from './setting-juejin.interface';

export function SettingJuejin() {
  const key = 'juejin';
  const { getRenderDOM } = useSettingTemplate({ key, defaultConfig: JuejinDefaultConfig, cardGroupList: JuejinOptionalCardGroupList });

  return getRenderDOM();
}
