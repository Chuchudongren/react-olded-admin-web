import axios from 'axios'
import qs from 'qs'

axios.defaults.baseURL = 'http://127.0.0.1:8002'


axios.defaults.headers['Authorization'] = ''


// axios.interceptor.request.use
// axios.interceptors.response.use
// axios拦截器 每次执行axios 请求是会调用
// 添加一个请求拦截器
axios.interceptors.request.use(
  function (config) {
    const token = qs.parse(localStorage.getItem('token'))
    console.log(token);
    config.headers.Authorization = 'Bearer ' + token.token
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// 添加一个响应拦截器
axios.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    return Promise.reject(error)
  }
)

