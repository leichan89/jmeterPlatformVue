<template>
  <span style="margin-left: 10px;margin-right: 10px">
    <!-- button前面要用div包起来，不然会报错 -->
    <el-button type="primary" @click="initForm" size="small" class="myicon" icon="el-icon-edit" circle></el-button>
    <!-- 上传文件对话框 -->
    <el-dialog title="修改CSV信息" :visible.sync="modifyCsvFormVisible" width="25%">
      <el-form ref="modifyCsvFormRef" :model="modifyCsvForm" :rules="modifyCsvFormRules" label-width="80px" class="demo-ruleForm">
        <el-form-item label="CSV名称" prop="name">
          <el-input v-model="modifyCsvForm.name" size="small" placeholder="CSV名称" style="width:100%"/>
        </el-form-item>
        <el-form-item label="变量名称" prop="variableNames">
          <el-input v-model="modifyCsvForm.variableNames" size="small" placeholder="多个变量以英文逗号隔开" style="width:100%"/>
        </el-form-item>
        <el-form-item label="分隔符号" prop="delimiter">
          <el-input v-model="modifyCsvForm.delimiter" size="small" placeholder="请输入分隔符" style="width:100%"/>
        </el-form-item>
        <el-form-item label="其他设置">
          <div>
            <el-checkbox v-model="modifyCsvForm.ignoreFirstLine" size="small" label="忽略首行" border/>
          </div>
          <div>
            <el-checkbox v-model="modifyCsvForm.recycle" size="small" label="遇到文件结束符再次循环" border/>
          </div>
          <div>
            <el-checkbox v-model="modifyCsvForm.stopThread" size="small" label="遇到文件结束符停止线程" border/>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="modifyCsvFormVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </span>
</template>
<script>

export default {
  data () {
    return {
      // 上传对话框的可视化参数
      modifyCsvFormVisible: false,
      modifyCsvForm: {
        childId: '',
        name: '',
        // 变量名称
        variableNames: '',
        // 是否忽略首行
        ignoreFirstLine: false,
        delimiter: ',',
        recycle: false,
        stopThread: false
      },
      // 校验必填参数，上传fileList校验添加后会报错，最好不添加
      modifyCsvFormRules: {
        name: [
          { required: true, message: '请输入CSV名称', trigger: 'blur' }
        ],
        variableNames: [
          { required: true, message: '请输入变量名称', trigger: 'blur' }
        ],
        delimiter: [
          { required: true, message: '请输入分割符号', trigger: 'blur' }
        ]
      }
    }
  },
  props: ['csvId'],
  methods: {
    // 上传对话框初始化操作，需要清除输入框和上传列表数据
    initForm() {
      this.modifyCsvFormVisible = true
      setTimeout(() => {
        this.getCsvInfo()
      })
    },
    async getCsvInfo() {
      const { data: csvInfoRes } = await this.$http.get(`/jmxs/child/${this.csvId}`)
      if (csvInfoRes.code !== 200) {
        return this.$message.error('获取CSV信息失败')
      }
      const childInfo = JSON.parse(csvInfoRes.data.child_info)
      this.modifyCsvForm.name = csvInfoRes.data.child_name
      this.modifyCsvForm.childId = this.csvId
      this.modifyCsvForm.variableNames = childInfo.variableNames
      this.modifyCsvForm.delimiter = childInfo.delimiter
      if (childInfo.ignoreFirstLine === 'true') {
        this.modifyCsvForm.ignoreFirstLine = true
      } else {
        this.modifyCsvForm.ignoreFirstLine = false
      }
      if (childInfo.recycle === 'true') {
        this.modifyCsvForm.recycle = true
      } else {
        this.modifyCsvForm.recycle = false
      }
      if (childInfo.stopThread === 'true') {
        this.modifyCsvForm.stopThread = true
      } else {
        this.modifyCsvForm.stopThread = false
      }
    },
    // 修改参数对话框
    submitForm() {
      this.$refs.modifyCsvFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('/csvs/update', this.modifyCsvForm)
        if (res.code !== 200) {
          return this.$message.error('修改失败')
        }
        this.$emit('fatherFunc')
        this.modifyCsvFormVisible = false
        return this.$message.success('修改成功')
      })
    }
  }
}
</script>
