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
      <el-row :gutter="10">
        <el-col :span="10">
          <!-- 注意使用style拉满100%的作用，配合span=10使用才能正确使用span -->
          <el-input placeholder="请输入内容" v-model="queryInfo.search" clearable @clear="getJmxsList" style="width: 100%">
            <el-button slot="append" icon="el-icon-search" @click="getJmxsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="1.5">
          <!-- fatherFunc名称是自己定义的，可以随便写 -->
          <!-- 子类调用父类的方法：this.$emit('fatherFunc') -->
          <createJmx @fatherFunc="getJmxsList"/>
        </el-col>
        <el-col :span="2">
          <uploadJmx @fatherFunc="getJmxsList"/>
        </el-col>
      </el-row>

      <!-- 用户列表区 -->
      <el-table :data="jmxsList" border stripe>
        <el-table-column label="JMX名称" prop="jmx_alias"/>
        <el-table-column label="创建人" prop="add_user.name"/>
        <el-table-column label="创建时间" prop="add_time"/>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="运行" placement="top" :enterable="false">
              <el-button type="success" class="myicon" size="small" icon="el-icon-video-play" circle @click="runJmx(scope.row)"/>
            </el-tooltip>
            <el-tooltip effect="dark" content="修改线程组属性" placement="top" :enterable="false">
              <editThreadNum :jmxId="scope.row.id" @fatherFn="getJmxsList"/>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-popconfirm title="确定是否删除JMX？" @onConfirm="deleteJmx(scope.row.id)">
                <el-button slot="reference" class="myicon" type="danger" size="small" icon="el-icon-delete" circle/>
              </el-popconfirm>
            </el-tooltip>
            <el-dropdown @command="moreOperate">
              <el-button style="margin-left: 10px" type="warning" class="myicon" size="small" icon="el-icon-set-up" circle/>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{jmxId: scope.row.id, operateType: 'edit'}">编辑JMX</el-dropdown-item>
                <el-dropdown-item :command="{jmxId: scope.row.id, operateType: 'copy'}">复制JMX</el-dropdown-item>
                <el-dropdown-item :command="{jmxId: scope.row.id, operateType: 'bind'}">绑定任务</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
          <el-button @click="toTaskFormVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="bindSubmit" size="small">确 定</el-button>
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

import createJmx from './createJmx.vue'
import uploadJmx from './uploadJmx.vue'
import editThreadNum from './editThreadNum.vue'
import cookie from 'js-cookie'

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
  // 引用的组件
  components: {
    createJmx,
    uploadJmx,
    editThreadNum
  },
  // 页面加载前调用
  created() {
    this.getJmxsList()
  },
  methods: {
    async getJmxsList() {
      if (this.queryInfo.search !== '') {
        this.queryInfo.num = 1
        this.queryInfo.size = 10
      }
      const { data: res } = await this.$http.get('/jmxs', {
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
      this.queryInfo.size = newSize
      // 每页显示条数发生变化后，重新请求数据
      this.getJmxsList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.num = newPage
      // 页码发生变化后，重新请求获取数据
      this.getJmxsList()
    },
    // 获取任务列表，将搜索结果放到一个list中，便于使用过滤器过滤
    async getTasksList() {
      const { data: res } = await this.$http.get('/tasks?size=1000')
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
    addToTask(jmxId) {
      this.toTaskFormVisible = true
      this.getTasksList()
      this.toTaskForm.jmx = jmxId
    },
    // 绑定事件提交按钮
    async bindSubmit() {
      const { data: res } = await this.$http.post('/tasks/bindjmxs', this.toTaskForm)
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.toTaskFormVisible = false
      return this.$message.success('添加到任务成功！')
    },
    // 运行任务的事件
    async runJmx(jmxInfo) {
      const userId = cookie.get('userId')
      const { data: res } = await this.$http.post(`/tasks/runjmx/${userId}/${jmxInfo.id}`)
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      return this.$message.success('运行成功！')
    },
    // 跳转到编辑页面
    editJmx(jmxId) {
      window.sessionStorage.setItem('jmxId', jmxId)
      this.$router.push({
        // 这个名字和router/index.js中的路由的名称一致
        name: 'editJmx',
        // 传值到另外一个组件，获取方式：this.$route.params.id
        params: {
          id: jmxId
        }
      })
    },
    // 删除JMX
    async deleteJmx(jmxId) {
      const { data: deleteRes } = await this.$http.post(`/jmxs/delete/${jmxId}`)
      if (deleteRes.code !== 200) {
        return this.$message.error(deleteRes.msg)
      }
      // 刷新列表
      this.getJmxsList()
      return this.$message.success('删除成功！')
    },
    async copyJmx(jmxId) {
      const postData = { jmxId: jmxId, userId: cookie.get('userId') }
      const { data: copyRes } = await this.$http.post('/jmxs/copy', postData)
      if (copyRes.code !== 200) {
        return this.$message.error(copyRes.msg)
      }
      // 刷新列表
      this.getJmxsList()
      return this.$message.success('复制成功！')
    },
    moreOperate(command) {
      const operateType = command.operateType
      const jmxId = command.jmxId
      if (operateType === 'edit') {
        this.editJmx(jmxId)
      } else if (operateType === 'bind') {
        this.addToTask(jmxId)
      } else if (operateType === 'copy') {
        this.copyJmx(jmxId)
      }
    }
  }
}
</script>
