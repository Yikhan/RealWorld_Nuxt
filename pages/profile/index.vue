<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="user.image" class="user-img" />
            <h4>{{ user.username }}</h4>
            <p>{{ user.bio }}</p>
            <button class="btn btn-sm btn-outline-secondary action-btn">
              <i class="ion-plus-round"></i>
              &nbsp;
              Follow {{ user.username }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <a class="nav-link active" href>My Articles</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href>Favorited Articles</a>
              </li>
            </ul>
          </div>

          <div class="article-preview" v-for="article in myArticles.articles" :key="article.slug">
            <div class="article-meta">
              <nuxt-link
                :to="`/profile/${article.author.username}`"
              >
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link 
                  href class="author"
                  :to="`/profile/${article.author.username}`"
                >{{ article.author.username }}</nuxt-link>
                <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
              </div>
              <button class="btn btn-outline-primary btn-sm pull-xs-right">
                <i class="ion-heart"></i> 32
              </button>
            </div>
            <a href class="preview-link">
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
              <ul class="tag-list">
                <li
                  class="tag-default tag-pill tag-outline"
                  v-for="tag in article.tagList"
                  :key="tag"
                >
                  {{ tag }}
                </li>
              </ul>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProfile } from '@/api/user'
import { getArticles } from '@/api/article'
import { verifyAvatar } from '@/utils/user'

export default {
  // 在路由匹配前先执行中间件
  middleware: 'authenticated',
  name: 'Profile',

  async asyncData({ params }) {
    const [profileRes, articlesRes, favArticlesRes] = await Promise.all([
      getProfile(params.username),
      getArticles({
        author: params.username
      }),
      getArticles({
        favorited: params.username
      })
    ])

    // 解构数据
    const {
      data: { profile: user }
    } = profileRes
    const { data: myArticles } = articlesRes
    const { data: myFavArticles } = favArticlesRes

    // 处理无效的头像图片
    verifyAvatar(user)

    return {
      user,
      myArticles,
      myFavArticles
    }
  }
}
</script>

<style>
</style>