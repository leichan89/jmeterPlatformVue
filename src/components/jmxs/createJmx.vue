<template>
  <div>
    <!-- button前面要用div包起来，不然会报错 -->
    <el-button type="primary" @click="initForm">新建</el-button>
    <el-dialog title="创建JMX" :visible.sync="createJmxDialogVisible" width="50%">
      <el-form ref="form" :model="createJmxForm" label-width="80px">
        <el-form-item label="JMX名称">
          <el-input v-model="createJmxForm.jmxName" placeholder="请输入接口名称" size="small"></el-input>
        </el-form-item>
        <el-form-item label="请求名称">
          <el-input v-model="createJmxForm.samplerName" placeholder="请输入接口名称" size="small"></el-input>
        </el-form-item>
        <el-form-item label="请求地址">
          <div style="margin-bottom: 5px"/>
          <el-input placeholder="请输入接口地址" v-model="createJmxForm.url" size="small">
            <el-select v-model="createJmxForm.method" slot="prepend" placeholder="请选择">
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
          <headerParamInput ref="header"/>
        </el-form-item>
        <el-form-item label="参数">
          <div style="margin-bottom: 5px">
            <el-radio-group v-model="radio" @change="tabChange(radio)" size="small">
              <el-radio-button label="form类型"></el-radio-button>
              <el-radio-button label="json类型"></el-radio-button>
            </el-radio-group>
          </div>
          <!--根据选择判断是显示json还是显示raw-->
          <formParamInput ref="formparam" v-if="tabView==='formParamInput'"/>
          <rawParamInput ref="rawparam" v-if="tabView==='rawParamInput'"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createJmxDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import formParamInput from './formParamInput.vue'
import rawParamInput from './rawParamInput.vue'
import headerParamInput from './headerParamInput.vue'

export default {
  data () {
    return {
      radio: 'form类型',
      // 默认显示form表单参数
      tabView: 'formParamInput',
      headerView: 'headerParamInput',
      createJmxDialogVisible: false,
      createJmxForm: {
        jmxName: '',
        samplerName: '',
        method: 'GET',
        url: '',
        paramType: 'form',
        params: '',
        addUser: ''
      },
      headerInfo: {
        sapmlerId: '',
        params: []
      }
    }
  },
  components: {
    formParamInput,
    rawParamInput,
    headerParamInput
  },
  methods: {
    // 初始化默认参数
    initForm() {
      this.createJmxDialogVisible = true
      this.createJmxForm.jmxName = ''
      this.createJmxForm.samplerName = ''
      this.createJmxForm.method = 'GET'
      this.createJmxForm.url = ''
      this.createJmxForm.paramType = 'form'
      this.createJmxForm.params = ''
      this.createJmxForm.addUser = ''
      this.headerInfo.sapmlerId = ''
      this.headerInfo.params = []
      this.$refs.header.headerParamFormData.list = [{ key: 'Content-Type', value: 'application/json;charset=UTF-8' }]
      this.$refs.formparam.formParamFormData.list = [{ key: '', value: '' }]
      this.$refs.rawparam.rawParamFormData.textarea = ''
    },
    // 再form和raw之间切换
    tabChange(tab) {
      if (tab === 'form类型') {
        this.tabView = 'formParamInput'
        this.createJmxForm.paramType = 'form'
      } else if (tab === 'json类型') {
        this.tabView = 'rawParamInput'
        this.createJmxForm.paramType = 'raw'
      }
    },
    // 点击确定时，创建jmx，创建完成后再创建jmx的header
    async submit() {
      this.createJmxForm.addUser = window.sessionStorage.getItem('userId')
      if (this.createJmxForm.paramType === 'form') {
        this.createJmxForm.params = this.$refs.formparam.formParamFormData.list
      } else if (this.createJmxForm.paramType === 'raw') {
        this.createJmxForm.params = this.$refs.rawparam.rawParamFormData.textarea
      }
      const { data: createJmxRes } = await this.$http.post('jmxs/create', this.createJmxForm)
      if (createJmxRes.code !== 200) {
        this.$message.error('创建JMX失败')
      } else {
        this.headerInfo.sapmlerId = createJmxRes.data.sapmlerId
        this.headerInfo.params = this.$refs.header.headerParamFormData.list
        const { data: createHeaderRes } = await this.$http.post('/samplers/create_header', this.headerInfo)
        if (createHeaderRes.code !== 200) {
          this.$message.error('创建header失败')
        }
      }
      this.createJmxDialogVisible = false
    }
  }
}
</script>
