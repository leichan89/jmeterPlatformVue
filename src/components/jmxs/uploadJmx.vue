<template>
  <div>
    <!-- button前面要用div包起来，不然会报错 -->
    <el-button type="primary" @click="initForm">上传</el-button>
    <!-- 上传文件对话框 -->
    <el-dialog title="上传JMX文件" :visible.sync="uploadFormVisible" width="30%">
      <el-form ref="uploadFormRef" :model="uploadForm" :rules="uploadFormRules" label-width="80px" class="demo-ruleForm">
        <el-form-item label="文件名称" prop="jmxName">
          <el-input v-model="uploadForm.jmxName" size="small" placeholder="请输入jmx文件别名" style="width:100%"/>
        </el-form-item>
        <!-- action必填，不然会告警 -->
        <el-form-item label="选择文件" prop="fileList">
          <el-upload
            class="upload-demo"
            ref="upload"
            action=""
            :file-list="uploadForm.fileList"
            :with-credentials="true"
            :limit="5"
            :auto-upload="false"
            :http-request="uploadSectionFile"
          >
            <el-button size="small" type="primary">点击选择</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="uploadFormVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

export default {
  data () {
    return {
      // 上传对话框的可视化参数
      uploadFormVisible: false,
      uploadForm: {
        // 上传的jmx文件的别名
        jmxName: '',
        // 记录上传文件信息的列表，主要包含文件路径，名称，大小等信息
        fileList: []
      },
      // 校验必填参数，上传fileList校验添加后会报错，最好不添加
      uploadFormRules: {
        jmxName: [
          { required: true, message: '请输入jmx文件别名', trigger: 'blur' },
          { min: 3, max: 500, message: '长度在 3 到 500 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 上传对话框初始化操作，需要清除输入框和上传列表数据
    initForm() {
      this.uploadFormVisible = true
      setTimeout(() => {
        // 重置必须又有ref,绑定form,需要重置的字段需要有prop属性
        this.$refs.uploadFormRef.resetFields()
      })
    },
    // 上传文件，使用form-data上传，需要自己获取到文件流
    async uploadSectionFile(param) {
      // 获取文件流
      const fo = param.file
      const form = new FormData()
      form.append('jmx', fo)
      form.append('jmxName', this.uploadForm.jmxName)
      form.append('addUser', window.sessionStorage.getItem('userId'))
      const config = { headers: { 'Content-Type': 'multipart/form-data' } }
      const { data: res } = await this.$http.post('/jmxs/upload', form, config)
      if (res.code !== 200) {
        return this.$message.error('上传失败')
      }
      this.$emit('fatherFunc')
      return this.$message.success('上传成功')
    },
    // 上传文件的提交操作，先上传，再关闭对话框
    submitForm() {
      this.$refs.uploadFormRef.validate(valid => {
        if (!valid) return
        this.$refs.upload.submit()
        this.uploadFormVisible = false
      })
    }
  }
}
</script>
