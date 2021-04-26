/* 
能发送异步ajax请求的异步模块
封装axios库
函数的返回值是promise对象
1.优化：统一处理请求异常：
    在外层包一个自己创建的promise
    请求出错的时候不reject(error)，而是显示错误提示

*/

import axios from 'axios'
import {message} from 'antd'

export default function ajax(url, data={}, type='GET'){
    return new Promise((resolve,reject)=>{
        let promise
        // 执行异步请求
        if(type==='GET'){
            promise =  axios.get(url, {
                params: data //请求指定参数
            })
        } else {
            promise =  axios.post(url, data)
        }
        promise.then(response =>{
            resolve(response.data)
        }).catch(error =>{
            message.error('请求出错了：'+error.message)
        })
        // 如果成功了，调用resolve(value)
        // 如果失败了，不调用reject(reason)，而是提示异常信息
    })
    
}

