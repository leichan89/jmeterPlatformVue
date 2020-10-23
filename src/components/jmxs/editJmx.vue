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
      <!-- 搜索与添加区域 -->
      <!-- gutter设置栅格的间距 -->
      <el-row :gutter="80">
        <el-col :span="4">
          <el-select v-model="queryInfo.child_thread" size="small" style="width:180px" @change="getThreadGroupChildren">
            <el-option
              v-for="item in threadTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="queryInfo.child_type" size="small" style="width:180px" @change="getThreadGroupChildren">
            <el-option
              v-for="item in threadChildrenTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <createSampler/>
        </el-col>
        <el-col :span="2">
          <uploadCsv/>
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <el-table :data="childrenList" border stripe>
        <el-table-column label="id" prop="id"></el-table-column>
        <el-table-column label="线程组子元素名称" prop="child_name"></el-table-column>
        <el-table-column label="创建时间" prop="add_time"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false" v-if="scope.row.child_type === 'sampler'">
              <editSampler :samplerId="scope.row.id"/>
            </el-tooltip>
            <!--<el-tooltip effect="dark" content="运行" placement="top" :enterable="false">-->
            <!--  <el-button type="success" class="myicon" size="small" icon="el-icon-video-play" circle @click="runJmx(scope.row)"></el-button>-->
            <!--</el-tooltip>-->
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>

import createSampler from './createSampler'
import uploadCsv from './uploadCsv'
import editSampler from './editSampler'

export default {
  data() {
    return {
      jmxId: '',
      threadTypeOptions: [
        {
          value: 'setup',
          label: 'setup线程组'
        },
        {
          value: 'thread',
          label: 'thread线程组'
        },
        {
          value: 'teardown',
          label: 'teardown线程组'
        }
      ],
      threadChildrenTypeOptions: [
        {
          value: 'sampler',
          label: 'HTTP请求'
        },
        {
          value: 'csv',
          label: 'csv文件'
        }
      ],
      queryInfo: {
        child_thread: 'thread',
        child_type: 'sampler'
      },
      childrenList: []
    }
  },
  components: {
    createSampler,
    uploadCsv,
    editSampler
  },
  // 页面加载前调用
  created() {
    this.jmxId = window.sessionStorage.getItem('jmxId')
    this.getThreadGroupChildren()
  },
  methods: {
    async getThreadGroupChildren() {
      const { data: res } = await this.$http.get(`jmxs/thread_group_children/${this.jmxId}`, {
        params: this.queryInfo
      })
      if (res.code !== 200) {
        return this.$message.error('获取列表失败')
      }
      this.childrenList = res.data
    }
  }
}
</script>
