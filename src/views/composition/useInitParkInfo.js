import { ref } from 'vue'
import { getParkInfoAPI } from '@/api/index'

function useInitParkInfo() {
  // 放置所有的业务逻辑代码

  // 1、获取园区概况数据
  const parkInfo = ref({})

  const getUserInfo = async () => {
    // 1.1、调用接口
    const res = await getParkInfoAPI()
    // 1.2、覆盖响应式数据
    parkInfo.value = res.data
  }

  // 以对象的方式，把组件中要用到的数据和方法 return 出去
  return {
    // 在组件中还需要用到这些数据和方法
    // 在组件中通过调用 useInitParkInfo 这个函数，得到这个对象
    // 然后通过解构赋值的方式再把数据和方法引入到组件中使用
    parkInfo,
    getUserInfo,
  }
}
// 导出
export { useInitParkInfo }
