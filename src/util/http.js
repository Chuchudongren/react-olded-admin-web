import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8002'

axios.defaults.headers['Authorization'] = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjEyMyIsImlhdCI6MTY1MDQyODI3OCwiZXhwIjoxNjUwNDY0Mjc4fQ.9iiVhijsCYB7TK8hSA1SyTA9t5A2zNSd6FgGndbbGtE'


// axios.interceptor.request.use
// axios.interceptors.response.use
// axios拦截器 每次执行axios 请求是会调用
// 添加一个请求拦截器
/* axios.interceptors.request.use(
  function (config) {
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
 */
