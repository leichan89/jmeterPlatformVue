<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>JMX管理</el-breadcrumb-item>
      <el-breadcrumb-item>JMX列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <!-- gutter设置栅格的间距 -->
      <el-row :gutter="40">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.search" clearable @clear="getJmxsList">
            <el-button slot="append" icon="el-icon-search" @click="getJmxsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="initForm">上传</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary">新建</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区 -->
      <el-table :data="jmxsList" border stripe>
        <el-table-column label="文件id" prop="id"></el-table-column>
        <el-table-column label="JMX名称" prop="jmx_alias"></el-table-column>
        <el-table-column label="上传人" prop="add_user.name"></el-table-column>
        <el-table-column label="上传时间" prop="add_time"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="添加到任务" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-connection" circle size="small" @click="addToTask(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="运行" placement="top" :enterable="false">
              <el-button type="success" size="small" icon="el-icon-video-play" circle @click="runJmx(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 上传文件对话框 -->
      <el-dialog title="上传JMX文件" :visible.sync="uploadFormVisible" width="30%">
        <el-form :model="uploadForm" label-width="75px" class="demo-ruleForm">
          <el-form-item label="文件别名:">
            <el-input v-model="uploadForm.jmx_name"></el-input>
          </el-form-item>
          <!-- action必填，不然会告警 -->
          <el-form-item label="上传文件:">
            <el-upload
              class="upload-demo"
              ref="upload"
              action=""
              :file-list="fileList"
              :with-credentials="true"
              :limit="5"
              :auto-upload="false"
              :http-request="uploadSectionFile"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="cancleForm">取 消</el-button>
          <el-button size="small" type="primary" @click="submitForm">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 添加到任务对话框 -->
      <el-dialog title="添加到任务" :visible.sync="toTaskFormVisible" width="27%">
        <el-form :model="toTaskForm" label-width="100px">
          <el-form-item label="选择任务">
            <el-select v-model="toTaskForm.task" filterable :filter-method="taskFilter" clearable placeholder="请选择任务">
              <el-option v-for="item in tasksList" :key="item.id" :label="item.task_name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="toTaskFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="bindSubmit">确 定</el-button>
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
      jmxsList: [],
      count: 0,
      // 上传对话框的可视化参数
      uploadFormVisible: false,
      // 上传的jmx文件的别名
      uploadForm: {
        jmx_name: ''
      },
      // 记录上传文件信息的列表，主要包含文件路径，名称，大小等信息
      fileList: [],
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
  created() {
    this.getJmxsList()
  },
  methods: {
    async getJmxsList() {
      const { data: res } = await this.$http.get('jmxs', {
        params: this.queryInfo
      })
      if (res.code !== 200) {
        return this.$message.error('获取JMX列表失败')
      }
      this.jmxsList = res.data.results
      this.count = res.data.count
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      console.log(newSize)
      this.queryInfo.size = newSize
      // 每页显示条数发生变化后，重新请求数据
      this.getJmxsList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.num = newPage
      // 页码发生变化后，重新请求获取数据
      this.getJmxsList()
    },
    // 上传对话框初始化操作，需要清除输入框和上传列表数据
    initForm() {
      this.uploadFormVisible = true
      this.uploadForm = {}
      this.fileList = []
    },
    // 上传对话框点击取消时的操作，清除输入框和上传列表数据
    cancleForm() {
      this.uploadFormVisible = false
      this.uploadForm = {}
      this.fileList = []
    },
    // 上传文件，使用form-data上传，需要自己获取到文件流
    async uploadSectionFile(param) {
      const fo = param.file
      const form = new FormData()
      form.append('jmx', fo)
      form.append('jmx_name', this.uploadForm.jmx_name)
      form.append('add_user', window.sessionStorage.getItem('userId'))
      const config = { headers: { 'Content-Type': 'multipart/form-data' } }
      const { data: res } = await this.$http.post('jmxs/upload', form, config)
      if (res.code !== 200) {
        return this.$message.error('上传失败')
      }
      // 上传完成后，刷新任务列表
      this.getJmxsList()
    },
    // 上传文件的提交操作，先上传，再关闭对话框
    submitForm() {
      this.$refs.upload.submit()
      this.uploadFormVisible = false
    },
    // 获取任务列表，将搜索结果放到一个list中，便于使用过滤器过滤
    async getTasksList() {
      const { data: res } = await this.$http.get('tasks?size=1000')
      if (res.code !== 200) {
        return this.$message.error('获取任务列表失败')
      }
      this.allTasksList = res.data.results
    },
    // 下拉搜索框中通过输入的方式搜索任务
    taskFilter(query = '') {
      const arr = this.allTasksList.filter((item) => {
        return item.task_name.includes(query)
      })
      if (arr.length > 50) {
        this.tasksList = arr.slice(0, 50)
      } else {
        this.tasksList = arr
      }
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
