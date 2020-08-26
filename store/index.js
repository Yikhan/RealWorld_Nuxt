// 需要把state定义成函数，避免服务端和客户端数据冲突
// 按需导出
const cookieparser = process.server ? require('cookieparser') : undefined

export const state = () => {
  return {
    user: null
  }
}

export const mutations = {
  setUser (state, user) {
    state.user = user
  }
}

export const actions = {
  // nuxtServerInit是一个特殊的action方法
  // 会在服务端渲染期间自动调用
  // 作用：初始化vuex数据，传递数据给客户端
  nuxtServerInit ({ commit }, { req }) {
    console.log('nuxtServerInit')
    let user = null
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        user = JSON.parse(parsed.user)
      } catch (err) {
        // No valid cookie found
      }
    }
    commit('setUser', user)
  }
}
