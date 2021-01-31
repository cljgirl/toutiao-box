<template>
  <div class="comment-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!--
        1、把数据列表绑定到表格的data中
        2、设计表格
        3、给表格列绑定要渲染的值
      -->
      <el-table :data="articles" style="width: 100%" stripe border class="table-list">
        <el-table-column prop="title" label="标题" width="180"></el-table-column>
        <el-table-column prop="total_comment_count" label="总评论数" width="180"></el-table-column>
        <el-table-column prop="fans_comment_count" label="粉丝评论数"></el-table-column>
        <el-table-column prop="address" label="状态">
          <template slot-scope="scope">{{ scope.row.comment_status ? '正常' : '关闭'}}</template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.comment_status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="onStatusChange(scope.row)"
              :disabled="scope.row.statusDisabled"
            ></el-switch>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getArticles, updateCommentStatus } from '@/api/article'

export default {
  name: 'commentIndex',
  components: {},
  props: {},
  data () {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      currentPage4: 4,
      articles: [],
      totalCount: 0,
      pageSize: 10, // 每页文章数
      page: 1 // 当前激活页码
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticles()
  },
  mounted () { },
  methods: {
    handleSizeChange () {
      // 每页加载文章数发生改变，重新发送请求
      this.loadArticles(1)
    },
    handleCurrentChange (page) {
      // 让分页组件激活的页码和请求数据的页码保持一致
      this.loadArticles(page)
    },
    loadArticles (page = 1) {
      getArticles({
        response_type: 'comment',
        page,
        per_page: this.pageSize
      }).then(res => {
        const results = res.data.data.results
        results.forEach(article => {
          article.statusDisabled = false
        })
        this.articles = results
        this.totalCount = res.data.data.total_count
      })
    },
    onStatusChange (article) {
      // 禁用开关
      article.statusDisabled = true

      // 提交请求修改
      updateCommentStatus(article.id.toString(), article.comment_status).then(res => {
        // 启用开关
        article.statusDisabled = false
        this.$message({
          type: 'success',
          message: article.comment_status ? '开启文章评论状态' : '关闭文章评论状态'
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.table-list {
  margin-bottom: 30px;
}
</style>
