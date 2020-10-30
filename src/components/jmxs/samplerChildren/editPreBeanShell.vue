<template>
  <span style="margin-left: 10px">
    <el-button type="primary" @click="initForm" size="small" class="myicon" icon="el-icon-edit" circle/>
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
  props: ['sampId', 'childId'],
  methods: {
    initForm() {
      this.preBeanShellVisible = true
      if (this.childId) {
        this.$refs.preBeanShellFormDataRef.resetFields()
        setTimeout(() => {
          this.getPreBeanShellInfo()
        }, 10)
      }
    },
    async getPreBeanShellInfo() {
      const { data: preBeanShellRes } = await this.$http.get(`/samplers/child/${this.childId}`)
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
        this.preBeanShellFormData.samplerId = this.sampId
        this.preBeanShellFormData.childId = this.childId
        const { data: createPreBeanShellRes } = await this.$http.post('/samplers/beanshell/create_update_pre', this.preBeanShellFormData)
        if (createPreBeanShellRes.code !== 200) {
          return this.$message.error('创建或者修改BeanShell前置处理器失败')
        }
        this.preBeanShellVisible = false
        return this.$message.success('创建或者修改BeanShell前置处理器成功')
      })
    }
  }
}
</script>
