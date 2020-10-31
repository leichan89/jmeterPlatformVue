<template>
  <span>
    <el-dialog title="BeanShell后置处理器" :visible.sync="afterBeanShellVisible" width="30%">
      <el-form ref="afterBeanShellFormDataRef" :model="afterBeanShellFormData" status-icon size="small" label-width="80px" :rules="afterBeanShellFormRules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="afterBeanShellFormData.name" placeholder="BeanShell后置处理器名称" size="small"/>
        </el-form-item>
        <el-form-item label="传递参数" prop="toBeanShellParam">
          <el-input v-model="afterBeanShellFormData.toBeanShellParam" placeholder="传递给BeanShell的参数" size="small"/>
        </el-form-item>
        <el-form-item label="脚本" prop="express">
          <el-input type="textarea" :rows="5" v-model="afterBeanShellFormData.express" placeholder="BeanShell脚本" size="small"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="afterBeanShellVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submit" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
export default {
  data() {
    return {
      afterBeanShellVisible: false,
      afterBeanShellFormData: {
        samplerId: '',
        childId: '',
        name: '',
        toBeanShellParam: '',
        express: ''
      },
      // 校验必填参数
      afterBeanShellFormRules: {
        name: [
          { required: true, message: '请输入BeanShell后置处理器名称', trigger: 'blur' }
        ],
        express: [
          { required: true, message: '请输入BeanShell脚本', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    initForm(samplerId, childId = '') {
      this.afterBeanShellFormData.samplerId = samplerId
      this.afterBeanShellVisible = true
      setTimeout(() => {
        this.$refs.afterBeanShellFormDataRef.resetFields()
      })
      if (childId !== '') {
        setTimeout(() => {
          this.afterBeanShellFormData.childId = childId
          this.getAfterBeanShellInfo()
        }, 10)
      }
    },
    async getAfterBeanShellInfo() {
      const { data: afterBeanShellRes } = await this.$http.get(`/samplers/child/${this.afterBeanShellFormData.childId}`)
      if (afterBeanShellRes.code !== 200) {
        return this.$message.error('获取BeanShell后置处理器信息失败')
      }
      const afterBeanShellInfo = JSON.parse(afterBeanShellRes.data.child_info)
      this.afterBeanShellFormData.name = afterBeanShellRes.data.child_name
      this.afterBeanShellFormData.toBeanShellParam = afterBeanShellInfo.params.to_beanshell_param
      this.afterBeanShellFormData.express = afterBeanShellInfo.params.express
    },
    submit() {
      this.$refs.afterBeanShellFormDataRef.validate(async valid => {
        if (!valid) return
        const { data: createAfterBeanShellRes } = await this.$http.post('/samplers/beanshell/create_update_after', this.afterBeanShellFormData)
        if (createAfterBeanShellRes.code !== 200) {
          return this.$message.error('创建或者修改BeanShell后置处理器失败')
        }
        this.afterBeanShellVisible = false
        return this.$message.success('创建或者修改BeanShell后置处理器成功')
      })
    }
  }
}
</script>
