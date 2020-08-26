import { addFavorite, deleteFavorite } from '@/api/article'
import { setDefaultAvatar, verifyAvatar } from './user'

// 预处理服务器返回的文章数组
export const prepareArticleArray = (articles) => {
  articles.forEach((article) => {
    // 给文章增加一个是否允许点击点赞按钮的状态值，防止重复点击
    article.favoriteDisabled = false

    // 在显示文章列表前预处理，比如给没有头像的作者设置一个默认头像
    const { author } = article
    verifyAvatar(author)
  })
}

export const onFavorite = async (article) => {
  // 不允许在api请求结束前重复点击
  article.favoriteDisabled = true

  if (article.favorited) {
    await deleteFavorite(article.slug)
    article.favorited = false
    article.favoritesCount -= 1
  } else {
    await addFavorite(article.slug)
    article.favorited = true
    article.favoritesCount += 1
  }

  article.favoriteDisabled = false
}
