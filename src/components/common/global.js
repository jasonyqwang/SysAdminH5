import moment from 'moment'

// 常量
export const API_CODE = {
  SUCCESS: 0,
  AUTH_ERROR: 1005, //认证错误
};

export const STORAGE = {
  USERNAME: 'USERNAME',
  ROLE_ID: 'ROLE_ID',
  API_TOKEN: 'API_TOKEN',
  LAST_IP: 'LAST_IP'
}

export const OPTIONSPAYMODE = {
  1: '人工充值',
  1016: '蛋蛋支付',
  1017: '可乐支付',
  1018: 'ww支付',
  1020: '蛋蛋支付2',
  3000: 'vip支付',
}

export const  OPTIONSCASH ={
//    -1:'未通过,金币返回失败',
//   -2:'提现失败',
    1:'提交申请',
    2:'已审核',
    3:'已放款',
    4:'未通过，金币已返回',
    5:'已到帐',
    6:'提现失败，金币已返回',
    7:'未通过，金币不返回',
}


// 全局方法

/**
 * 格式化时间
 * @param timestamp
 * @param format YYYY-MM-DD HH:mm:ss
 * @returns {string}
 */
export const dateFormatter = (timestamp, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!timestamp) {
    return '-'
  }
  return moment(timestamp * 1000).format(format)
}

/**
 * 获取提现状态
 * @param timestamp
 * @returns {string}
 */
export const cashStatus = (pstatus) => {
    if(pstatus == -1){
        return '未通过,金币返回失败'
    }

    if(pstatus == -2){
        return '提现失败'
    }
    return OPTIONSCASH[pstatus];
}
