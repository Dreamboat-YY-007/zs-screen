<script setup>
import { onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import { getParkInfoAPI } from '@/api/index'

// 1、获取园区概况数据
const parkInfo = ref({})
const getUserInfo = async () => {
  // 1.1、调用接口
  const res = await getParkInfoAPI()
  // 1.2、覆盖响应式数据
  parkInfo.value = res.data
}

// 2、渲染年度收入
/**
 * Echarts 实现流程
 * 2.1、准备一个要渲染的位置 div
 * 2.2、实例化
 * 2.3、准备配置项参数
 * 2.4、实例 setOption(参数)
 */

// 2.1、获取要渲染的节点位置
const barChart = ref(null)
let myChart = null // 判断图表是否已存在
// 2.2、初始化图表实例（前置要求：必须 dom 是可用状态，barChart 必须已经成功拿到了 dom 元素才可以 — mounted 中做初始化）
function initBarChart() {
  // 渲染年度收入分析图表
  // 2.2.1、解构图表数据
  const { parkIncome } = parkInfo.value
  // 2.3. 准备options数据
  const barOptions = {
    tooltip: {
      // 图表样式
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      // 让图表占满容器
      top: '10px',
      left: '0px',
      right: '0px',
      bottom: '0px',
      containLabel: true,
    },
    xAxis: [
      // X轴数据
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true,
          show: false,
        },
        data: parkIncome.xMonth,
      },
    ],
    yAxis: [
      // Y轴数据
      {
        type: 'value',
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: '园区年度收入',
        type: 'bar',
        barWidth: '10px',
        data: parkIncome.yIncome.map((item, index) => {
          // 奇偶行颜色不一样
          const color =
            index % 2 === 0
              ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0.23, color: '#74c0f8' },
                  { offset: 1, color: 'rgba(116,192,248,0.00)' },
                ])
              : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0.23, color: '#ff7152' },
                  { offset: 1, color: 'rgba(255,113,82,0.00)' },
                ])
          return { value: item, itemStyle: { color } }
        }),
      },
    ],
    textStyle: {
      color: '#B4C0CC',
    },
  }
  // 2.4、渲染图表
  if (myChart) {
    // 2.4.1、如果图表已经存在，则直接更新数据
    barOptions && myChart.setOption(barOptions) // 短路与，前面为 true 才继续往后执行
  } else {
    // 2.4.2、如果图表不存在，则实例化它
    myChart = echarts.init(barChart.value)
    barOptions && myChart.setOption(barOptions)
  }
}

// 3、渲染园区产业分布
// 3.1、获取要渲染的节点位置
const pieChart = ref(null)
let myPieChart = null
// 3.2、渲染园林产业分布图表
const initPieChart = () => {
  // 3.2.1、解构图表数据
  const { parkIndustry } = parkInfo.value
  // 3.3、准备 options 数据
  const pieOption = {
    color: ['#00B2FF', '#2CF2FF', '#892CFF', '#FF624D', '#FFCF54', '#86ECA2'],
    legend: {
      itemGap: 20,
      bottom: '0',
      icon: 'rect',
      itemHeight: 10, // 图例icon高度
      itemWidth: 10, // 图例icon宽度
      textStyle: {
        color: '#c6d1db',
      },
    },
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        name: '园区产业分析',
        type: 'pie',
        radius: ['55%', '60%'], // 设置内圈与外圈的半径使其呈现为环形
        center: ['50%', '40%'], // 圆心位置， 用于调整整个图的位置
        tooltip: {
          trigger: 'item',
          formatter: params => {
            return `${params.seriesName}</br><div style='display:flex;justify-content: space-between;'><div>${params.marker}${params.name}</div><div>${params.percent}%</div></div>`
          },
        },
        label: {
          show: false,
          position: 'center',
        },
        data: parkIndustry,
      },
    ],
  }
  // 3.4、实例化并渲染图表
  if (myPieChart) {
    // 3.4.1、如果图表已经存在，则直接更新数据
    pieOption && myPieChart.setOption(pieOption)
  } else {
    // 3.4.2、如果图表不存在，则实例化它
    myPieChart = echarts.init(pieChart.value)
    pieOption && myPieChart.setOption(pieOption)
  }
}

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
