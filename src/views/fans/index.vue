<template>
  <div class="fans-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>粉丝管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="粉丝列表" name="first">
          <el-row :gutter="25" class="fans_list">
            <el-col
              :xs="12"
              :sm="6"
              :md="4"
              :lg="3"
              v-for="(fan, index) in fans"
              :key="index"
              class="fans_item"
            >
              <el-avatar
                :size="60"
                src="fan.photo"
                @error="errorHandler"
                style="width: 80px; height: 80px;"
              >
                <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
              </el-avatar>
              <p>{{fan.name}}</p>
              <el-button
                type="primary"
                :plain="fansPlain"
                size="mini"
                @click="fansPlain = !fansPlain"
              >+关注</el-button>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="粉丝画像" name="second">
          <!-- 1.为 ECharts 准备一个具备大小（宽高）的 DOM -->
          <div id="main" ref="main" style="width: 600px;height:400px;"></div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <map-demo />
    <bmap-demo />
  </div>
</template>

<script>
// 2. 加载 echarts
import echarts from 'echarts'
import MapDemo from './components/map-demo'
import BmapDemo from './components/bmap-demo'
import { getFans } from '@/api/article'

export default {
  name: 'FansIndex',
  components: {
    MapDemo, // 百度地图结合 echarts
    BmapDemo
  },
  props: {},
  data () {
    return {
      activeName: 'first',
      fans: [],
      fansPlain: true
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadGetFans()
  },
  // 注意：初始化操作 DOM 一定要写到 mounted 钩子函数中
  mounted () {
    // 3. 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(this.$refs.main)

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
        data: ['销量']
      },
      xAxis: {
        data: ['衬衫123', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    }

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  },
  methods: {
    loadGetFans () {
      getFans().then(res => {
        this.fans = res.data.data.results
      })
    },
    handleClick (tab, event) {
      console.log(tab, event)
    },
    errorHandler () {
      return true
    }
  }
}
</script>

<style scoped lang="less">
.box-card {
  margin-bottom: 30px;
}
</style>
