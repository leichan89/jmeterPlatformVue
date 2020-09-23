<template>
  <el-form :model="formParamFormData" ref="formParamFormData" status-icon style="width:100%" size="mini">
    <!-- 参数输入 -->
    <el-form-item>
      <el-row :gutter="5" v-for="(item,index) in formParamFormData.list" :key="index" class="alignT spaceTop1">
        <el-col :span="5">
          <el-form-item :prop="'list[' + index + '].key'">
            <el-input placeholder="请输入key" v-model="item.key" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item :prop="'list[' + index + '].value'">
            <el-input placeholder="请输入value" v-model="item.value" auto-complete="off"></el-input>
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
  name: 'elementForm' /* element-ui表单验证 */,
  data() {
    return {
      formParamFormData: {
        list: [
          { key: '1', value: '1' },
          { key: '1', value: '1' },
          { key: '11', value: '1' },
          { key: '1', value: '1' },
          { key: '1', value: '1' }
        ]
      }
    }
  },
  mounted() {},
  methods: {
    // 表单增减操作
    paramListMethod(n) {
      if (n > 0) {
        this.formParamFormData.list.splice(n, 1)
      } else {
        const o = { key: '', value: '' }
        this.formParamFormData.list.push(o)
      }
      console.log(this.formParamFormData.list)
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
.align {
  display: flex;
  align-items: center;
}
.alignT {
  display: flex;
  align-items: flex-start;
}
.iconBtn {
  color: #409eff;
  font-size: 18px;
  cursor: pointer;
  margin-top:6px
}
</style>
