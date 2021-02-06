<template>
  <div class="upload-cover" @click="showCoverSelect">
    <div class="cover-wrap">
      <img class="cover-img" ref="cover-image" :src="value" alt />
    </div>
    <el-dialog title="选择封面" :visible.sync="dialogVisible" width="50%" append-to-body>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="first">
          <image-list
            :is-show-add="false"
            :is-show-action="false"
            :isShowSelected="true"
            ref="image-list"
          />
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="second">
          <input type="file" @change="onFileChange" ref="file" />
          <img src alt width="100" ref="preview-img" style="background-size:cover" />
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onCoverConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { uploadImage } from '@/api/image'
import ImageList from '@/views/image/components/image-list'
export default {
  name: 'uploadCover',
  components: { ImageList },
  props: ['value'],
  data () {
    return {
      dialogVisible: false,
      activeName: 'second'
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    showCoverSelect () {
      // 展示显示封面的弹框
      this.dialogVisible = true
    },
    onFileChange () {
      // 获取文件对象
      const file = this.$refs.file.files[0]

      // 图片预览
      const blob = window.URL.createObjectURL(file)
      this.$refs['preview-img'].src = blob
      // 防止用户选择同一文件不触发change事件
      // this.$refs.file.files[0] = ''
    },
    onCoverConfirm () {
      // 如果tab是上传图片，并且input-file
      // 有选择的文件，才执行上传图片的操作
      if (this.activeName === 'second') {
        const file = this.$refs.file.files[0]
        if (!file) {
          this.$message('请选择文件')
          return
        }
        // 执行上传文件的操作
        const fd = new FormData()
        fd.append('image', file)
        uploadImage(fd).then(res => {
          // 关闭弹出层
          this.dialogVisible = false
          // 展示上传的图片
          // this.$refs['cover-image'].src = res.data.data.url

          // 将图片地址发送给父组件
          this.$emit('input', res.data.data.url)
        })
      } else if (this.activeName === 'first') {
        // 还有一种组件通信方式：父组件可以直接访问子组件中的数据
        const imageList = this.$refs['image-list']
        const selected = imageList.selected
        if (selected === null) {
          this.$message('请选择封面图片')
          return
        }
        // 关闭对话框
        this.dialogVisible = false
        // 修改父组件绑定的数据
        this.$emit('input', imageList.images[selected].url)
      }
    }
  }
}
</script>

<style scoped lang="less">
.cover-wrap {
  width: 150px;
  height: 120px;
  border: 1px solid #000;
  .cover-img {
    height: 120px;
    min-width: 100%;
    background-size: cover;
  }
}
</style>
