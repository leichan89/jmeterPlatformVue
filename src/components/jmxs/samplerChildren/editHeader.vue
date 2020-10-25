<template>
  <div>
    <el-button type="primary" @click="initForm" size="small" class="myicon" icon="el-icon-edit" circle></el-button>
    <el-dialog title="修改头信息" :visible.sync="eidtHeaderDialogVisible" width="50%">
      <el-form :model="headerParamFormData" status-icon style="width:100%" size="small">
        <!-- 参数输入 -->
        <el-form-item>
          <el-row :gutter="10" v-for="(item,index) in headerParamFormData.params" :key="index" class="alignT">
            <el-col>
              <el-form-item :prop="'params[' + index + '].key'">
                <el-input placeholder="请输入key" v-model="item.key" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item :prop="'params[' + index + '].value'">
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
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      eidtHeaderDialogVisible: false,
      headerParamFormData: {
        sapmlerId: '',
        params: [
          { key: 'Content-Type', value: 'application/json;charset=UTF-8' }
        ]
      }
    }
  },
  props: ['childId'],
  methods: {
    initForm() {
      this.eidtHeaderDialogVisible = true
      setTimeout(() => {
        this.getHeaderInfo()
      }, 10)
    },
    // 表单增减操作
    paramListMethod(n) {
      if (n > 0) {
        this.headerParamFormData.params.splice(n, 1)
      } else {
        const o = { key: '', value: '' }
        this.headerParamFormData.params.push(o)
      }
    },
    async getHeaderInfo() {
      const { data: headerInfoRes } = await this.$http.get(`samplers/children/${this.childId}`)
      if (headerInfoRes.code !== 200) {
        return this.$message.error('获取头信息失败')
      }
      const childInfo = JSON.parse(headerInfoRes.data.child_info)
      this.headerParamFormData.params = childInfo.params
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
