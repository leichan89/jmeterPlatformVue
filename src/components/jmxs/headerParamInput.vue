<template>
  <el-form :model="headerParamFormData" ref="headerParamFormData" status-icon style="width:100%" size="small">
    <!-- 参数输入 -->
    <el-form-item>
      <el-row :gutter="10" v-for="(item,index) in headerParamFormData.list" :key="index" class="alignT">
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
        <el-col :span="1">
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
  name: 'elementForm' /* element-ui表单验证 */,
  data() {
    return {
      headerParamFormData: {
        list: [
          { key: 'Content-Type', value: 'application/json;charset=UTF-8' }
        ]
      }
    }
  },
  methods: {
    // 表单增减操作
    paramListMethod(n) {
      if (n > 0) {
        this.headerParamFormData.list.splice(n, 1)
      } else {
        const o = { key: '', value: '' }
        this.headerParamFormData.list.push(o)
      }
    },
    // 姓名校验方法
    rule_name(rule, value, callback) {
      console.log(value)
      // 姓名不能为空
      if (!value) {
        return callback(new Error('请输入姓名'))
      }
      callback()
    },
    // 年龄校验方法
    rule_age(rule, value, callback) {
      if (!value) {
        return callback(new Error('请输入年龄'))
      }

      const n = Number(value)

      if (n < 1) {
        return callback(new Error('年龄不能小于1岁'))
      }

      if (n > 200) {
        return callback(new Error('年龄不能大于200岁'))
      }

      callback()
    }
  }
}
</script>

<style scoped>
.alignT {
  display: flex;
  align-items: flex-start;
}
.iconBtn {
  color: #409eff;
  font-size: 22px;
  cursor: pointer;
  margin-top:6px
}
</style>
