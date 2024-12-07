import { ref } from 'vue'
import * as echarts from 'echarts'

function useInitPieChart(parkInfo) {
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
  return {
    initPieChart,
    pieChart,
  }
}
export { useInitPieChart }
