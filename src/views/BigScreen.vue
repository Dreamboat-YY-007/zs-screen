<script setup>
import { onMounted, watch } from 'vue'
// 导入封装的方法
import {
  useInitParkInfo,
  useInitBartChart,
  useInitPieChart,
} from './composition'

/**
 * 2D 图表 — 图表通用实现流程
 * 1、以 npm 方法把第三方图表库安装到本地项目中
 * 2、看官方的 DEMO 样式来实现一个简单的图表渲染
 *  2.1、引入 Echarts
 *  2.2、准备一个渲染的节点（宽高可用的 dom 节点）
 *  2.3、使用 init 进行图表的实例化
 *  2.4、按照业务的需求准备图表参数 （使用后端数据替换掉静态数据）
 *  2.5、调用图表的 setOption 方法传入参数完成图表的渲染
 * 重点：初始化操作都必须放到 mounted 生命周期钩子中去做
 *
 * 小坑：
 * 图表的渲染函数写到了 mounted 钩子里面，所以响应式数据哪怕已经发生变化了，
 * 但是图表只会在首次渲染的时候去读数据，这个时候读到什么是什么，
 * 并不会随着数据的变化而重新渲染
 * 【不带有自动渲染机制】
 *
 * 模版之所以可以用可选链解决问题：新数据返回之后，再次渲染
 * 模版本身会和响应式数据发生关联，一旦依赖的响应式数据发生变化
 * 整块模版会再次去读取数据使用新数据再次渲染
 * 【带有自动渲染机制】
 *
 * 基于逻辑的函数拆分 — 实现通用流程
 * 1、找到独立的业务逻辑（数据 + 操作数据的欣慰方法）
 * 2、定义一个以 useXXX 方法，在内部编写业务逻辑
 * 3、在 useXXX 函数的内部，把组件中将来需要用到的数据或者方法以对象的形式 return 出去
 * 4、在组件的 setup 函数中通过执行 userXXX 函数 + 解构赋值，重新拿到数据和方法给组件使用
 */

// 获取园区数据
const { parkInfo, getUserInfo } = useInitParkInfo()
// 渲染年度收入分析2d图表
const { initBarChart, barChart } = useInitBartChart(parkInfo)
// 渲染园区产业分布2d图表
const { initPieChart, pieChart } = useInitPieChart(parkInfo)

// 调度图表渲染
onMounted(async () => {
  // 1.3、保证图表依赖的数据已经完全返回，再做图表的初始化
  await getUserInfo()
  initBarChart()
  initPieChart()
})

// 2.5、侦听图表数据，当数据发生改变时，重新渲染图表数据
watch(
  () => {
    // 问题：deep 为 true，Vue 针对于传入的对象进行递归处理，如果要处理的对象非常大，会有性能问题
    // 解决办法：尽量少用 deep，只有在要监听的属性并不确定在哪一层，或者要监听的属性有很多个分布在不同的对象层次里
    // 明确知道要侦听哪个属性，可以把这个属性变成回调函数
    return parkInfo.value?.parkIncome
  },
  () => {
    initBarChart()
  }
  // { immediate: false, deep: true }
)
// 3.5、侦听图表数据，当数据发生改变时，重新渲染图表数据
watch(
  () => {
    return parkInfo.value?.parkIndustry
  },
  () => {
    initPieChart()
  }
)
</script>

