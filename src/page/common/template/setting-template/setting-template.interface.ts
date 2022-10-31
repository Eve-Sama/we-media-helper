import { DataCardGroup } from '../../group-setting/group.interface';
import { StorageData } from '../display-template/display-template.interface';

export interface SettingTemplateOptions {
  /** 模块标识符, 如 juejin、bilibili */
  key: string;
  defaultConfig: StorageData;
  cardGroupList: DataCardGroup[];
}
