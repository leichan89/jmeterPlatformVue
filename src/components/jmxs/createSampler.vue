<template>
  <div>
    <!-- button前面要用div包起来，不然会报错 -->
    <el-button type="primary" @click="initForm" size="small">新建请求</el-button>
    <el-dialog title="创建请求" :visible.sync="createSamplerDialogVisible" width="50%">
      <el-form ref="createSamplerFormRef" :model="createSamplerForm" :rules="createSamplerFormRules" label-width="80px">
        <el-form-item label="线程类型">
          <el-select v-model="createSamplerForm.threadType" size="small" style="width:180px">
            <el-option
              v-for="item in threadTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
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
        <el-form-item label="请求头">
          <div style="margin-bottom: 4px"/>
          <!-- 调用子组件 -->
          <headerParamInput ref="header" v-if="createSamplerDialogVisible"/>
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
          <formParamInput ref="formparamRef" v-show="createSamplerForm.paramType==='form'"/>
          <rawParamInput ref="rawparamRef" v-show="createSamplerForm.paramType==='raw'"/>
        </el-form-item>
        <el-form-item label="响应断言">
            <!-- 使用v-if的作用是强制重新重新加载断言输入框，能起到强制重置的作用 -->
            <rspAssertParaamInput ref="rspparamRef" v-if="createSamplerDialogVisible"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createSamplerDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submit" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import formParamInput from './formParamInput.vue'
import rawParamInput from './rawParamInput.vue'
import headerParamInput from './headerParamInput.vue'
import rspAssertParaamInput from './rspAssertParamInput'

export default {
  data () {
    return {
      radio: 'form类型',
      // 默认显示form表单参数
      createSamplerDialogVisible: false,
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
      createSamplerForm: {
        jmxId: '',
        threadType: 'thread',
        samplerName: '',
        method: 'GET',
        url: '',
        paramType: 'form',
        // 创建sampler时提交的参数，form获取raw
        params: ''
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
  components: {
    formParamInput,
    rawParamInput,
    headerParamInput,
    rspAssertParaamInput
  },
  methods: {
    // 重置默认参数
    initForm() {
      this.createSamplerDialogVisible = true
      // 使用setTimeout作用是防止子组件没有初始化完成
      // 初始化参数输入框信息，需要异步执行
      setTimeout(() => {
        // 初始化必填参数，必须放这里，不然可能组件没有加载完成就会报错，重置的字段需要有prop属性
        this.$refs.createSamplerFormRef.resetFields()
        // 因为使用的v-show来显示，所以需要手动重置，重置form参数的输入框
        this.$refs.formparamRef.formParamFormData.list = [{ key: '', value: '' }]
        // 重置raw参数的输入框
        this.$refs.rawparamRef.rawParamFormData.textarea = ''
        this.radio = 'form类型'
        // 重置默认参数
        this.createSamplerForm.method = 'GET'
        this.createSamplerForm.paramType = 'form'
        this.createSamplerForm.params = ''
        this.createSamplerForm.jmxId = ''
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
    // 点击确定时，创建jmx，创建完成后再创建jmx的header
    submit() {
      this.$refs.createSamplerFormRef.validate(async valid => {
        // 校验填写的参数，如果校验失败，则标红提示
        if (!valid) return
        this.createSamplerForm.jmxId = window.sessionStorage.getItem('jmxId')
        if (this.createSamplerForm.paramType === 'form') {
          this.createSamplerForm.params = this.$refs.formparamRef.formParamFormData.list
        } else if (this.createSamplerForm.paramType === 'raw') {
          this.createSamplerForm.params = this.$refs.rawparamRef.rawParamFormData.textarea
        }
        // 创建sampler
        const { data: createSamplerRes } = await this.$http.post('/samplers/create_update', this.createSamplerForm)
        if (createSamplerRes.code !== 200) {
          return this.$message.error('创建请求失败')
        } else {
          // 创建头信息
          this.$refs.header.headerParamFormData.samplerId = createSamplerRes.data.samplerId
          const { data: createHeaderRes } = await this.$http.post('/samplers/header/create_update', this.$refs.header.headerParamFormData)
          if (createHeaderRes.code !== 200) {
            return this.$message.error('创建header失败')
          } else {
            // 创建响应断言
            this.$refs.rspparamRef.rspAssertParamFormData.samplerId = createSamplerRes.data.samplerId
            const { data: createRspAssertRes } = await this.$http.post('/samplers/assert/create_update_rsp', this.$refs.rspparamRef.rspAssertParamFormData)
            if (createRspAssertRes.code !== 200) {
              return this.$message.error('创建响应断言失败')
            }
          }
        }
        this.createSamplerDialogVisible = false
        this.$emit('fatherFunc')
        return this.$message.success('创建成功')
      })
    }
  }
}
</script>
