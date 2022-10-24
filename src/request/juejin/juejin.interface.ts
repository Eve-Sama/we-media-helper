export interface JuejinResponse<T> {
  err_no: number;
  err_message: 'success';
  data: T;
}
export interface Count {
  count: {
    /** 点赞消息 */
    1: number;
    /** 关注消息 */
    2: number;
    /** 评论消息 */
    3: number;
    /** 系统消息 */
    4: number;
    /** 私信 */
    7: number;
  };
  total: number;
}

export interface User {
  user_name: string;
}

export interface UserBasicInfo {
  got_digg_count: number;
  got_view_count: number;
  power: number;
  follower_count: number;
}
