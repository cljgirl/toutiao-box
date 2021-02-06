<template>
  <div id="container" class="image-list">
    <div class="action-head">
      <el-radio-group v-model="collect" size="mini" @change="loadImages(1)">
        <el-radio-button :label="false">全部</el-radio-button>
        <el-radio-button :label="true">收藏</el-radio-button>
      </el-radio-group>
      <el-button
        size="mini"
        type="success"
        @click="dialogUploadVisible = true"
        v-if="isShowAdd"
      >上传素材</el-button>
    </div>
    <el-row :gutter="20" class="img-list-row">
      <el-col
        :xs="12"
        :sm="6"
        :md="6"
        :lg="6"
        @click.native="selected = index"
        v-for="(image, index) in images"
        :key="index"
        class="image-item"
      >
        <el-image style="height: 150px;" :src="image.url" fit="cover"></el-image>
        <div class="selected" v-if="isShowSelected && selected === index"></div>
        <div class="image-action" v-if="isShowAction">
          <el-button
            type="warning"
            :icon="image.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
            circle
            size="mini"
            :loading="image.loading"
            @click="onCollect(image)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            :loading="image.loading"
            @click="onDelete(image)"
          ></el-button>
        </div>
      </el-col>
    </el-row>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="imgTotal"
      :current-page.sync="page"
      @current-change="onCurrentChange"
      :page-size="perPage"
    ></el-pagination>
    <el-dialog title="上传素材" :visible.sync="dialogUploadVisible" :append-to-body="true">
      <el-upload
        v-if="dialogUploadVisible"
        class="upload-demo"
        drag
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :header="uploadHeaders"
        on-success="onUploadSuccess"
        multiple
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getImages, collectImage, deleteImage } from '@/api/image'
export default {
  name: 'imageList',
  components: {},
  // 使用对象的方式定义prop，更严谨，功能更丰富，强烈建议在项目中使用
  props: {
    // 是否显示添加素材
    isShowAdd: {
      type: Boolean, // 布尔值
      default: true // 默认值
    },
    // 是否显示图片下方的操作
    isShowAction: {
      type: Boolean, // 布尔值
      default: true // 默认值
    },
    // 是否显示图片被选中
    isShowSelected: {
      type: Boolean,
      default: false
    }
  },
  // 使用数组声明prop. 不建议，不够严谨，而且功能也不够强大,仅适合demo演示
  // props: ['dadada']

  data () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      collect: false,
      images: [],
      dialogUploadVisible: false,
      uploadHeaders: {
        // `Bearer ${user.token}`
        Authorization: `Bearer ${user.token}`
      },
      imgTotal: null,
      perPage: 18,
      page: 1,
      selected: null // 选中索引
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadImages(1)
  },
  mounted () { },
  methods: {
    loadImages (page = 1) {
      // 重置高亮页码，防止数据与页码不对应
      this.page = page
      getImages({ collect: this.collect, page, per_page: this.perPage }).then(res => {
        const results = res.data.data.results
        results.forEach(image => {
          // img 对象本来没有loading属性
          // 我们这里收到的往里面添加该数据来控制每个收藏按钮的loading状态
          image.loading = false
        })
        this.images = results
        this.imgTotal = res.data.data.total_count

        console.log(res)
      })
    },
    // onCollectChange (collect) {

    // },
    onUploadSuccess () {
      // 关闭对话框
      this.dialogUploadVisible = false
      // 更新素材列表
      this.loadImages(false)
    },
    onCurrentChange (page) {
      this.loadImages(page)
    },
    onCollect (image) {
      // 展示 loading
      image.loading = true
      console.log(this.loading)
      collectImage(image.id, !image.is_collected).then(res => {
        this.$message({
          message: `${image.is_collected ? '收藏' : '取消收藏'}成功`,
          type: 'success'
        })
        image.is_collected = !image.is_collected
        // 关闭loading
        image.loading = false
      })
    },
    onDelete (image) {
      image.loading = true
      deleteImage(image.id).then(res => {
        this.$message({
          message: '删除成功',
          type: 'error'
        })
        this.loadImages(this.page)
        image.loading = false
      })
    }
  }
}
</script>

<style scoped lang="less">
.action-head {
  padding-bottom: 20px;
  display: flex;
  justify-content: space-between;
}
.img-list-row {
  margin-bottom: 20px;
}
.image-item {
  position: relative;
  margin-bottom: 10px;
}
.image-action {
  height: 35px;
  background: rgba(0, 0, 0, 0.3);
  position: absolute;
  left: 9px;
  right: 10px;
  bottom: 3px;
  text-align: center;
  justify-content: space-around;
  display: flex;
  align-items: center;
}
.selected {
  background: url(./selected.png) no-repeat 50% 50%;
  height: 100%;
  background-size: cover;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
