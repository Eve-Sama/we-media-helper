import { DataCardGroup } from '../../../setting/common/group-setting/group.interface';
import { StorageData } from '../template.interface';

export interface SettingTemplateOptions {
  /** 模块标识符, 如 juejin、bilibili */
  key: string;
  defaultConfig: StorageData;
  cardGroupList: DataCardGroup[];
}
