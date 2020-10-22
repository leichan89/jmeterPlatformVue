<template>
  <div>
    <!-- button前面要用div包起来，不然会报错 -->
    <el-button type="primary" @click="initForm" size="small">添加CSV</el-button>
    <!-- 上传文件对话框 -->
    <el-dialog title="上传CSV" :visible.sync="uploadFormVisible" width="25%">
      <el-form ref="uploadFormRef" :model="uploadForm" :rules="uploadFormRules" label-width="80px" class="demo-ruleForm">
        <el-form-item label="线程类型">
          <el-select v-model="uploadForm.threadType" size="small" style="width:180px">
            <el-option
              v-for="item in threadTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="变量名称" prop="variableNames">
          <el-input v-model="uploadForm.variableNames" size="small" placeholder="多个变量以英文逗号隔开" style="width:180px"/>
        </el-form-item>
        <el-form-item label="分隔符号" prop="delimiter">
          <el-input v-model="uploadForm.delimiter" size="small" placeholder="请输入分隔符" style="width:180px"/>
        </el-form-item>
        <el-form-item label="其他设置">
          <div>
            <el-checkbox v-model="uploadForm.ignoreFirstLine" size="small" label="忽略首行" border/>
          </div>
          <div>
            <el-checkbox v-model="uploadForm.recycle" size="small" label="遇到文件结束符再次循环" border/>
          </div>
          <div>
            <el-checkbox v-model="uploadForm.stopThread" size="small" label="遇到文件结束符停止线程" border/>
          </div>
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
      threadTypeOptions: [
        {
          value: 'setup',
          label: 'setup线程组'
        },
        {
          value: 'thread',
          label: 'thread线程组'
        },
        {
          value: 'teardown',
          label: 'teardown线程组'
        }
      ],
      uploadForm: {
        // 线程组类型
        threadType: 'thread',
        // 变量名称
        variableNames: '',
        // 是否忽略首行
        ignoreFirstLine: false,
        delimiter: ',',
        recycle: false,
        stopThread: false,
        // 记录上传文件信息的列表，主要包含文件路径，名称，大小等信息，写到这里才会清空之前上传的文件信息
        fileList: []
      },
      // 校验必填参数，上传fileList校验添加后会报错，最好不添加
      uploadFormRules: {
        variableNames: [
          { required: true, message: '请输入CSV文件别名', trigger: 'blur' }
        ],
        delimiter: [
          { required: true, message: '请输入分割符号', trigger: 'blur' }
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
        this.uploadForm.ignoreFirstLine = false
        this.uploadForm.recycle = false
        this.uploadForm.stopThread = false
      })
    },
    // 上传文件，使用form-data上传，需要自己获取到文件流
    async uploadSectionFile(param) {
      // 获取文件流
      const fo = param.file
      const form = new FormData()
      for (const key in this.uploadForm) {
        if (key !== 'fileList') {
          form.append(key, this.uploadForm[key])
        }
      }
      form.append('csv', fo)
      form.append('userId', window.sessionStorage.getItem('userId'))
      form.append('jmxId', window.sessionStorage.getItem('jmxId'))
      const config = { headers: { 'Content-Type': 'multipart/form-data' } }
      const { data: res } = await this.$http.post('jmxs/uploadcsv', form, config)
      if (res.code !== 200) {
        return this.$message.error('上传失败')
      }
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
