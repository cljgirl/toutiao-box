<template>
  <div class="settings-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-row>
        <el-col :span="15">
          <el-form ref="form" :model="user" label-width="80px">
            <el-form-item label="编号">{{user.id}}</el-form-item>
            <el-form-item label="手机号">{{user.mobile}}</el-form-item>
            <el-form-item label="媒体名称">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍">
              <el-input type="textarea" v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onUpdateUser">保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <!-- offset 栅格左侧的间隔格数 偏移  span 栅格占据的列数-->
        <el-col :offset="2" :span="6">
          <el-avatar shape="square" :size="150" fit="cover" :src="user.photo"></el-avatar>
          <p @click="$refs.file.click()" style="cursor: pointer">点击修改头像</p>
          <input type="file" hidden ref="file" @change="onFileChange" />
        </el-col>
      </el-row>
    </el-card>

    <el-dialog
      title="修改头像"
      :visible.sync="dialogVisible"
      append-to-body
      @opened="onDialogOpened"
      @closed="onDialogClosed"
    >
      <div class="preview-image-wrap">
        <img :src="previewImage" class="preview-image" ref="preview-image" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onUpdatePhoto" :loading="updatePhotoLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserProfile, updateUserPhoto, updateUserProfile } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import globalBus from '@/utils/global-bus'

export default {
  name: 'settingsIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        id: null,
        email: '',
        intro: '',
        mobile: '',
        name: '',
        photo: ''
      },
      dialogVisible: false,
      previewImage: '', // 预览图片
      cropper: null, // 裁切器示例
      updatePhotoLoading: false, // 更新用户头像 loading 状态
      updateProfileLoading: false // 修改用户信息 loading 状态
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUser()
  },
  mounted () { },
  methods: {
    loadUser () {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },
    onUpdateUser () {
      // 表单验证
      // 验证通过，提交表单

      // 开启 loading 状态
      this.updateProfileLoading = true
      const { name, intro, email } = this.user
      updateUserProfile({ name, intro, email }).then(res => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
      })
      // 关闭 loading 状态
      this.updateProfileLoading = false

      // 更新头部当前登录用户的信息
      // 发布通知，用户信息已修改
      globalBus.$emit('update-user', this.user)
    },
    onFileChange () {
      // 处于图片预览
      const file = this.$refs.file

      const blobData = window.URL.createObjectURL(file.files[0])
      console.log(file.files[0])
      console.log(blobData)
      this.previewImage = blobData
      // 展示弹出层，预览用户选择的图片
      this.dialogVisible = true

      // 解决选中相同文件不触发 change 事件问题
      this.$refs.file.value = ''
    },
    onDialogOpened () {
      // 图片裁切器必须基于 img 进行初始化
      // 注意：img 必须是可见状态才能正常完成初始化
      // 因为我们这里要在对话框里面初始化裁切器
      // 所以务必要在对话框完全打开的状态去进行初始化

      // 获取图片 DOM 节点
      const image = this.$refs['preview-image']
      // 第一次初始化好以后，如果预览裁切器的图片发生了变化
      // 裁切器默认不会更新
      // 如果需要预览图片发生变化更新裁切器
      //  方式一：裁切器.replace 方法
      //  方式二：销毁裁切器，重新初始化

      // 初始化裁切器
      if (this.cropper) {
        this.cropper.replace(this.previewImage)
        return
      }
      this.cropper = new Cropper(image, {

        // aspectRatio: 16 / 9,  // 定义裁剪框的固定长宽比。默认情况下，裁剪框为自由比例
        viewMode: 1, // 定义裁纸器的查看模式。如果设置viewMode到0，裁剪框可以画布外的延伸，1：限制裁切框不要超过画布的大小。
        dragMode: 'none', // 定义裁纸器的拖动模式。'crop'：创建一个新的裁剪框, 'move'：移动画布, 'none'： 没做什么
        aspectRatio: 1, // 定义裁剪框的固定长宽比。默认情况下，裁剪框为自由比例。
        cropBoxResizable: false, // 启用以通过拖动来调整裁剪框的大小。
        crop (event) {
          console.log(event.detail.x)
          console.log(event.detail.y)
          console.log(event.detail.width)
          console.log(event.detail.height)
          console.log(event.detail.rotate)
          console.log(event.detail.scaleX)
          console.log(event.detail.scaleY)
        }
      })
    },
    onDialogClosed () {
      // 对话框关闭， 销毁裁切器
      this.cropper.destroy()
    },
    onUpdatePhoto () {
      // 让确定按钮开始 loading
      this.updatePhotoLoading = true
      // 获取裁切的图片对象
      this.cropper.getCroppedCanvas().toBlob(file => {
        const fd = new FormData()
        fd.append('photo', file)
        // 请求更新用户头像请求提交
        updateUserPhoto(fd).then(res => {
          // 关闭对话框
          this.dialogVisible = false
          // 更新视图展示
          // 直接把裁切结果的文件对象转换为 blob 数据本地预览
          this.user.photo = window.URL.createObjectURL(file)
          // 关闭确定按钮的 loading
          this.updatePhotoLoading = false

          this.$message({
            type: 'success',
            message: '更新头像成功'
          })

          // 更新头部当前登录用户的头像信息
          // 发布通知，用户头像已修改
          globalBus.$emit('update-user', this.user)
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.preview-image-wrap {
  .preview-image {
    /* 确保图像尺寸完全适合容器 */
    display: block;
    /* 此规则非常重要，请不要忽略此 */
    max-width: 100%;
    height: 200px;
  }
}
</style>
