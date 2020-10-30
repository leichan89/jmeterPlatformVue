<template>
  <span style="margin-left: 10px">
    <el-button type="primary" @click="initForm" size="small" class="myicon" icon="el-icon-edit" circle></el-button>
    <el-dialog title="修响应断言" :visible.sync="eidtRspAssertDialogVisible" width="40%">
      <el-form ref="rspAssertParamFormDataRef" :model="rspAssertParamFormData" status-icon style="width:100%">
        <el-form-item>
          <el-row>
            <el-col :span="11">
              <el-radio-group v-model="radio" @change="toChangeRadio(radio)" size="small">
                <el-radio-button label="包括"/>
                <el-radio-button label="匹配"/>
                <el-radio-button label="相等"/>
                <el-radio-button label="字符串"/>
              </el-radio-group>
            </el-col>
            <el-col :span="3" style="margin-top: 2px">
              <el-checkbox v-model="checkedFalse" @change="toChangeFalse" label="否" border size="small"/>
            </el-col>
            <el-col :span="5" style="margin-top: 2px">
              <el-checkbox v-model="checkedOr" @change="toChangeOr" label="或者" border size="small"/>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item style="margin-top: -20px">
          <el-row :gutter="10" v-for="(item,index) in rspAssertParamFormData.assertContent" :key="index" class="alignT">
            <el-col>
              <el-form-item :prop="'assertContent[' + index + '].key'">
                <el-input type="textarea" :rows="1" placeholder="请输入断言信息" v-model="item.key" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">
              <i class="iconBtn" @click="paramListMethod(index)" :class="{'el-icon-circle-plus-outline': index == 0,'el-icon-remove-outline': index>0}"></i>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="eidtRspAssertDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submit" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </span>
</template>
<script>

export default {
  data() {
    return {
      eidtRspAssertDialogVisible: false,
      rspAssertParamFormData: {
        samplerId: '',
        childId: '',
        assertContent: [
          { key: '' }
        ],
        radioStr: 'D',
        checkedFalseStr: 'e',
        checkedOrStr: 'f'
      },
      radio: '字符串',
      checkedFalse: false,
      checkedOr: false
    }
  },
  props: ['sampId', 'childId'],
  methods: {
    initForm() {
      this.eidtRspAssertDialogVisible = true
      setTimeout(() => {
        this.getRspAssertInfo()
      }, 10)
    },
    // 表单增减操作
    paramListMethod(n) {
      if (n > 0) {
        this.rspAssertParamFormData.assertContent.splice(n, 1)
      } else {
        const o = { key: '' }
        this.rspAssertParamFormData.assertContent.push(o)
      }
    },
    toChangeRadio(radio) {
      if (radio === '包括') {
        this.rspAssertParamFormData.radioStr = 'A'
      } else if (radio === '匹配') {
        this.rspAssertParamFormData.radioStr = 'B'
      } else if (radio === '相等') {
        this.rspAssertParamFormData.radioStr = 'C'
      } else if (radio === '字符串') {
        this.rspAssertParamFormData.radioStr = 'D'
      }
    },
    toChangeFalse() {
      if (this.checkedFalse === false) {
        this.rspAssertParamFormData.checkedFalseStr = 'e'
      } else {
        this.rspAssertParamFormData.checkedFalseStr = 'E'
      }
    },
    toChangeOr() {
      if (this.checkedOr === false) {
        this.rspAssertParamFormData.checkedOrStr = 'f'
      } else {
        this.rspAssertParamFormData.checkedOrStr = 'F'
      }
    },
    async getRspAssertInfo() {
      const { data: rspAssertInfoRes } = await this.$http.get(`samplers/child/${this.childId}`)
      if (rspAssertInfoRes.code !== 200) {
        return this.$message.error('获取响应断言信息失败')
      }
      const childInfo = JSON.parse(rspAssertInfoRes.data.child_info)
      this.rspAssertParamFormData.assertContent = childInfo.params.rsp_assert_content
      this.rspAssertParamFormData.radioStr = childInfo.params.rsp_assert_type[0]
      this.rspAssertParamFormData.checkedFalseStr = childInfo.params.rsp_assert_type[1]
      this.rspAssertParamFormData.checkedOrStr = childInfo.params.rsp_assert_type[2]
    },
    submit() {
      this.$refs.rspAssertParamFormDataRef.validate(async valid => {
        if (!valid) return
        this.rspAssertParamFormData.samplerId = this.sampId
        this.rspAssertParamFormData.childId = this.childId
        const { data: createRspAssertRes } = await this.$http.post('/samplers/assert/create_update_rsp', this.rspAssertParamFormData)
        if (createRspAssertRes.code !== 200) {
          return this.$message.error('修改响应断言失败')
        }
        this.eidtRspAssertDialogVisible = false
        return this.$message.success('修改响应断言成功')
      })
    }
  }
}
</script>

<style scoped>
.alignT {
  display: flex;
  align-items: flex-start;
  margin-bottom: 6px;
}
.iconBtn {
  color: #409eff;
  font-size: 22px;
  cursor: pointer;
  margin-top: 12px
}
</style>
