import { ref } from 'vue'
import * as echarts from 'echarts'

function useInitBartChart(parkInfo) {
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
  return {
    initBarChart,
    barChart,
  }
}
export { useInitBartChart }
