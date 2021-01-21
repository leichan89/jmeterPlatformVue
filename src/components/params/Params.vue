<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>参数管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <!-- gutter设置栅格的间距 -->
      <el-row :gutter="40">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.search" clearable @clear="getParamsList">
            <el-button slot="append" icon="el-icon-search" @click="getParamsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="initForm">新建</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区 -->
      <el-table :data="paramsList" border stripe>
        <el-table-column label="参数id" prop="id"></el-table-column>
        <el-table-column label="参数名" prop="param_name"></el-table-column>
        <el-table-column label="参数值" prop="param_value"></el-table-column>
        <el-table-column label="创建人" prop="user.name"></el-table-column>
        <el-table-column label="创建时间" prop="add_time"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑参数" placement="top" :enterable="false">
              <el-button class="myicon" type="primary" size="small" icon="el-icon-edit" circle @click="getParamDetail(scope.row.id)"/>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除参数" placement="top" :enterable="false">
              <el-popconfirm title="确定是否删除参数？" @onConfirm="deleteParam(scope.row.id)">
                <el-button style="margin-left: 10px" slot="reference" class="myicon" type="danger" size="small" icon="el-icon-delete" circle/>
              </el-popconfirm>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 创建任务对话框 -->
      <el-dialog title="参数设置" :visible.sync="createFormVisible" width="30%">
        <el-form ref="createFormRef" :model="createForm" label-width="75px" class="demo-ruleForm" :rules="createFormRules">
          <el-form-item label="参数名:" prop="param_name">
            <el-input v-model="createForm.param_name" placeholder="请输入参数名称" size="small"/>
          </el-form-item>
          <el-form-item label="参数值:" prop="param_value">
            <el-input type="textarea" :rows="5" placeholder="请输入参数值" v-model="createForm.param_value" size="small"/>
          </el-form-item>
          <el-form-item label="备注:" prop="param_content">
            <el-input type="textarea" :rows="5" placeholder="请输入参数备注" v-model="createForm.param_content" size="small"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="cancleForm">取 消</el-button>
          <el-button size="small" type="primary" @click="submitForm">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 分页区域,layout中的字符表示页面要显示的布局结构 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.num"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="queryInfo.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="count">
      </el-pagination>

    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        search: '',
        num: 1,
        size: 10
      },
      paramsList: [],
      count: 0,
      createFormVisible: false,
      // 创建任务的form
      createForm: {
        param_name: '',
        param_value: '',
        param_content: '',
        user: ''
      },
      methodType: 'create',
      paramId: '',
      // 校验必填参数
      createFormRules: {
        param_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ],
        param_value: [
          { required: true, message: '请输入参数值', trigger: 'blur' }
        ],
        param_content: [
          { required: true, message: '请输入参数备注', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getParamsList()
  },
  methods: {
    async getParamsList() {
      if (this.queryInfo.search !== '') {
        this.queryInfo.num = 1
        this.queryInfo.size = 10
      }
      const { data: res } = await this.$http.get('/params', {
        params: this.queryInfo
      })
      if (res.code !== 200) {
        return this.$message.error('获取参数列表失败')
      }
      this.paramsList = res.data.results
      this.count = res.data.count
      console.log(this.paramsList)
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.size = newSize
      // 每页显示条数发生变化后，重新请求数据
      this.getParamsList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.num = newPage
      // 页码发生变化后，重新请求获取数据
      this.getParamsList()
    },
    // 初始化创建对话框
    initForm() {
      this.createForm.param_name = ''
      this.createForm.param_value = ''
      this.createForm.param_content = ''
      setTimeout(() => {
        this.$refs.createFormRef.resetFields()
      })
      this.createFormVisible = true
    },
    // 取消对话框时的操作
    cancleForm() {
      this.createFormVisible = false
    },
    // 创建任务的提交事件
    async submitForm() {
      this.createForm.user = window.sessionStorage.getItem('userId')
      if (this.methodType === 'update') {
        this.editParams()
      }
      if (this.methodType === 'create') {
        this.createParam()
      }
    },
    async getParamDetail(paramId) {
      // 获取参数信息
      this.paramId = paramId
      this.methodType = 'update'
      const { data: detailRes } = await this.$http.get(`/params/details/${paramId}`)
      if (detailRes.code !== 200) {
        return this.$message.error(detailRes.msg)
      }
      this.createForm.param_name = detailRes.data.param_name
      this.createForm.param_value = detailRes.data.param_value
      this.createForm.param_content = detailRes.data.param_content
      this.createFormVisible = true
    },
    createParam() {
      this.$refs.createFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('/params/create', this.createForm)
        if (res.code !== 200) {
          return this.$message.error(res.msg)
        }
        this.createFormVisible = false
        this.getParamsList()
        return this.$message.success('创建成功！')
      })
    },
    // 修改参数
    editParams() {
      this.$refs.createFormRef.validate(async valid => {
        if (!valid) return
        // 修改参数
        const { data: editRes } = await this.$http.put(`/params/update/${this.paramId}`, this.createForm)
        if (editRes.code !== 200) {
          return this.$message.error(editRes.msg)
        }
        this.createFormVisible = false
        this.getParamsList()
        return this.$message.success('修改成功！')
      })
    },
    async deleteParam(paramId) {
      const { data: deleteRes } = await this.$http.delete(`/params/delete/${paramId}`)
      if (deleteRes.code !== 200) {
        return this.$message.error(deleteRes.msg)
      }
      this.getParamsList()
      return this.$message.success('删除成功')
    }
  }
}
</script>
