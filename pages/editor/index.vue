<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  v-model="title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                  v-model="description"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  v-model="body"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input type="text" class="form-control" placeholder="Enter tags" v-model="tags" />
                <div class="tag-list"></div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
                @click="onPostArticle()"
              >Publish Article</button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  addArticle,
  getArticle,
  updateArticle
} from '@/api/article'

export default {
  // 在路由匹配前先执行中间件
  middleware: 'authenticated',

  name: 'Editor',

  data() {
    return {
      title: '',
      description: '',
      body: '',
      tags: '',
      slug: ''
    }
  },

  async asyncData({ params }) {
    const { slug } = params

    if (!slug) return

    const {
      data: { article }
    } = await getArticle(slug)

    return {
      article
    }
  },

  mounted() {
    if (this.article) {
      this.mapArticle(this.article)
    }
  },

  methods: {
    async onPostArticle() {
      const params = {
        article: {
          title: this.title,
          description: this.description,
          body: this.body,
          tagList: this.tags.split(',')
        }
      }

      if (this.slug) {
        // 修改文章
        await updateArticle(this.slug, params)
      } else {
        // 发布新文章
        const { data } = await addArticle(params)
        this.slug = data.article.slug
      }
      // 跳转到新发的文章页面
      this.$router.push(`/article/${this.slug}`)
    },

    mapArticle(article) {
      this.title = article.title
      this.description = article.description
      this.body = article.body
      this.tags = article.tagList.join(', ')
      this.slug = article.slug
    }
  }
}
</script>

<style>
</style>