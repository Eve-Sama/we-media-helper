import { DataCardGroup, Group } from '../../setting/common/group-setting/group.interface';

export interface TemplateOptions {
  /** 模块标识符, 如 juejin、bilibili */
  key: string;
  /** 模块全部的分组数据, 是指能选到的, 而非已设置的 */
  cardGroupList: DataCardGroup[];
  /** 窗口的标题 */
  title: string;
  /** 卡片的解析数据逻辑 */
  getDataCardInfo: (type: string) => {
    type: string;
    title: string;
    changeValue: any;
    totalValue: any;
  };
  /** 样式文件 */
  styles: {
    readonly [key: string]: string;
  };
}

export interface StorageData {
  /** 偏好设置 */
  config: {
    cookie: string;
    refreshTime: string;
    showCountdown: boolean;
    groupList: Group[];
  };
  /** 卡片最新数据, 用于推送提醒 */
  dataCardList: Array<{ type: string; value: number }>;
}

export type AnalyzeRequest = <T extends readonly unknown[] | []>(request: T, callback: (data: { -readonly [P in keyof T]: Awaited<T[P]> }) => boolean) => void;
