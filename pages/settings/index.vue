<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form @submit.prevent="onSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                  v-model="image"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                  v-model="username"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                  v-model="bio"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="email"
                  placeholder="Email"
                  v-model="email"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  v-model="password"
                />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">Update Settings</button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { updateUser, getProfile } from '@/api/user'
import { mapState } from 'vuex'

export default {
  // 在路由匹配前先执行中间件
  middleware: 'authenticated',
  name: 'Settings',

  async asyncData({ store }) {
    const { user } = store.state
    const profileRes = await getProfile(user.username)
    const {
      data: { profile }
    } = profileRes

    return {
      profile
    }
  },

  data() {
    return {
      image: '',
      username: '',
      bio: '',
      email: '',
      password: ''
    }
  },

  mounted() {
    // 合并profile和store传来的当前用户user数据
    // bio只在profile里面有, email只在user里面有
    this.image = this.profile.image
    this.username = this.profile.username
    this.bio = this.profile.bio
    this.email = this.user.email
  },

  computed: {
    ...mapState(['user'])
  },

  methods: {
    async onSubmit() {
      const user = {
        email: this.email,
        bio: this.bio,
        image: this.image,
        username: this.username
      }

      if (this.password) {
        user.password = this.password
      }

      // 更新用户信息
      await updateUser({user})

      // 跳转到profile
      this.$router.push(`/profile/${user.username}`)
    }
  }
}
</script>

<style>
</style>