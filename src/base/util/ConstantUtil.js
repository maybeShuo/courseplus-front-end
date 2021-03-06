const HOST = "";
// const HOST = "http://127.0.0.1:3000";

const DEFAULT_AVATOR = "/imgs/user_avatar.png";

const PAY_CHANNEL = {
    "ALIPAY": "alipay_pc_direct"
};

const ORDER_TYPE = {
    "RESOURCE": 1,
    "QUESTION": 2,
    "SINGLE_COURSE" : 3,
    "ALL_COURSE": 4
};

const EVENT_NAME = {
    "ADD_QUESTION_INFO": "dispatch question info"
}

export {
    HOST,
    DEFAULT_AVATOR,
    ORDER_TYPE,
    PAY_CHANNEL,
    EVENT_NAME
};
