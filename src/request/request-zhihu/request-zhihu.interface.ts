export interface BasicInfo {
  // 不知道这几个哪些参数的属性
  // re_pin: number;
  // reaction: number;
  // show: number;
  /** 播放总量 */
  play: number;
  /** 收藏总量 */
  collect: number;
  /** 评论总量 */
  comment: number;
  like: number;
  /** 喜欢总量 */
  like_and_reaction: number;
  /** 阅读总量 */
  pv: number;
  /** 分享总量 */
  share: number;
  /** 赞同总量 */
  upvote: number;
}

export interface Message {
  name: string;
  messages_count: number;
}

export interface Follow {
  List: Array<{
    /** 关注者总数 */
    total_follow: 8107;
    /** 活跃关注者 */
    active_follow: 2033;
    /** 昨日关注者变化 */
    pre_follow: -1;
  }>;
}
