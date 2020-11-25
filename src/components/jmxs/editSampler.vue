<template>
  <span style="margin-left: 10px">
    <!-- button前面要用div包起来，不然会报错 -->
    <el-button type="primary" @click="initForm" size="small" class="myicon" icon="el-icon-edit" circle></el-button>
    <el-dialog title="修改请求" :visible.sync="editSamplerDialogVisible" width="50%">
      <el-form ref="createSamplerFormRef" :model="createSamplerForm" :rules="createSamplerFormRules" label-width="80px">
        <el-form-item label="请求名称" prop="samplerName">
          <el-input v-model="createSamplerForm.samplerName" placeholder="请输入接口名称" size="small"></el-input>
        </el-form-item>
        <el-form-item label="请求地址" prop="url">
          <div style="margin-bottom: 5px"/>
          <el-input placeholder="请输入接口地址" v-model="createSamplerForm.url" size="small">
            <el-select v-model="createSamplerForm.method" slot="prepend" placeholder="请选择">
              <el-option label="GET" value="GET"></el-option>
              <el-option label="POST" value="POST"></el-option>
              <el-option label="PUT" value="PUT"></el-option>
              <el-option label="DELETE" value="DELETE"></el-option>
            </el-select>
          </el-input>
          <!--设置与下行信息的间距-->
          <div style="margin-bottom: -5px"/>
        </el-form-item>
        <el-form-item label="参数">
          <div style="margin-bottom: 7px">
            <!-- 切换tab的时候，修改paramType的值，radio的值要和label的值相等 -->
            <el-radio-group v-model="radio" @change="tabChange(radio)" size="small">
              <el-radio-button label="form类型"></el-radio-button>
              <el-radio-button label="raw类型"></el-radio-button>
            </el-radio-group>
          </div>
          <!--根据选择判断是显示json还是显示raw-->
          <!-- 使用v-show元素总是会被渲染，并且只是简单地基于 CSS 进行切换，所以这里其实form和raw都是现实加载出来了的 -->
          <!-- 使用v-if则是“真正”的条件渲染，就是为真实html中才有这些元素 -->
          <formParamInput ref="formparamRef" v-if="createSamplerForm.paramType==='form'"/>
          <rawParamInput ref="rawparamRef" v-if="createSamplerForm.paramType==='raw'"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editSamplerDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submit" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </span>
</template>
<script>

import formParamInput from './formParamInput.vue'
import rawParamInput from './rawParamInput.vue'

export default {
  data () {
    return {
      radio: '',
      // 默认显示form表单参数
      editSamplerDialogVisible: false,
      createSamplerForm: {
        jmxId: '',
        threadType: '',
        samplerName: '',
        method: '',
        url: '',
        paramType: '',
        // 创建sampler时提交的参数，form获取raw
        params: '',
        childId: ''
      },
      // 校验必填参数
      createSamplerFormRules: {
        samplerName: [
          { required: true, message: '请输入sampler名称', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入URL', trigger: 'blur' }
        ]
      }
    }
  },
  props: ['samplerId'],
  components: {
    formParamInput,
    rawParamInput
  },
  created() {
    this.createSamplerForm.jmxId = window.sessionStorage.getItem('jmxId')
  },
  methods: {
    // 重置默认参数
    initForm() {
      // 使用setTimeout作用是防止子组件没有初始化完成
      // 初始化参数输入框信息，需要异步执行
      setTimeout(() => {
        this.editSamplerDialogVisible = true
        this.getSamplerInfo()
      }, 10)
    },
    // 再form和raw之间切换
    tabChange(tab) {
      if (tab === 'form类型') {
        this.createSamplerForm.paramType = 'form'
      } else if (tab === 'raw类型') {
        this.createSamplerForm.paramType = 'raw'
      }
    },
    // 获取接口信息
    async getSamplerInfo() {
      const { data: samplerInfoRes } = await this.$http.get(`/jmxs/child/${this.samplerId}`)
      if (samplerInfoRes.code !== 200) {
        return this.$message.error('获取请求信息失败')
      }
      const childInfo = JSON.parse(samplerInfoRes.data.child_info)
      this.createSamplerForm.samplerName = samplerInfoRes.data.child_name
      this.createSamplerForm.url = childInfo.url
      this.createSamplerForm.method = childInfo.method
      this.createSamplerForm.paramType = childInfo.param_type
      this.createSamplerForm.threadType = childInfo.thread_type
      this.createSamplerForm.childId = this.samplerId
      setTimeout(() => {
        if (childInfo.param_type === 'raw') {
          this.radio = 'raw类型'
          this.$refs.rawparamRef.rawParamFormData.textarea = childInfo.params
        } else {
          this.radio = 'form类型'
          this.$refs.formparamRef.formParamFormData.list = childInfo.params
        }
      }, 10)
    },
    // 点击确定时，创建jmx，创建完成后再创建jmx的header
    submit() {
      this.$refs.createSamplerFormRef.validate(async valid => {
        // 校验填写的参数，如果校验失败，则标红提示
        if (!valid) return
        if (this.createSamplerForm.paramType === 'form') {
          this.createSamplerForm.params = this.$refs.formparamRef.formParamFormData.list
        } else if (this.createSamplerForm.paramType === 'raw') {
          this.createSamplerForm.params = this.$refs.rawparamRef.rawParamFormData.textarea
        }
        // 修改sampler
        const { data: createSamplerRes } = await this.$http.post('/samplers/create_update', this.createSamplerForm)
        if (createSamplerRes.code !== 200) {
          return this.$message.error('修改请求失败')
        }
        // 修改完成后刷新列表
        this.$emit('fatherFunc')
        this.editSamplerDialogVisible = false
        return this.$message.success('修改成功')
      })
    }
  }
}
</script>
