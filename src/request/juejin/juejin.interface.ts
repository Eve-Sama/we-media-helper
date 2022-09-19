export interface Count {
  err_no: number;
  data: {
    count: {
      /** 点赞消息 */
      1: number;
      /** 关注消息 */
      2: number;
      /** 评论消息 */
      3: number;
      /** 系统消息 */
      4: number;
      /** 职位沟通 */
      5: number;
    };
  };
}

export interface User {
  err_no: number;
  data: {
    user_name: string;
  };
}
