
// 去除有各种零宽空白和其他非法字符的tag
export const prepareTagArray = (tags) => {
  return tags.filter(tag => 
    {
      const pattern = /^\w+$/
      return !!tag && pattern.test(tag)
    }
  )
}