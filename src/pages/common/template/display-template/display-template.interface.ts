import { AxiosPromise } from 'axios-esm';

import { DataCardGroup, Group } from '../../group-setting/group.interface';

export interface TemplateOptions {
  /** 模块标识符, 如 juejin、bilibili */
  key: string;
  /** 模块全部的分组数据, 是指能选到的, 而非已设置的 */
  cardGroupList: DataCardGroup[];
  /** 窗口的标题 */
  title: string;
  defaultConfig?: StorageData;
}

export interface StorageData {
  /** 偏好设置 */
  config: {
    cookie: string;
    refreshTime: string;
    showCountdown: boolean;
    groupList: Group[];
    enableJumpLink: boolean;
  };
  /** 卡片最新数据, 用于推送提醒 */
  dataCardList: Array<{ type: string; value: number }>;
}

type UnionToIntersection<U> = (U extends any ? (a: (k: U) => void) => void : never) extends (a: infer I) => void ? I : never;
type UnionLast<U> = UnionToIntersection<U> extends (a: infer I) => void ? I : never;
type UnionToTuple<U> = [U] extends [never] ? [] : [...UnionToTuple<Exclude<U, UnionLast<U>>>, UnionLast<U>];
/**
 * 下面俩类型是我手动慢慢推导的, 上面三行网上查的
 * @see https://segmentfault.com/q/1010000042243980
 */
export type AnalyzeRequest = <T extends ReadonlyArray<() => AxiosPromise>>(request: T, callback: (data: UnionToTuple<Awaited<ReturnType<T[number]>>>) => boolean) => void;
export type AnalyzeDataCard = (callback: (type: string, allCardList: DataCardGroup['children']) => { target: DataCardGroup['children'][number]; dataSource: object }) => void;
