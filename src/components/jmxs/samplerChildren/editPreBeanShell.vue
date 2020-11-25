<template>
  <span>
    <el-dialog title="BeanShell前置处理器" :visible.sync="preBeanShellVisible" width="30%">
      <el-form ref="preBeanShellFormDataRef" :model="preBeanShellFormData" status-icon size="small" label-width="80px" :rules="preBeanShellFormRules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="preBeanShellFormData.name" placeholder="BeanShell前置处理器名称" size="small"/>
        </el-form-item>
        <el-form-item label="传递参数" prop="toBeanShellParam">
          <el-input v-model="preBeanShellFormData.toBeanShellParam" placeholder="传递给BeanShell的参数" size="small"/>
        </el-form-item>
        <el-form-item label="脚本" prop="express">
          <el-input type="textarea" :rows="5" v-model="preBeanShellFormData.express" placeholder="BeanShell脚本" size="small"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="preBeanShellVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submit" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
export default {
  data() {
    return {
      preBeanShellVisible: false,
      preBeanShellFormData: {
        samplerId: '',
        childId: '',
        name: '',
        toBeanShellParam: '',
        express: ''
      },
      // 校验必填参数
      preBeanShellFormRules: {
        name: [
          { required: true, message: '请输入BeanShell前置处理器名称', trigger: 'blur' }
        ],
        express: [
          { required: true, message: '请输入BeanShell脚本', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    initForm(samplerId, childId = '') {
      this.preBeanShellFormData.samplerId = samplerId
      this.preBeanShellVisible = true
      setTimeout(() => {
        this.$refs.preBeanShellFormDataRef.resetFields()
      })
      if (childId !== '') {
        setTimeout(() => {
          this.preBeanShellFormData.childId = childId
          this.getPreBeanShellInfo()
        }, 10)
      }
    },
    async getPreBeanShellInfo() {
      const { data: preBeanShellRes } = await this.$http.get(`/samplers/child/${this.preBeanShellFormData.childId}`)
      if (preBeanShellRes.code !== 200) {
        return this.$message.error('获取BeanShell前置处理器信息失败')
      }
      const preBeanShellInfo = JSON.parse(preBeanShellRes.data.child_info)
      this.preBeanShellFormData.name = preBeanShellRes.data.child_name
      this.preBeanShellFormData.toBeanShellParam = preBeanShellInfo.params.to_beanshell_param
      this.preBeanShellFormData.express = preBeanShellInfo.params.express
    },
    submit() {
      this.$refs.preBeanShellFormDataRef.validate(async valid => {
        if (!valid) return
        const { data: createPreBeanShellRes } = await this.$http.post('/samplers/beanshell/create_update_pre', this.preBeanShellFormData)
        if (createPreBeanShellRes.code !== 200) {
          return this.$message.error('创建或者修改BeanShell前置处理器失败')
        }
        this.preBeanShellVisible = false
        this.$emit('fatherFn')
        return this.$message.success('创建或者修改BeanShell前置处理器成功')
      })
    }
  }
}
</script>
