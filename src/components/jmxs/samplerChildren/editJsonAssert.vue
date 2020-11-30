<template>
  <span>
    <el-dialog title="JSON断言" :visible.sync="jsonAssertVisible" width="30%">
      <el-form ref="jsonAssertFormDataRef" :model="jsonAssertFormData" status-icon size="small" label-width="80px" :rules="jsonAssertFormRules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="jsonAssertFormData.name" placeholder="json断言名称" size="small"/>
        </el-form-item>
        <el-form-item label="提取路径" prop="jsonPath">
          <el-input v-model="jsonAssertFormData.jsonPath" placeholder="json提取路径" size="small"/>
        </el-form-item>
        <el-form-item label="预期值" prop="expectedValue">
          <el-input v-model="jsonAssertFormData.expectedValue" placeholder="断言预期值" size="small" :disabled="jsonAssertFormData.expectNull"/>
        </el-form-item>
        <el-form-item label="其他设置">
          <div style="margin-bottom: 10px">
            <el-checkbox v-model="jsonAssertFormData.expectNull" size="small" label="预期值为null" border/>
          </div>
          <div>
            <el-checkbox v-model="jsonAssertFormData.invert" size="small" label="断言取反" border/>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="jsonAssertVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submit" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
export default {
  data() {
    return {
      jsonAssertVisible: false,
      jsonAssertFormData: {
        samplerId: '',
        childId: '',
        name: '',
        jsonPath: '',
        expectedValue: '',
        expectNull: false,
        invert: false
      },
      // 校验必填参数
      jsonAssertFormRules: {
        name: [
          { required: true, message: '请输入json断言名称', trigger: 'blur' }
        ],
        jsonPath: [
          { required: true, message: '请输入JSON提取路径', trigger: 'blur' }
        ],
        expectedValue: [
          { required: true, message: '请输入断言预期值', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    initForm(samplerId, childId = '') {
      this.jsonAssertFormData.samplerId = samplerId
      this.jsonAssertVisible = true
      setTimeout(() => {
        this.$refs.jsonAssertFormDataRef.resetFields()
      })
      if (childId !== '') {
        setTimeout(() => {
          this.jsonAssertFormData.childId = childId
          this.getjsonAssertInfo()
        }, 10)
      }
    },
    async getjsonAssertInfo() {
      const { data: jsonAssertRes } = await this.$http.get(`/samplers/child/${this.jsonAssertFormData.childId}`)
      if (jsonAssertRes.code !== 200) {
        return this.$message.error('获取json断言信息失败')
      }
      const jsonAssertInfo = JSON.parse(jsonAssertRes.data.child_info)
      this.jsonAssertFormData.name = jsonAssertRes.data.child_name
      this.jsonAssertFormData.jsonPath = jsonAssertInfo.params.json_path
      this.jsonAssertFormData.expectedValue = jsonAssertInfo.params.expected_value
      this.jsonAssertFormData.expectNull = jsonAssertInfo.params.expect_null
      this.jsonAssertFormData.invert = jsonAssertInfo.params.invert
    },
    submit() {
      this.$refs.jsonAssertFormDataRef.validate(async valid => {
        if (!valid) return
        const { data: createJsonAssertRes } = await this.$http.post('/samplers/assert/create_update_json', this.jsonAssertFormData)
        if (createJsonAssertRes.code !== 200) {
          return this.$message.error('创建或者修改json断言失败')
        }
        this.jsonAssertVisible = false
        this.$emit('fatherFn')
        return this.$message.success('创建或者修改json断言成功')
      })
    }
  }
}
</script>
