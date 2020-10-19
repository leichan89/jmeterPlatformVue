<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>JMX管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/jmxs' }">JMX列表</el-breadcrumb-item>
      <el-breadcrumb-item>编辑JMX</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <!-- 用户列表区 -->
      <el-table :data="jmxsList" border stripe>
        <el-table-column label="文件id" prop="id"></el-table-column>
        <el-table-column label="JMX名称" prop="jmx_alias"></el-table-column>
        <el-table-column label="上传人" prop="add_user.name"></el-table-column>
        <el-table-column label="上传时间" prop="add_time"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="添加到任务" placement="top" :enterable="false">
              <el-button type="primary" class="myicon" icon="el-icon-connection" circle size="small" @click="addToTask(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="运行" placement="top" :enterable="false">
              <el-button type="success" class="myicon" size="small" icon="el-icon-video-play" circle @click="runJmx(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加到任务对话框 -->
      <el-dialog title="添加到任务" :visible.sync="toTaskFormVisible" width="30%">
        <el-form :model="toTaskForm">
          <el-form-item label="选择任务">
            <el-select v-model="toTaskForm.task" filterable :filter-method="taskFilter" clearable size="small" placeholder="请输入任务名称" style="width: 80%;">
              <el-option v-for="item in tasksList" :key="item.id" :label="item.task_name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="toTaskFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="bindSubmit">确 定</el-button>
        </div>
      </el-dialog>
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
      jmxsList: [],
      count: 0,
      // 新建任务的对话框的可视化参数
      toTaskFormVisible: false,
      // 绑定到任务的表单
      toTaskForm: {
        jmx: '',
        task: ''
      },
      // 获取到的所有task的信息
      allTasksList: [],
      tasksList: []
    }
  },
  // 页面加载前调用
  created() {
    this.getJmxsList()
  },
  methods: {
    async getJmxsList() {
      console.log(this.$route.params.id)
      const { data: res } = await this.$http.get('jmxs', {
        params: this.queryInfo
      })
      if (res.code !== 200) {
        return this.$message.error('获取JMX列表失败')
      }
      this.jmxsList = res.data.results
      this.count = res.data.count
    },
    // 获取任务列表，将搜索结果放到一个list中，便于使用过滤器过滤
    async getTasksList() {
      const { data: res } = await this.$http.get('tasks?size=1000')
      if (res.code !== 200) {
        return this.$message.error('获取任务列表失败')
      }
      this.allTasksList = res.data.results
    },
    // 添加到任务的按钮绑定的事件
    addToTask(jmxInfo) {
      this.toTaskFormVisible = true
      this.getTasksList()
      this.toTaskForm.jmx = jmxInfo.id
    },
    // 绑定事件提交按钮
    async bindSubmit() {
      const { data: res } = await this.$http.post('tasks/bindjmxs', this.toTaskForm)
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.toTaskFormVisible = false
      return this.$message.success('添加到任务成功！')
    },
    // 运行任务的事件
    async runJmx(jmxInfo) {
      const userId = window.sessionStorage.getItem('userId')
      const { data: res } = await this.$http.post(`tasks/runjmx/${userId}/${jmxInfo.id}`)
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      return this.$message.success('运行成功！')
    }
  }
}
</script>
