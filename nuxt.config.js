module.exports = {
  router: {
    // nuxt-link高亮当前选中，把css类名字重命名为realworld自带的active
    linkActiveClass: 'active', 
    // 自定义路由表
    extendRoutes(routes, resolve) {
      // 清楚Nust自动生成的路由表
      routes.splice(0)

      routes.push(...[
      {
        path: '/',
        name: 'home',
        component: resolve(__dirname, 'pages/home/')
      },
      {
        path: '/login',
        name: 'login',
        component: resolve(__dirname, 'pages/login/')
      },
      {
        path: '/register',
        name: 'register',
        component: resolve(__dirname, 'pages/login/')
      },
      {
        path: '/profile/:username',
        name: 'profile',
        component: resolve(__dirname, 'pages/profile/')
      },
      {
        path: '/settings',
        name: 'settings',
        component: resolve(__dirname, 'pages/settings/')
      },
      {
        path: '/editor',
        name: 'editor',
        component: resolve(__dirname, 'pages/editor/')
      },
      {
        path: '/article/:slug',
        name: 'article',
        component: resolve(__dirname, 'pages/article/')
      },
    ])
    }
  },

  // 注册插件
  plugins: [
    '~/plugins/request.js',
    '~/plugins/time.js'
  ]
}