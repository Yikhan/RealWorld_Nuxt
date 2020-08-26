import axios from 'axios'

// 创建请求对象
export const request = axios.create({
  baseURL: 'https://conduit.productionready.io'
})

// 通过Nuxt插件机制获取到上下文对象(query, params, req, res, app, store等等)
// 插件导出函数必须是default
export default ({ store }) => {
  // 请求拦截器
  request.interceptors.request.use(
    function (config) {
      // Do something before request is sent

      const { user } = store.state

      // 统一设置token 注意Token的格式要求要按照
      // https://github.com/gothinkster/realworld/tree/master/api
      if (user && user.token) {
        config.headers.Authorization = `Token ${user.token}`
      }

      return config
    },
    
    function (error) {
      // Do something with request error
      // 此时请求还没有发出去，这个情况比较少见
      return Promise.reject(error)
    }
  )
}
