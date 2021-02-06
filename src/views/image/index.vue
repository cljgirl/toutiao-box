<template>
  <div class="images-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 图片列表 -->
      <image-list />
      <!-- /图片列表 -->
    </el-card>
  </div>
</template>

<script>
import ImageList from './components/image-list'
export default {
  name: 'ImageIndex',
  components: { ImageList },
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {}
}
</script>

<style scoped lang="less">
</style>
