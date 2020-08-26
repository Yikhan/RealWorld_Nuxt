<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="user" class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'your_feed'  
                  }"
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'your_feed'
                    }
                  }"
                  exact
                >Your Feed</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'global_feed'  
                  }"
                  :to="{
                    name: 'home'
                  }"
                  exact
                >Global Feed</nuxt-link>
              </li>
              <li v-if="tag" class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'tag'  
                  }"
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'tag',
                      tag: tag
                    }
                  }"
                  exact
                ># {{ tag }}</nuxt-link>
              </li>
            </ul>
          </div>

          <div class="article-preview" v-for="article in articles" :key="article.slug">
            <div class="article-meta">
              <nuxt-link
                :to="{
                  name: 'profile',
                  params: {
                  username: article.author.username
                  }
                }"
              >
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link
                  class="author"
                  :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username
                    }
                  }"
                >{{article.author.username}}</nuxt-link>

                <span class="date">{{article.createdAt | date('MMM DD, YYYY')}}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{active: article.favorited}"
                @click="onFavorite(article)"
                :disabled="article.favoriteDisabled"
              >
                <i class="ion-heart"></i>
                {{article.favoritesCount}}
              </button>
            </div>
            <nuxt-link
              :to="{
                name: 'article',
                params: {
                  slug: article.slug
                }
              }"
              class="preview-link"
            >
              <h1>{{article.title}}</h1>
              <p>{{article.description}}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>

          <!-- 分页列表 -->
          <nav>
            <ul class="pagination">
              <li
                v-for="index in totalPage"
                :key="index"
                class="page-item"
                :class="{
                  active: index === page
                }"
              >
                <nuxt-link
                  class="page-link"
                  :to="{
                    name: 'home',
                    query: {
                      page: index,
                      tag: tag,
                      tab: tab
                    }
                  }"
                >{{index}}</nuxt-link>
              </li>
            </ul>
          </nav>
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link
                v-for="tag in tags"
                :key="tag"
                :to="{
                  name: 'home',
                  query: {
                    tag: tag,
                    tab: 'tag'
                  }
                }"
                class="tag-pill tag-default"
              >{{tag}}</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  getArticles,
  getYourFeedArticles
} from '@/api/article'
import { getTags } from '@/api/tag'
import { prepareTagArray } from '@/utils/tag'
import { prepareArticleArray, onFavorite } from '@/utils/article'

export default {
  name: 'Home',
  async asyncData({ query }) {
    // 显示第几页 注意api返回的总文章数目是一定的
    const page = Number.parseInt(query.page || 1) || 1
    const limit = 20
    // 当前选定的tab选项卡（自己的/大家的/标签下的文章）
    const tab = query.tab || 'global_feed'
    // 当前选定的标签
    const tag = query.tag
    const loadArticles = tab === 'your_feed' ? getYourFeedArticles : getArticles

    // 并行异步请求
    const [articleRes, tagRes] = await Promise.all([
      loadArticles({
        limit,
        offset: (page - 1) * limit,
        tag
      }),
      getTags()
    ])

    let { articles, articlesCount } = articleRes.data
    let { tags } = tagRes.data

    // 预处理一下数据数组
    prepareArticleArray(articles)
    tags = prepareTagArray(tags)

    return {
      articles, // 文章列表
      articlesCount, // 文章总数
      limit, // 每页多少文章
      page, // 页码
      tags, // 标签列表
      tab, // 选项卡
      tag // 当前标签
    }
  },
  computed: {
    ...mapState(['user']),

    totalPage() {
      return Math.ceil(this.articlesCount / this.limit)
    }
  },
  methods: {
    onFavorite
  },
  // 默认情况下query参数改变不会触发asyncData
  watchQuery: ['page', 'tag', 'tab']
}
</script>

<style>
</style>