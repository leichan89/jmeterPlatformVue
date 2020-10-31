<template>
  <span>
    <!-- append-to-body解决从下拉菜单打开时被大遮罩挡住的问题，但是后面又没有加了 -->
    <el-dialog title="JSON提取器" :visible.sync="jsonExtractVisible" width="30%">
      <el-form ref="jsonExtractFormDataRef" :model="jsonExtractFormData" status-icon size="small" label-width="80px" :rules="jsonExtractFormRules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="jsonExtractFormData.name" placeholder="提取器名" size="small"/>
        </el-form-item>
        <el-form-item label="变量名称" prop="params">
          <el-input v-model="jsonExtractFormData.params" placeholder="变量名称" size="small"/>
        </el-form-item>
        <el-form-item label="提取路径" prop="express">
          <el-input v-model="jsonExtractFormData.express" placeholder="JSON提取路径" size="small"/>
        </el-form-item>
        <el-form-item label="取数" prop="match_num">
          <el-input v-model="jsonExtractFormData.match_num" placeholder="默认取第一个，0表示随机取" size="small"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="jsonExtractVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submit" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
export default {
  data() {
    return {
      jsonExtractVisible: false,
      jsonExtractFormData: {
        samplerId: '',
        childId: '',
        name: '',
        params: '',
        express: '',
        match_num: ''
      },
      // 校验必填参数
      jsonExtractFormRules: {
        name: [
          { required: true, message: '请输入JSON提取器名称', trigger: 'blur' }
        ],
        params: [
          { required: true, message: '请输入JSON提取器保存的变量', trigger: 'blur' }
        ],
        express: [
          { required: true, message: '请输入JSON提取器提取路径', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    initForm(samplerId, childId = '') {
      this.jsonExtractFormData.samplerId = samplerId
      this.jsonExtractVisible = true
      setTimeout(() => {
        this.$refs.jsonExtractFormDataRef.resetFields()
      })
      if (childId !== '') {
        setTimeout(() => {
          this.jsonExtractFormData.childId = childId
          this.getJsonExtractInfo()
        }, 10)
      }
    },
    async getJsonExtractInfo() {
      const { data: jsonExtractRes } = await this.$http.get(`/samplers/child/${this.jsonExtractFormData.childId}`)
      if (jsonExtractRes.code !== 200) {
        return this.$message.error('获取JSON提取器信息失败')
      }
      const jsonExtractInfo = JSON.parse(jsonExtractRes.data.child_info)
      this.jsonExtractFormData.name = jsonExtractRes.data.child_name
      this.jsonExtractFormData.params = jsonExtractInfo.params.params
      this.jsonExtractFormData.express = jsonExtractInfo.params.express
      this.jsonExtractFormData.match_num = jsonExtractInfo.params.match_num
    },
    submit() {
      this.$refs.jsonExtractFormDataRef.validate(async valid => {
        if (!valid) return
        const { data: createJsonExtractRes } = await this.$http.post('/samplers/extract/create_update_json', this.jsonExtractFormData)
        if (createJsonExtractRes.code !== 200) {
          return this.$message.error('创建或者修改JSON提取器失败')
        }
        this.jsonExtractVisible = false
        return this.$message.success('创建或者修改JSON提取器成功')
      })
    }
  }
}
</script>
