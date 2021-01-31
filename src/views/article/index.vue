<template>
  <div class="article-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑路径导航 -->
      </div>
      <!-- 数据筛选表单 -->
      <el-form ref="form" :model="form" label-width="40px" size="mini">
        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <!--  -->
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channelId" placeholder="请选择频道">
            <el-option label="全部" :value="null"></el-option>
            <el-option
              :label="channel.name"
              :value="channel.id"
              v-for="(channel ,index) in channels"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="rangeDate"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
            format="yyyy-MM-DD"
            value-format="yyyy-MM-DD"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadArticles(1)">确定</el-button>
        </el-form-item>
      </el-form>
      <!-- /数据筛选表单 -->
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        根据筛选条件查询到 {{totalCount}} 条结果：
        <!-- /面包屑路径导航 -->
      </div>
      <!-- 数据列表 -->
      <!--
        Table 表格组件
        1、把需要展示的数组列表数据绑定给 table 组件的 data 属性
        注意：你不用去 v-for 遍历，它自己会遍历
        2、设计表格列 el-table-column
        width 可以设定表格列的宽度
        label 可以设置列的标题
        prop 用来指定要渲染的列表项数据字段，只能展示文本
        3.表格列默认只能渲染普通文本，如果需要展示其他内容，
        // 例如放个按钮，放个图片，那就需要自定义表格列模板了:https://element.eleme.cn/#/zh-CN/component/table#zi-ding-yi-lie-mo-ban
      -->
      <el-table
        :data="articles"
        style="width: 100%"
        stripe
        border
        class="list-table"
        size="mini"
        v-loading="loading"
        element-loading-text="拼命加载中"
      >
        <el-table-column label="封面">
          <template slot-scope="scope">
            <el-image :src="scope.row.cover.images[0]" class="cover-img load-img">
              <div slot="placeholder" class="image-slot">
                加载中
                <span class="dot">...</span>
              </div>
              <div slot="error" class="image-slot">
                <img class="cover-img" src="./no-cover.gif" />
              </div>
            </el-image>
            <!-- <img
              class="cover-img"
              v-if="scope.row.cover.images[0]"
              :src="scope.row.cover.images[0]"
            />
            <img class="cover-img" v-else src="./no-cover.gif" />-->
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column label="状态">
          <!-- 如果需要自定义列模板中获取当前变量项数据，那么就在 template 上声明
          slot-scope="scope"-->
          <template slot-scope="scope">
            <el-tag
              :type="articleStatus[scope.row.status].type"
            >{{ articleStatus[scope.row.status].text }}</el-tag>
            <!-- <el-tag type="warning" v-if="scope.row.status === 0">草稿</el-tag>
            <el-tag v-if="scope.row.status === 1">待审核</el-tag>
            <el-tag type="success" v-if="scope.row.status === 2">审核通过</el-tag>
            <el-tag type="danger" v-if="scope.row.status === 3">审核失败</el-tag>
            <el-tag type="info" v-if="scope.row.status === 4">已删除</el-tag>-->
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"></el-table-column>
        <el-table-column label="操作">
          <!-- 如果自定义表格列模板，则把需要自定义的内容放到 template 里面-->
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              circle
              @click="$router.push('/publish?id=' + scope.row.id.toString())"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="onDeleteArticle(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- /数据列表 -->

      <!-- 列表分页 -->
      <!--
        total 用来设定总数据的条数
        它默认按照10条每页计算总页码
        page-size每页显示条目个数，支持.sync修饰符
      -->
      <el-pagination
        background
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="totalCount"
        :disabled="loading"
        :current-page.sync="page"
        @current-change="onCurrentChange"
      ></el-pagination>
      <!-- /列表分页 -->
    </el-card>
  </div>
</template>

<script>
import {
  getArticles,
  getArticleChannels,
  deleteArticle
} from '@/api/article'

export default {
  name: 'articleIndex',
  components: {},
  props: {},
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      articles: [], // 文章数据列表
      articleStatus: [
        { status: 0, text: '草稿', type: 'warning' },
        { status: 1, text: '带审核', type: '' },
        { status: 2, text: '审核通过', type: 'success' },
        { status: 3, text: '审核失败', type: 'danger' },
        { status: 4, text: '已删除', type: 'info' }
      ],
      pageSize: 10, // 每页大小
      totalCount: 0, // 总数据条数
      status: null, // 查询文章状态，不传就是全部
      channels: [], // 文章频道列表
      channelId: null, // 查询文章的频道
      rangeDate: null, // 筛选的范围日期
      loading: true, // 表单数据加载中的loading
      page: 1 // 当前页码
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticles(1)
    this.loadChannels()
  },
  mounted () { },
  methods: {
    loadArticles (page = 1) {
      // 展示加载中 loading
      this.loading = true
      getArticles({
        page,
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null,
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null
      }).then(res => {
        const { results, total_count: totalCount } = res.data.data
        this.articles = results
        this.totalCount = totalCount

        // 关闭加载中的loading
        this.loading = false
      })
    },
    onCurrentChange (page) {
      this.loadArticles(page)
    },
    loadChannels () {
      getArticleChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },
    onDeleteArticle (articleId) {
      // 找到数据接口
      // 封装请求方法
      // 删除请求调用
      // 处理响应结果
      this.$confirm('确认删除吗？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确认执行这里
        console.log(articleId.toString())
        deleteArticle(articleId.toString()).then(res => {
          // 删除成功，更新文章数据列表
          this.loadArticles(this.page)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.filter-card {
  margin-bottom: 30px;
}
.list-table {
  margin-bottom: 20px;
}
.cover-img {
  width: 150px;
  background-size: cover;
}
.load-img {
  text-align: center;
}
</style>
