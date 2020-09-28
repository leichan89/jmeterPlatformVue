<template>
  <div>
    <!-- button前面要用div包起来，不然会报错 -->
    <el-button type="text" @click="centerDialogVisible = true">点击打开 Dialog</el-button>
    <el-dialog title="添加请求" :visible.sync="centerDialogVisible" width="50%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="form.apiName" placeholder="请输入接口名称" size="small"></el-input>
        </el-form-item>
        <el-form-item label="路径">
          <div style="margin-bottom: 5px"/>
          <el-input placeholder="请输入接口地址" v-model="form.requestUrl" size="small">
            <el-select v-model="form.requestMethod" slot="prepend" placeholder="请选择">
              <el-option label="GET" value="GET"></el-option>
              <el-option label="POST" value="POST"></el-option>
              <el-option label="PUT" value="PUT"></el-option>
              <el-option label="DELETE" value="DELETE"></el-option>
            </el-select>
          </el-input>
          <!--设置与下行信息的间距-->
          <div style="margin-bottom: -5px"/>
        </el-form-item>
        <el-form-item label="头信息">
          <div style="margin-bottom: 5px"/>
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
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="showparam">确 定</el-button>
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
      centerDialogVisible: false,
      form: {
        apiName: '',
        requestUrl: '',
        requestMethod: 'GET'
      },
      paramInfo: ''
    }
  },
  components: {
    formParamInput,
    rawParamInput,
    headerParamInput
  },
  methods: {
    tabChange(tab) {
      console.log(tab)
      if (tab === 'form类型') {
        this.tabView = 'formParamInput'
      } else if (tab === 'json类型') {
        this.tabView = 'rawParamInput'
      }
      // 调用header组件中的参数
      console.log(this.$refs.header)
    },
    showparam() {
      if (this.tabView === 'formParamInput') {
        this.paramInfo = this.$refs.formparam.formParamFormData.list
      } else {
        this.paramInfo = this.$refs.rawparam.rawParamFormData.textarea
      }
      this.centerDialogVisible = false
      console.log(this.params)
    }
  }
}
</script>
