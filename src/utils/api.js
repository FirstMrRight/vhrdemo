import axios from 'axios'
import {Message} from 'element-ui';
import router from "@/router";

/*
* 封装请求的js
* 服务端是200，进入data中，400，500进入error
* 前端data中的数据比较复杂，并不是服务端返回的字段
* data中有一个字段，success，success中的字段才是返回的字段
* */
axios.interceptors.response.use(success => {
    if (success.status&&success.status==200&&success.status==500){
        Message.error({
            //服务端的返回信息
            message:success.data.msg})
        return;
    }
    if (success.data.msg){
        Message.success({message:success.data.msg})
    }
    return success.data;//服务费返回的数据
},error => {
    if (error.response.status==504||error.response.status==404){
        Message.error({message:'服务器出现问题'})
    }else if(error.response.status==403){
        Message.error({message:'权限不足，请联系管理员'})
    }else if (error.response.data.status==401){
           Message.error({message:'尚未登录，请登录'})
        router.replace("/")
    }else {
        if(error.response.data.msg) {
            Message.error({message: error.response.data.msg})
        }
        else {
            Message.error({message:'未知错误,'+error.response.data.msg})
        }
    }
    return;
})


/*
*请求封装开始
* post请求以key/value形式传参
* */

let base = '';

export const postKeyValueRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        transformRequest: [function (data) {
            let ret = '';
            for (let i in data) {
                ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
            }
            return ret;
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params
    })
}
export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params
    })
}
export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        data: params
    })
}
export const deleteRequest = (url, params) => {
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        data: params
    })
}
