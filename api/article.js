import { request } from '@/plugins/request'

// 获取公共文章列表
export const getArticles = (params) => {
  return request({
    method: 'GET',
    url: '/api/articles',
    params
  })
}

// 获取订阅文章列表
export const getYourFeedArticles = (params) => {
  return request({
    method: 'GET',
    url: '/api/articles/feed',
    params
  })
}

// 获取文章详情
export const getArticle = (slug) => {
  return request({
    method: 'GET',
    url: `/api/articles/${slug}/`
  })
}

// 发布文章
export const addArticle = (params) => {
  return request({
    method: 'POST',
    url: `/api/articles`,
    data: params
  })
}

// 修改文章
export const updateArticle = (slug, params) => {
  return request({
    method: 'PUT',
    url: `/api/articles/${slug}`,
    data: params
  })
}

// 删除文章
export const deleteArticle = (slug) => {
  return request({
    method: 'DELETE',
    url: `/api/articles/${slug}`
  })
}

// 添加点赞
export const addFavorite = (slug) => {
  return request({
    method: 'POST',
    url: `/api/articles/${slug}/favorite`
  })
}

// 删除点赞
export const deleteFavorite = (slug) => {
  return request({
    method: 'DELETE',
    url: `/api/articles/${slug}/favorite`
  })
}

// 获取文章评论
export const getComments = (slug) => {
  return request({
    method: 'GET',
    url: `/api/articles/${slug}/comments`
  })
}

// 发布评论
export const addComment = (slug, params) => {
  return request({
    method: 'POST',
    url: `/api/articles/${slug}/comments`,
    data: params
  })
}

