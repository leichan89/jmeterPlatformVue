<template>
  <div>
    <!-- button前面要用div包起来，不然会报错 -->
    <el-button type="text" @click="centerDialogVisible = true">点击打开 Dialog</el-button>
    <el-dialog title="添加请求" :visible.sync="centerDialogVisible" width="60%" :before-close="handleClose">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="请求参数">
          <div style="margin-bottom: 15px">
            <el-radio-group v-model="radio" @change="tabChange(radio)">
              <el-radio-button label="form类型"></el-radio-button>
              <el-radio-button label="json类型"></el-radio-button>
            </el-radio-group>
          </div>
          <!-- tab内容 -->
          <keep-alive>
            <component v-bind:is="tabView"></component>
          </keep-alive>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import formParamInput from './formParamInput.vue'
import rawParamInput from './rawParamInput.vue'
export default {
  data () {
    return {
      radio: 'form类型',
      tabView: 'formParamInput',
      centerDialogVisible: false,
      form: {
        xx: ''
      }
    }
  },
  components: {
    formParamInput,
    rawParamInput
  },
  methods: {
    tabChange(tab) {
      console.log(tab)
      if (tab === 'form类型') {
        this.tabView = 'formParamInput'
      } else if (tab === 'json类型') {
        this.tabView = 'rawParamInput'
      }
      console.log(this.tabView)
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    }
  }
}
</script>
