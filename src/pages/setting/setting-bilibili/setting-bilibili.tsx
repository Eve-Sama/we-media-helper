import { useSettingTemplate } from '../../common/template/setting-template/setting-template';
import { BilibiliDefaultConfig, BilibiliOptionalCardGroupList } from './setting-bilibili.interface';

export function SettingBilibili() {
  const key = 'bilibili';
  const { getRenderDOM } = useSettingTemplate({ key, defaultConfig: BilibiliDefaultConfig, cardGroupList: BilibiliOptionalCardGroupList });

  return getRenderDOM();
}
