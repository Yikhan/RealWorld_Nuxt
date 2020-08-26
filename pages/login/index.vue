<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{ isLoginPage ? 'Sign in' : 'Sign up'}}</h1>
          <p class="text-xs-center">
            <!-- <a href>Have an account?</a> -->
            <nuxt-link v-if="!isLoginPage" to="/login">Have an account?</nuxt-link>
            <nuxt-link v-else to="/register">Need an account?</nuxt-link>
          </p>

          <ul class="error-messages">
            <template v-for="(messages, field) in errors">
              <li v-for="(message, index) in messages" :key="index">{{field}} {{message}}</li>
            </template>
          </ul>

          <form @submit.prevent="onSubmit">
            <fieldset class="form-group" v-if="!isLoginPage">
              <input
                v-model="user.username"
                class="form-control form-control-lg"
                type="text"
                placeholder="Your Name"
                required
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                v-model="user.email"
                class="form-control form-control-lg"
                type="email"
                placeholder="Email"
                required
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                v-model="user.password"
                class="form-control form-control-lg"
                type="password"
                placeholder="Password"
                required
                minlength="8"
              />
            </fieldset>
            <button
              class="btn btn-lg btn-primary pull-xs-right"
            >{{ isLoginPage ? 'Sign in' : 'Sign up'}}</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login, register } from '@/api/user'
// 仅在客户端加载
// process.client是Nuxt提供的默认变量，判断当前环境是否在客户端
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  // 如果已经登录了就不允许再访问登录/注册页面了
  middleware: 'notAuthenticated',
  name: 'Login',
  computed: {
    isLoginPage() {
      return this.$route.name === 'login'
    }
  },
  data() {
    return {
      user: {
        username: '',
        email: '',
        password: ''
      },
      errors: {}
    }
  },
  methods: {
    async onSubmit() {
      // 提交表单登录验证
      try {
        const { data } = this.isLoginPage
          ? await login({
              user: this.user
            })
          : await register({
              user: this.user
            })
        // 保存用户数据
        this.$store.commit('setUser', data.user)

        // 持久化，防止刷新页面后丢失
        Cookie.set('user', data.user)

        // 跳转首页
        this.$router.push('/')
        console.log(data)
      } catch (error) {
        console.log('Request Fail', error)
        this.errors = error.response.data.errors
      }
    }
  }
}
</script>

<style>
</style>