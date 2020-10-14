<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>任务管理</el-breadcrumb-item>
      <el-breadcrumb-item>流水列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <!-- gutter设置栅格的间距 -->
      <el-row :gutter="40">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.search" clearable @clear="getTaskFlowsList">
            <el-button slot="append" icon="el-icon-search" @click="getTaskFlowsList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 用户列表区 -->
      <el-table :data="taskFlowsList" border stripe>
        <el-table-column label="任务名称" prop="task.task_name"></el-table-column>
        <el-table-column label="流水号" prop="celery_task_id"></el-table-column>
        <el-table-column label="状态" prop="task_status">
          <template slot-scope="scope">
            <span v-if="scope.row.task_status==0" :style="{'color': '#3CB371'}">运行中</span>
            <span v-if="scope.row.task_status==1" :style="{'color': '#FF8C00'}">已停止</span>
            <span v-if="scope.row.task_status==2" :style="{'color': '#FF0000'}">运行异常</span>
            <span v-if="scope.row.task_status==3" :style="{'color': '#008ecf'}">已结束</span>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" prop="add_time"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="停止" placement="top" :enterable="false">
              <!-- 使用v-if的原因是，如果使用v-show会出图标错位 -->
              <el-button class="myicon" v-if="scope.row.task_status==0" type="danger" icon="el-icon-close" circle size="small" @click="killTask(scope.row)"/>
            </el-tooltip>
            <el-tooltip v-if="scope.row.task_status==0" effect="dark" content="Grafana实时监控" placement="top" :enterable="false">
              <el-button class="myicon" type="success" icon="el-icon-monitor" circle size="small" @click="goGrafana(scope.row)"/>
            </el-tooltip>
            <el-tooltip effect="dark" content="查看汇总报告" placement="top" :enterable="false">
              <el-button class="myicon" v-if="scope.row.task_status==3" type="primary" icon="el-icon-s-data" circle size="small" @click="getAggregateReport(scope.row)"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

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

      <!-- 查看聚合报告的对话框 -->
      <el-dialog title="聚合报告" :visible.sync="viewResultsDialogVisible" width="85%">
        <el-table :data="flowSummaryReport" style="width: 100%">
          <!-- 使用min-width自适应列的宽度 -->
          <el-table-column prop="label" label="Label" min-width="20%"></el-table-column>
          <el-table-column prop="samplers" label="#样本" min-width="6%"></el-table-column>
          <el-table-column prop="average_req" label="平均值" min-width="7%"></el-table-column>
          <el-table-column prop="median_req" label="中位数" min-width="7%"></el-table-column>
          <el-table-column prop="line90_req" label="90%百分比" min-width="8%"></el-table-column>
          <el-table-column prop="line95_req" label="95%百分比" min-width="8%"></el-table-column>
          <el-table-column prop="line99_req" label="99%百分比" min-width="8%"></el-table-column>
          <el-table-column prop="min_req" label="最小值" min-width="7%"></el-table-column>
          <el-table-column prop="max_req" label="最大值" min-width="7%"></el-table-column>
          <el-table-column prop="error_rate" label="异常%" min-width="7%"></el-table-column>
          <el-table-column prop="tps" label="吞吐量" min-width="7%"></el-table-column>
          <el-table-column prop="recieved_per" label="接收KB/s" min-width="8%"></el-table-column>
        </el-table>
        <!-- 底部区域，点击取消关闭 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="viewResultsDialogVisible = false">取 消</el-button>
      </span>
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
      taskFlowsList: [],
      count: 0,
      viewResultsDialogVisible: false,
      flowSummaryReport: []
    }
  },
  created() {
    this.getTaskFlowsList()
  },
  methods: {
    // 获取任务流水的方法
    async getTaskFlowsList() {
      const { data: res } = await this.$http.get('tasks/flows', {
        params: this.queryInfo
      })
      if (res.code !== 200) {
        return this.$message.error('获取任务流水列表失败')
      }
      this.taskFlowsList = res.data.results
      this.count = res.data.count
    },
    // 停止任务
    async killTask(flowInfo) {
      const { data: res } = await this.$http.post(`tasks/kill/${flowInfo.id}`)
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.$message.success('停止任务成功！')
    },
    // 新开页面跳转到grafana
    goGrafana(flowInfo) {
      window.open(flowInfo.task_flow_url, '_blank')
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      console.log(newSize)
      this.queryInfo.size = newSize
      // 每页显示条数发生变化后，重新请求数据
      this.getTaskFlowsList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.num = newPage
      // 页码发生变化后，重新请求获取数据
      this.getTaskFlowsList()
    },
    // 获取聚合报告的方法
    async getAggregateReport(flowInfo) {
      const { data: res } = await this.$http.get(`tasks/queryAggregateReport/${flowInfo.id}`)
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.flowSummaryReport = res.data
      this.viewResultsDialogVisible = true
    }
  }
}
</script>
