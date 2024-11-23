// 专门用来操作cookie的方法包
// 内部封装了繁琐的操作方法 参数处理 暴露三个函数 get,set,remove
import Cookies from 'js-cookie'
// import { TOKEN_KEY } from '@/constants/KEY'

// 和主应用的存入 cookis 时的 key 保持一致，才能在子应用匹配上获取到
const TOKEN_KEY = 'token_key'

// 获取token的方法
export function getToken() {
  return Cookies.get(TOKEN_KEY)
}

// 设置方法
export function setToken(token) {
  return Cookies.set(TOKEN_KEY, token)
}

// 删除方法
export function removeToken() {
  return Cookies.remove(TOKEN_KEY)
}