<template>
  <div class="all-charts">
    <!-- 园区概况 -->
    <div class="section-one">
      <img
        class="img-header"
        src="https://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/smartPark/%E5%A4%A7%E5%B1%8F%E5%88%87%E5%9B%BE/%E5%9B%AD%E5%8C%BA%E6%A6%82%E5%86%B5%402x.png"
        alt=""
      />
      <div class="icons-container">
        <div class="item">
          <div class="icons-item building-icon">
            <span class="number">
              <!--
                为什么 parkInfo.base 是一个 undefined？
                原因：首次数据还没有回来的时候，完成了第一次渲染 出错了
                {}.base - undefined - undefined.buildingTotal
                解决：可选链：【?.】 - 必须保证?前面的东西不是 undefined 且不是 null 才会执行后面的点运算
               -->
              <!-- {{ parkInfo.base.buildingTotal }} -->
              {{ parkInfo.base?.buildingTotal }}
            </span>
          </div>
          <span class="title">楼宇总数</span>
          <span class="unity">（栋）</span>
        </div>
        <div class="item">
          <div class="icons-item enterprise-icon">
            <span class="number">
              {{ parkInfo.base?.enterpriseTotal }}
            </span>
          </div>
          <span class="title">入驻企业总数</span>
          <span class="unity">（家）</span>
        </div>
        <div class="item">
          <div class="icons-item car-icon">
            <span class="number">
              {{ parkInfo.base?.parkingTotal }}
            </span>
          </div>
          <span class="title">车位总数</span>
          <span class="unity">（个）</span>
        </div>
        <div class="item">
          <div class="icons-item rod-icon">
            <span class="number">
              {{ parkInfo.base?.chargePoleTotal }}
            </span>
          </div>
          <span class="title">一体杆总数</span>
          <span class="unity">（个）</span>
        </div>
      </div>
    </div>
    <!-- 园区年度收入分析 -->
    <div class="section-two">
      <img
        class="img-header"
        src="https://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/smartPark/%E5%A4%A7%E5%B1%8F%E5%88%87%E5%9B%BE/%E5%9B%AD%E5%8C%BA%E5%B9%B4%E5%BA%A6%E6%94%B6%E5%85%A5%E5%88%86%E6%9E%90%402x.png"
        alt=""
      />
      <div class="bar-chart-titile">
        <span>单位：元</span>
        <div>
          <span class="bar-icon blue-bar-icon"></span>
          <span class="bar-icon red-bar-icon"></span>
          收入情况
        </div>
      </div>
      <div class="bar-chart" ref="barChart"></div>
    </div>
    <!-- 园区产业分布 -->
    <div class="section-three">
      <img
        class="img-header"
        src="https://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/smartPark/%E5%A4%A7%E5%B1%8F%E5%88%87%E5%9B%BE/%E5%9B%AD%E5%8C%BA%E4%BA%A7%E4%B8%9A%E5%88%86%E5%B8%83%402x.png"
        alt=""
      />
      <div class="pie-chart" ref="pieChart"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.all-charts {
  position: absolute;
  top: 0;
  left: 0;
  width: 480px;
  height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(
    to left,
    rgba(0, 6, 15, 0) 0%,
    rgba(0, 6, 15, 0) 20%,
    rgba(0, 0, 0, 0.4) 30%,
    rgba(0, 0, 0, 0.6) 40%,
    rgba(1, 4, 11, 1) 70%,
    #04070d 100%
  );

  .img-header {
    height: 30px;
  }
}

.section-one {
  flex-basis: 25%;

  .icons-container {
    display: flex;
    justify-content: space-between;
    padding: 20px 0;

    .item {
      text-align: center;
      display: flex;
      flex-direction: column;
      flex: 1;

      .icons-item {
        height: 80px;
        position: relative;

        .number {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          font-size: 18px;
          font-family: FontquanXinYiGuanHeiTi, FontquanXinYiGuanHeiTi-Regular;
          color: #ffffff;
        }
      }

      .building-icon {
        background: url('@/assets/building-icon.png') no-repeat 50% 0 / contain;
      }

      .enterprise-icon {
        background: url('@/assets/enterprise-icon.png') no-repeat 50% 0 /
          contain;
      }

      .rod-icon {
        background: url('@/assets/rod-icon.png') no-repeat 50% 0 / contain;
      }

      .car-icon {
        background: url('@/assets/car-icon.png') no-repeat 50% 0 / contain;
      }

      .title,
      .unity {
        font-size: 14px;
        color: #cdd7e1;
      }

      .title {
        margin-top: 8px;
      }
    }
  }
}

.section-two {
  flex-basis: 35%;
  margin-top: 50px;

  .bar-chart {
    width: 100%;
    height: calc(100% - 90px);
  }
}

.section-three {
  flex-basis: 40%;

  .pie-chart {
    position: relative;
    margin: 0 auto;
    padding-bottom: 20px;
    width: 80%;
    height: calc(100% - 40px);
  }
}
</style>
