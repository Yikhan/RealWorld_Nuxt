<template>
  <div class="article-meta">
    <nuxt-link
      :to="{
      name: 'profile',
      params: {
        username: author.username
      }
    }"
    >
      <img :src="author.image" />
    </nuxt-link>
    <div class="info">
      <nuxt-link
        class="author"
        :to="{
          name: 'profile',
          params: {
            username: author.username
          }
        }"
      >{{ author.username }}</nuxt-link>
      <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
    </div>
    <button
      v-if="author.username !== user.username"
      class="btn btn-sm btn-outline-secondary"
      :class="{
        active: author.following
      }"
      @click="onFollow(author)"
      :disabled="author.followDisabled || user.username === author.username"
    >
      <i class="ion-plus-round"></i>
      &nbsp;
      {{ author.following ? `Unfollow ${author.username}` : `Follow ${author.username}` }}
    </button>
    <nuxt-link
      v-else
      class="btn btn-sm btn-outline-secondary"
      :to="{
        name: 'editor',
        params: {
          slug: article.slug
        }
      }"
    >
      <i class="ion-edit"></i>
      &nbsp;
      Edit Article
    </nuxt-link>&nbsp;&nbsp;
    <button
      v-if="author.username !== user.username"
      class="btn btn-sm btn-outline-primary"
      :class="{
        active: article.favorited
      }"
      @click="onFavorite(article)"
      :disabled="article.favoriteDisabled"
    >
      <i class="ion-heart"></i>
      &nbsp;
      Favorite Post
      <span class="counter">({{ article.favoritesCount }})</span>
    </button>
    <button
      v-else
      class="btn btn-sm btn-outline-danger"
      :class="{
        active: article.favorited
      }"
      @click="onDeleteArticle(article)"
      :disabled="isDeleting"
    >
      <i class="ion-trash-a"></i>
      &nbsp;
      Delete Post
    </button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { deleteArticle } from '@/api/article'
import { onFavorite } from '@/utils/article'
import { onFollow } from '@/utils/user'

export default {
  name: 'ArticleMeta',

  props: {
    article: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      isDeleting: false
    }
  },

  computed: {
    ...mapState(['user']),

    author() {
      return this.article.author
    }
  },

  methods: {
    onFavorite,
    onFollow,
    async onDeleteArticle(article) {
      const {slug} = article
      this.isDeleting = true
      await deleteArticle(slug)
      this.isDeleting = false
      this.$router.push('/')
    }
  },

  mounted() {
    const { author } = this.article
    author.followDisabled = false
  }
}
</script>

<style>
</style>