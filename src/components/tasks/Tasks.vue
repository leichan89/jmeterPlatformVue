<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>任务管理</el-breadcrumb-item>
      <el-breadcrumb-item>任务列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <!-- gutter设置栅格的间距 -->
      <el-row :gutter="40">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.search" clearable @clear="getTasksList">
            <el-button slot="append" icon="el-icon-search" @click="getTasksList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="initForm">新建</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区 -->
      <el-table :data="tasksList" border stripe>
        <el-table-column label="任务id" prop="id"></el-table-column>
        <el-table-column label="任务名称" prop="task_name"></el-table-column>
        <el-table-column label="上传人" prop="add_user.name"></el-table-column>
        <el-table-column label="创建时间" prop="add_time"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="运行任务" placement="top" :enterable="false">
              <el-button class="myicon" type="success" size="small" icon="el-icon-video-play" circle @click="runTask(scope.row)"/>
            </el-tooltip>
            <el-tooltip effect="dark" content="任务详情" placement="top" :enterable="false">
              <el-button class="myicon" type="primary" size="small" icon="el-icon-s-order" circle @click="getTaskDetail(scope.row.id)"/>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除任务" placement="top" :enterable="false">
              <el-popconfirm title="确定是否删除任务？" @onConfirm="deleteTask(scope.row.id)">
                <el-button style="margin-left: 10px" slot="reference" class="myicon" type="danger" size="small" icon="el-icon-delete" circle/>
              </el-popconfirm>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 创建任务对话框 -->
      <el-dialog title="新建任务" :visible.sync="createFormVisible" width="30%">
        <el-form :model="createForm" label-width="75px" class="demo-ruleForm">
          <el-form-item label="任务名称:">
            <el-input v-model="createForm.task_name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="cancleForm">取 消</el-button>
          <el-button size="small" type="primary" @click="submitForm">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 任务详情对话框 -->
      <el-dialog title="任务详情" :visible.sync="viewTaskDetailDialogVisible" width="60%">
        <el-table :data="taskDetail" style="width: 100%">
          <!-- 使用min-width自适应列的宽度 -->
          <el-table-column prop="id" label="id" min-width="10%"/>
          <el-table-column prop="jmx.jmx_alias" label="JMX名称" min-width="50%"/>
          <el-table-column prop="add_time" label="添加时间" min-width="30%"/>
          <el-table-column label="操作" min-width="10%">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                <el-popconfirm title="确定是否删除任务？" @onConfirm="taskDeleteJmx(scope.row.id)">
                  <el-button style="margin-left: -5px" slot="reference" class="myicon" type="danger" size="small" icon="el-icon-delete" circle/>
                </el-popconfirm>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 底部区域，点击取消关闭 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="viewTaskDetailDialogVisible = false">取 消</el-button>
      </span>
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
      tasksList: [],
      count: 0,
      createFormVisible: false,
      // 创建任务的form
      createForm: {
        task_name: '',
        add_user: ''
      },
      viewTaskDetailDialogVisible: false,
      taskDetail: [],
      tempTaskId: ''
    }
  },
  created() {
    this.getTasksList()
  },
  methods: {
    async getTasksList() {
      if (this.queryInfo.search !== '') {
        this.queryInfo.num = 1
        this.queryInfo.size = 10
      }
      const { data: res } = await this.$http.get('tasks', {
        params: this.queryInfo
      })
      if (res.code !== 200) {
        return this.$message.error('获取任务列表失败')
      }
      this.tasksList = res.data.results
      this.count = res.data.count
      console.log(this.tasksList)
    },
    // 运行任务的事件
    async runTask(taskInfo) {
      const { data: res } = await this.$http.post(`tasks/run/${taskInfo.id}`)
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      return this.$message.success('运行成功！')
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.size = newSize
      // 每页显示条数发生变化后，重新请求数据
      this.getTasksList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.num = newPage
      // 页码发生变化后，重新请求获取数据
      this.getTasksList()
    },
    // 初始化创建对话框
    initForm() {
      this.createFormVisible = true
    },
    // 取消对话框时的操作
    cancleForm() {
      this.createFormVisible = false
    },
    // 创建任务的提交事件
    async submitForm() {
      this.createForm.add_user = window.sessionStorage.getItem('userId')
      const { data: res } = await this.$http.post('tasks/create', this.createForm)
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.createFormVisible = false
      this.getTasksList()
      return this.$message.success('创建成功！')
    },
    async getTaskDetail(taskId) {
      const { data: detailRes } = await this.$http.get(`/tasks/details/${taskId}`)
      if (detailRes.code !== 200) {
        return this.$message.error(detailRes.msg)
      }
      this.taskDetail = detailRes.data
      this.tempTaskId = taskId
      this.viewTaskDetailDialogVisible = true
    },
    async taskDeleteJmx(jmxId) {
      const { data: deleteRes } = await this.$http.delete(`/tasks/deletejmx/${jmxId}`)
      if (deleteRes.code !== 200) {
        return this.$message.error(deleteRes.msg)
      }
      this.getTaskDetail(this.tempTaskId)
      return this.$message.success('删除成功')
    },
    async deleteTask(taskId) {
      const { data: deleteRes } = await this.$http.delete(`/tasks/delete/${taskId}`)
      if (deleteRes.code !== 200) {
        return this.$message.error(deleteRes.msg)
      }
      this.getTasksList()
      return this.$message.success('删除成功')
    }
  }
}
</script>
