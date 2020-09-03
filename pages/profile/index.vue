<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>{{ profile.bio }}</p>
            <button
              v-if="username !== user.username"
              @click="onFollow(profile)"
              :disabled="profile.followDisabled"
              class="btn btn-sm btn-outline-secondary action-btn"
            >
              <i class="ion-plus-round"></i>
              &nbsp;
              {{ profile.following ? 'Unfollow' : 'follow' }} {{ profile.username }}
            </button>
            <nuxt-link 
              v-else
              :to="{
                name: 'settings'
              }" 
              class="btn btn-sm btn-outline-secondary action-btn">
              <i class="ion-gear-a"></i>
              &nbsp;
              Edit Profile Settings
            </nuxt-link>
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
                <a
                  class="nav-link"
                  :class="{active: tab === tabNames.mine}"
                  style="cursor:pointer"
                  @click="onChangeArticleSet(tabNames.mine)"
                >My Articles</a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  :class="{active: tab === tabNames.favorited}"
                  style="cursor:pointer"
                  @click="onChangeArticleSet(tabNames.favorited)"
                >Favorited Articles</a>
              </li>
            </ul>
          </div>

          <div
            class="article-preview"
            v-for="article in articlesToDisplay.articles"
            :key="article.slug"
          >
            <div class="article-meta">
              <nuxt-link :to="`/profile/${article.author.username}`">
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link
                  class="author"
                  :to="`/profile/${article.author.username}`"
                >{{ article.author.username }}</nuxt-link>
                <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{active: article.favorited}"
                :disabled="article.favoriteDisabled"
                @click="onFavorite(article)"
              >
                <i class="ion-heart"></i>
                {{article.favoritesCount}}
              </button>
            </div>
            <nuxt-link
              class="preview-link"
              :to="{
                name: 'article',
                params: {
                  slug: article.slug
                }
              }"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
              <ul class="tag-list">
                <li
                  class="tag-default tag-pill tag-outline"
                  v-for="tag in article.tagList"
                  :key="tag"
                >{{ tag }}</li>
              </ul>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getProfile } from '@/api/user'
import { getArticles } from '@/api/article'
import { onFavorite } from '@/utils/article'
import { verifyAvatar, onFollow } from '@/utils/user'

export default {
  // 在路由匹配前先执行中间件
  middleware: 'authenticated',
  name: 'Profile',

  validate({ params }) {
    // 传入的路径中必须有username参数
    return !!params.username
  },

  data() {
    return {
      tabNames: {
        mine: 'my_articles',
        favorited: 'favorited_articles'
      },
      tab: 'my_articles',
      articlesToDisplay: []
    }
  },

  async asyncData({ params }) {
    const { username } = params

    const [profileRes, articlesRes, favArticlesRes] = await Promise.all([
      getProfile(username),
      getArticles({
        author: username
      }),
      getArticles({
        favorited: username
      })
    ])

    // 解构数据
    const {
      data: { profile }
    } = profileRes
    const { data: myArticles } = articlesRes
    const { data: myFavArticles } = favArticlesRes

    // 处理无效的头像图片
    verifyAvatar(profile)

    return {
      profile,
      myArticles,
      myFavArticles,
      username
    }
  },

  mounted() {
    this.articlesToDisplay = this.myArticles
    this.profile.followDisabled = false
  },

  computed: {
    ...mapState(['user'])
  },

  methods: {
    onFollow,
    onFavorite,
    onChangeArticleSet(tab) {
      if (tab === this.tabNames.mine) {
        this.articlesToDisplay = this.myArticles
        this.tab = this.tabNames.mine
      } else {
        this.articlesToDisplay = this.myFavArticles
        this.tab = this.tabNames.favorited
      }
    }
  }
}
</script>

<style>
</style>