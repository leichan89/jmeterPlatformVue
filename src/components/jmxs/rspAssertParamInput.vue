<template>
  <el-form :model="rspAssertParamFormData" status-icon style="width:100%">
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
        <el-col :span="3" style="margin-top: 1px">
          <el-checkbox v-model="checkedFalse" @change="toChangeFalse" label="否" border size="small"/>
        </el-col>
        <el-col :span="10" style="margin-top: 1px">
          <el-checkbox v-model="checkedOr" @change="toChangeOr" label="或者" border size="small"/>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
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
</template>
<script>

export default {
  data() {
    return {
      rspAssertParamFormData: {
        samplerId: '',
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
  methods: {
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
