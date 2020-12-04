<template>
  <el-form :model="headerParamFormData" status-icon style="width:100%" size="small">
    <!-- 参数输入 -->
    <el-form-item>
      <el-row :gutter="10" v-for="(item,index) in headerParamFormData.params" :key="index" class="alignT">
        <el-col>
          <el-form-item :prop="'params[' + index + '].key'">
            <el-input placeholder="请输入key" v-model="item.key" auto-complete="off"/>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item :prop="'params[' + index + '].value'">
            <el-input placeholder="请输入value" v-model="item.value" auto-complete="off"/>
          </el-form-item>
        </el-col>
        <el-col :span=".5">
          <i class="iconBtn" @click="paramListMethod(index)" :class="{'el-icon-circle-plus-outline': index == 0,'el-icon-remove-outline': index>0}"/>
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
      headerParamFormData: {
        samplerId: '',
        params: [
          { key: '', value: '' }
        ]
      }
    }
  },
  methods: {
    // 表单增减操作
    paramListMethod(n) {
      // 删除起始下标为1，长度为2的一个值(len设置2)
      // var arr2 = ['a','b','c','d']
      // arr2.splice(1,2);
      // console.log(arr2);
      // ['a','d']
      // 大于0的时候，就是index>0时，就是删除的操作，这里相当于删除指定索引的数据
      if (n > 0) {
        this.headerParamFormData.params.splice(n, 1)
      } else {
        const o = { key: '', value: '' }
        // index=0时，就是新增的操作。push 添加新元素
        this.headerParamFormData.params.push(o)
      }
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
