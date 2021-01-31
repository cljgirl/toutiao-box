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
                autofocus="true"
              >+关注</el-button>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="粉丝画像" name="second">粉丝画像</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getFans } from '@/api/article'

export default {
  name: 'fansIndex',
  components: {},
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
  mounted () { },
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
.fans_list {
  margin: 0px 0px 20px 0px !important;
  .fans_item {
    border: 1px dashed #ddd;
    text-align: center;
    padding: 10px 0;
    display: inline-block;
    margin-bottom: 15px;
  }
}
// .el-button--primary:focus,
// .el-button--primary:hover {
//   color: #409eff;
//   background: none;
//   border-color: none;
// }
// .el-button:focus,
// .el-button:hover {
//   color: #409eff;
//   border-color: none;
//   background-color: none;
// }
.el-button.is-plain:focus,
.el-button.is-plain:hover {
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
}
</style>
