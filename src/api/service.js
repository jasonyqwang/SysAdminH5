/**
 * 包装 axios
 */
import axios from 'axios'
import { Message } from 'element-ui'
import { API_CODE, STORAGE } from '@/components/common/global'

const service = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
})

// 请求
service.interceptors.request.use(config => {
    //config.body = JSON.stringify(config.data);
    //所有的请求，都需要
    config.headers['api-token'] = localStorage.getItem(STORAGE.API_TOKEN);
    return config;
}, error => {
    Promise.reject(error);
})

// 响应
service.interceptors.response.use(
    response => {
        let res = response.data;
        if(API_CODE.AUTH_ERROR == res.code){
            Message({
                message: res.msg,
                type: 'error',
                duration: 3 * 1000
            });
            //清空token
            localStorage.removeItem(STORAGE.API_TOKEN);
            localStorage.removeItem(STORAGE.USERNAME);
            //跳转到登录
            location.href = '/#/login'
        }else if (API_CODE.SUCCESS != res.code) {
            Message({
                message: res.msg,
                type: 'error',
                duration: 3 * 1000
            });
            // return Promise.reject(res.msg,);
            return response;
        } else {
            return res;
        }
    },
    error => {
        Message({
            message: error.message,
            type: 'error',
            duration: 3 * 1000
        });
        return Promise.reject(error);
        // console.log(error)
        // return error;
    }
)

export default service;