import { followUser, unfollowUser } from '@/api/user'

// 默认头像地址
export const defaultAvatar =
'https://static.productionready.io/images/smiley-cyrus.jpg'

// 设置默认头像（如果用户头像图片地址为空）
export const setDefaultAvatar = (user) => {
  user.image = defaultAvatar
}

export const verifyAvatar = (user) => {
  const imageSrcPattern = /^http.*(jpg|svg|png|gif)$/
  if (user && (!user.image || !imageSrcPattern.test(user.image))) {
    setDefaultAvatar(user)
  }
}

export const onFollow = async (user) => {
  // 不允许在api请求结束前重复点击
  user.followDisabled = true

  if (user.following) {
    await unfollowUser(user.username)
    user.following = false
  } else {
    await followUser(user.username)
    user.following = true
  }

  user.followDisabled = false
}
