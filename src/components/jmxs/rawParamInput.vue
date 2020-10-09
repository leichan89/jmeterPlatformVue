<template>
  <el-form :model="rawParamFormData" status-icon style="width:100%">
    <el-form-item>
      <el-row>
        <el-col>
          <el-input type="textarea" :rows="5" placeholder="请输入raw格式参数" v-model="rawParamFormData.textarea">
          </el-input>
        </el-col>
      </el-row>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      rawParamFormData: {
        textarea: ''
      }
    }
  }
}
</script>
