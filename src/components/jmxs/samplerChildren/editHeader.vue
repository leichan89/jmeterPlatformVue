<template>
  <span>
    <el-dialog title="请求头信息" :visible.sync="eidtHeaderDialogVisible" width="35%">
      <el-form ref="headerParamFormDataRef" :model="headerParamFormData" status-icon label-width="60px" size="small" :rules="headerParamFormRules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="headerParamFormData.name" placeholder="请求头名称" size="small"/>
        </el-form-item>
        <!-- 参数输入 -->
        <el-form-item label="参数">
          <el-row :gutter="10" v-for="(item,index) in headerParamFormData.params" :key="index" class="alignT">
            <el-col>
              <el-form-item>
                <el-input placeholder="请输入key" v-model="item.key" auto-complete="off"/>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item>
                <el-input placeholder="请输入value" v-model="item.value" auto-complete="off"/>
              </el-form-item>
            </el-col>
            <el-col :span=".5">
              <i class="iconBtn" @click="paramListMethod(index)" :class="{'el-icon-circle-plus-outline': index == 0,'el-icon-remove-outline': index>0}"></i>
            </el-col>
          </el-row>
        </el-form-item>
        <!--设置与下行信息的宽度-->
        <div style="margin-bottom: -20px"/>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="eidtHeaderDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submit" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
export default {
  data() {
    return {
      eidtHeaderDialogVisible: false,
      headerParamFormData: {
        samplerId: '',
        childId: '',
        name: '',
        params: [{ key: '', value: '' }]
      },
      // 校验必填参数
      headerParamFormRules: {
        name: [
          { required: true, message: '请输入请求头名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    initForm(samplerId, childId = '') {
      this.headerParamFormData.samplerId = samplerId
      this.eidtHeaderDialogVisible = true
      setTimeout(() => {
        this.$refs.headerParamFormDataRef.resetFields()
      })
      if (childId !== '') {
        setTimeout(() => {
          this.headerParamFormData.childId = childId
          this.getHeaderInfo()
        }, 10)
      }
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
      const { data: headerInfoRes } = await this.$http.get(`samplers/child/${this.headerParamFormData.childId}`)
      if (headerInfoRes.code !== 200) {
        return this.$message.error('获取头信息失败')
      }
      const childInfo = JSON.parse(headerInfoRes.data.child_info)
      this.headerParamFormData.name = headerInfoRes.data.child_name
      this.headerParamFormData.params = childInfo.params
    },
    submit() {
      this.$refs.headerParamFormDataRef.validate(async valid => {
        if (!valid) return
        const { data: createHeaderRes } = await this.$http.post('/samplers/header/create_update', this.headerParamFormData)
        if (createHeaderRes.code !== 200) {
          return this.$message.error('修改请求头失败')
        }
        this.eidtHeaderDialogVisible = false
        this.$emit('fatherFn')
        return this.$message.success('修改请求头成功')
      })
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
