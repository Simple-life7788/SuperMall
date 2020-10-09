import axios from 'axios'
export function request(config) {
  /*1.创建axios实例*/
  const instance = axios.create({
    baseURL: 'http://152.136.185.210:8000/api/w6',
    timeout: 5000
  })
  /*axios 拦截器*/
  // 全局拦截 axios.interceptors
  instance.interceptors.request.use(config =>{
    //console.log(config)
    return config
    //请求拦截作用 1.拦截不符合服务器的要求的的信息进行拦截修改
    // 2.每次发送网络请求都希望界面显示一个请求的图标
    //3.某些网络请求必须携带一些特殊信息  token
  },err => {
    //console.log(err)
  })
  /*响应拦截
  * */
  instance.interceptors.response.use(res => {
    //console.log(res)
    return res.data
  },err => {
    //console.log(err)
  })
  return instance(config)
}


