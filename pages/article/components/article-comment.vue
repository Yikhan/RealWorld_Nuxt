<template>
  <div>
    <form class="card comment-form">
      <div class="card-block">
        <textarea
          class="form-control"
          placeholder="Write a comment..."
          rows="3"
          v-model="commentBody"
        ></textarea>
      </div>
      <div class="card-footer">
        <img :src="user.image" class="comment-author-img" />
        <button type="button" class="btn btn-sm btn-primary" @click="onPostComment">Post Comment</button>
      </div>
    </form>

    <div class="card" v-for="comment in comments" :key="comment.id">
      <div class="card-block">
        <p class="card-text">{{ comment.body }}</p>
      </div>
      <div class="card-footer">
        <nuxt-link
          :to="{
           name: 'profile',
           params: {
             username: comment.author.username
           }
         }"
          class="comment-author"
        >
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>&nbsp;
        <nuxt-link
          :to="{
           name: 'profile',
           params: {
             username: comment.author.username
           }
         }"
          class="comment-author"
        >{{comment.author.username}}</nuxt-link>
        <span class="date-posted">{{ comment.createdAt | date('MMM DD, YYYY') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getComments, addComment } from '@/api/article'
import { mapState } from 'vuex'
import { verifyAvatar } from '@/utils/user'

export default {
  name: 'ArticleComment',

  props: {
    article: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      comments: [],
      commentBody: ''
    }
  },

  computed: {
    ...mapState(['user'])
  },

  methods: {
    async loadComments() {
      const { data } = await getComments(this.article.slug)

      // 处理评论作者的头像图片，如果图片无效就设置为默认图片
      data.comments.forEach(comment => verifyAvatar(comment.author))

      this.comments = data.comments
    },

    async onPostComment() {
      const params = {
        comment: {
          body: this.commentBody
        }
      }

      await addComment(this.article.slug, params)
      // 清空评论输入框
      this.commentBody = ''
      // 重新载入评论
      this.loadComments()
    }
  },

  mounted() {
    // 评论不需要SEO，不用放在asyncData里
    this.loadComments()
  }
}
</script>

<style>
</style>