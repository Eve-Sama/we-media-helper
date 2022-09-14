export interface Stat {
  code: number;
  data: {
    inc_coin: number;
    inc_elec: number;
    inc_fav: number;
    inc_like: number;
    inc_share: number;
    incr_click: number;
    incr_dm: number;
    incr_fans: number;
    incr_reply: number;
    total_click: number;
    total_coin: number;
    total_dm: number;
    total_elec: number;
    total_fans: number;
    total_fav: number;
    total_like: number;
    total_reply: number;
    total_share: number;
  };
}

export interface Account {
  code: number;
  data: {
    mid: number;
    uname: string;
    userid: string;
    sign: string;
    birthday: string;
    sex: string;
    nick_free: boolean;
    rank: string;
  };
}

export interface Unread {
  code: number;
  data: {
    at: number;
    like: number;
    sys_msg: number;
    reply: number;
  };
}

export interface Message {
  code: number;
  data: {
    follow_unread: number;
    unfollow_unread: number;
  };
}
