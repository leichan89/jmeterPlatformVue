<template>
  <span>
    <el-dialog title="JSR223" :visible.sync="JSR223Visible" width="60%">
      <el-form ref="JSR223FormDataRef" :model="JSR223FormData" status-icon size="small" label-width="80px" :rules="JSR223FormRules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="JSR223FormData.name" placeholder="JSR223名称" size="small"/>
        </el-form-item>
        <!--<el-form-item label="语言" prop="toJSR223Param">-->
        <!--  <el-input v-model="JSR223FormData.language" placeholder="语言" size="small"/>-->
        <!--</el-form-item>-->
        <el-form-item label="传递参数" prop="toJSR223Param">
          <el-input v-model="JSR223FormData.toJSR223Param" placeholder="传递给JSR223的参数" size="small"/>
        </el-form-item>
        <el-form-item label="脚本" prop="express">
          <el-input type="textarea" :rows="5" v-model="JSR223FormData.express" placeholder="JSR223脚本" size="small"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="JSR223Visible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submit" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
export default {
  data() {
    return {
      JSR223Visible: false,
      JSR223FormData: {
        samplerId: '',
        childId: '',
        name: '',
        toJSR223Param: '',
        express: ''
      },
      // 校验必填参数
      JSR223FormRules: {
        name: [
          { required: true, message: '请输入JSR223名称', trigger: 'blur' }
        ],
        express: [
          { required: true, message: '请输入BeanShell脚本', trigger: 'blur' }
        ]
      }
    }
  },
  props: ['refreshTarget'],
  methods: {
    initForm(samplerId, childId = '') {
      this.JSR223FormData.samplerId = samplerId
      this.JSR223Visible = true
      setTimeout(() => {
        this.$refs.JSR223FormDataRef.resetFields()
      })
      if (childId !== '') {
        setTimeout(() => {
          this.JSR223FormData.childId = childId
          this.getJSR223Info()
        }, 10)
      }
    },
    async getJSR223Info() {
      const { data: JSR223Res } = await this.$http.get(`/samplers/child/${this.JSR223FormData.childId}`)
      if (JSR223Res.code !== 200) {
        return this.$message.error('获取JSR223信息失败')
      }
      const JSR223Info = JSON.parse(JSR223Res.data.child_info)
      this.JSR223FormData.name = JSR223Res.data.child_name
      this.JSR223FormData.toJSR223Param = JSR223Info.params.to_beanshell_param
      this.JSR223FormData.express = JSR223Info.params.express
    },
    submit() {
      this.$refs.JSR223FormDataRef.validate(async valid => {
        if (!valid) return
        const { data: createJSR223Res } = await this.$http.post('/samplers/JSR223/create_update_JSR223', this.JSR223FormData)
        if (createJSR223Res.code !== 200) {
          return this.$message.error('创建或者修改JSR223失败')
        }
        this.JSR223Visible = false
        this.$emit('fatherFn')
        // 修改父组件中的值，便于刷新子组件
        this.$emit('update:refreshTarget', new Date().getTime())
        return this.$message.success('创建或者修改JSR223成功')
      })
    }
  }
}
</script>
