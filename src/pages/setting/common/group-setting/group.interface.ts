export interface Group {
  label: string;
  cardList: Array<{
    /** 统计数据类型 */
    type: string;
    /** 数据有新增时, 弹窗提醒 */
    notify: boolean;
  }>;
  uuid: string;
  /** 每一行的列数 */
  columnNum: number;
}

export interface GroupSettingRef {
  getData: () => Group[];
  /**
   * @todo 遇到个场景问题, 暂时不知道怎么解决.
   * GroupSetting 通过 props 拿到了 groupList, 再创建了一个 state groupListData. 之后在本组件内无论怎么操作, 修改的都是 groupListData 而不是 groupList.
   * 那么当父组件想要重置 groupList 的时候, 好像只能通过手动调用子组件方法来重置.
   */
  setGroupListData: React.Dispatch<React.SetStateAction<Group[]>>;
}

export interface GroupSettingProps {
  cardGroupList: DataCardGroup[];
  groupList: Group[];
}

export interface DataCardGroup {
  group: string;
  children: Array<{ label: string; value: string; changeValue: string[]; totalValue: string[] }>;
}
