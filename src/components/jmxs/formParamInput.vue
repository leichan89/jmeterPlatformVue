<template>
  <el-form :model="formParamFormData" status-icon style="width:100%" size="small">
    <!-- 参数输入 -->
    <el-form-item>
      <el-row :gutter="10" v-for="(item,index) in formParamFormData.list" :key="index" class="alignT">
        <el-col>
          <el-form-item :prop="'list[' + index + '].key'">
            <el-input placeholder="请输入key" v-model="item.key" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item :prop="'list[' + index + '].value'">
            <el-input placeholder="请输入value" v-model="item.value" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span=".5">
          <i class="iconBtn" @click="paramListMethod(index)" :class="{'el-icon-circle-plus-outline': index == 0,'el-icon-remove-outline': index>0}"></i>
        </el-col>
      </el-row>
    </el-form-item>
    <!--设置与下行信息的宽度-->
    <div style="margin-bottom: -35px"/>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      formParamFormData: {
        list: [
          { key: '', value: '' }
        ]
      }
    }
  },
  methods: {
    // 表单增减操作
    paramListMethod(n) {
      if (n > 0) {
        this.formParamFormData.list.splice(n, 1)
      } else {
        const o = { key: '', value: '' }
        this.formParamFormData.list.push(o)
      }
    }
  }
}
</script>

<style scoped>
.alignT {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1px;
}
.iconBtn {
  color: #409eff;
  font-size: 22px;
  cursor: pointer;
  margin-top:6px
}
</style>
