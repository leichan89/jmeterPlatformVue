<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>JMX管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/jmxs' }">JMX列表</el-breadcrumb-item>
      <el-breadcrumb-item>编辑JMX</el-breadcrumb-item>
    </el-breadcrumb>

    <el-dialog :visible.sync="vi" title="JSON提取器">
      <span slot="footer" class="dialog-footer">
        <el-button size="small">取 消</el-button>
        <el-button type="primary" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <!-- gutter设置栅格的间距 -->
      <el-row :gutter="10">
        <el-col :span="4">
          <!-- 注意使用style拉满100%的作用，配合span=10使用才能正确使用span -->
          <el-select v-model="queryInfo.child_thread" size="small" style="width:100%" @change="getThreadGroupChildren">
            <el-option
              v-for="item in threadTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="queryInfo.child_type" size="small" style="width:100%" @change="getThreadGroupChildren">
            <el-option
              v-for="item in threadChildrenTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="1.5">
          <createSampler @fatherFunc="getThreadGroupChildren"/>
        </el-col>
        <el-col :span="2">
          <!-- fatherFunc名称是自己定义的，可以随便写 -->
          <uploadCsv @fatherFunc="getThreadGroupChildren"/>
        </el-col>
      </el-row>
      <!-- 用户列表区，可以展开单行 -->
      <el-table :data="childrenList"
                border
                stripe
                @expand-change="exChange"
                :row-key='getRowKeys'
                :expand-row-keys="expands">
        <!-- 展开行按钮 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 是sampler才需要展开 -->
            <!-- :key="refreshTarget"表示可以强制刷新子组件 -->
            <samplerChildren v-if="isEx && scope.row.child_type === 'sampler'" :samplerId="scope.row.id" :key="refreshTarget"/>
          </template>
        </el-table-column>
        <el-table-column label="id" prop="id"/>
        <el-table-column label="线程组子元素名称" prop="child_name"/>
        <el-table-column label="创建时间" prop="add_time"/>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <editSampler v-if="scope.row.child_type === 'sampler'" :samplerId="scope.row.id" @fatherFunc="getThreadGroupChildren"/>
              <editCsv v-if="scope.row.child_type === 'csv'" :csvId="scope.row.id" @fatherFunc="getThreadGroupChildren"/>
            </el-tooltip>
            <!-- 是sampler才需要有创建的按钮 -->
            <el-dropdown style="margin-left: 10px" @command="addChild" v-if="scope.row.child_type === 'sampler'">
              <el-button type="info" class="myicon" size="small" icon="el-icon-set-up" circle/>
              <editHeader ref="headerRef" :refreshTarget.sync="refreshTarget"/>
              <editRspAssert ref="rspAssertRef" :refreshTarget.sync="refreshTarget"/>
              <editJsonAssert ref="jsonAssertRef" :refreshTarget.sync="refreshTarget"/>
              <editJsonExtract ref="jsonExtractRef" :refreshTarget.sync="refreshTarget"/>
              <editAfterBeanShell ref="afterBeanShellRef" :refreshTarget.sync="refreshTarget"/>
              <editPreBeanShell ref="preBeanShellRef" :refreshTarget.sync="refreshTarget"/>
              <editJSR223 ref="JSR223Ref" :refreshTarget.sync="refreshTarget"/>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{samplerId: scope.row.id, childType: 'header'}">添加请求头</el-dropdown-item>
                <el-dropdown-item :command="{samplerId: scope.row.id, childType: 'JSR223'}">添加JSR223</el-dropdown-item>
                <el-dropdown-item :command="{samplerId: scope.row.id, childType: 'rsp_assert'}">添加响应断言</el-dropdown-item>
                <el-dropdown-item :command="{samplerId: scope.row.id, childType: 'json_assert'}">添加JSON断言</el-dropdown-item>
                <el-dropdown-item :command="{samplerId: scope.row.id, childType: 'json_extract'}">添加JSON提取器</el-dropdown-item>
                <el-dropdown-item :command="{samplerId: scope.row.id, childType: 'after_beanshell'}">添加后置BeanShell</el-dropdown-item>
                <el-dropdown-item :command="{samplerId: scope.row.id, childType: 'pre_beanshell'}">添加前置BeanShell</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-popconfirm title="确定是否删除子元素？" @onConfirm="deleteChild(scope.row.id)">
                <el-button slot="reference" class="myicon" type="danger" size="small" icon="el-icon-delete" circle/>
              </el-popconfirm>
            </el-tooltip>
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
import samplerChildren from './samplerChildren/samplerChildren'
import editHeader from './samplerChildren/editHeader'
import editRspAssert from './samplerChildren/editRspAssert'
import editJsonAssert from './samplerChildren/editJsonAssert'
import editJsonExtract from './samplerChildren/editJsonExtract'
import editAfterBeanShell from './samplerChildren/editAfterBeanShell'
import editPreBeanShell from './samplerChildren/editPreBeanShell'
import editJSR223 from './samplerChildren/editJSR223'
import editCsv from './editCsv'

export default {
  data() {
    return {
      isEx: false,
      expands: [],
      jmxId: '',
      refreshTarget: '',
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
      childrenList: [],
      vi: false
    }
  },
  components: {
    createSampler,
    uploadCsv,
    editCsv,
    editSampler,
    samplerChildren,
    editHeader,
    editRspAssert,
    editJsonAssert,
    editJsonExtract,
    editAfterBeanShell,
    editPreBeanShell,
    editJSR223
  },
  // 页面加载前调用
  created() {
    this.jmxId = window.sessionStorage.getItem('jmxId')
    this.getThreadGroupChildren()
  },
  methods: {
    async getThreadGroupChildren() {
      const { data: res } = await this.$http.get(`/jmxs/children/${this.jmxId}`, {
        params: this.queryInfo
      })
      if (res.code !== 200) {
        return this.$message.error('获取列表失败')
      }
      this.childrenList = res.data
    },
    getRowKeys(row) {
      return row.id
    },
    exChange(row, rowList) {
      const that = this
      if (rowList.length) {
        that.expands = []
        if (row) {
          that.expands.push(row.id)
        } else {
          that.expands = []
        }
      }
      // 在只展开一个后，当rowList为0就是收起，为0时就可以不发起请求
      if (rowList.length) {
        this.isEx = true
      }
    },
    addChild(command) {
      const childType = command.childType
      const samplerId = command.samplerId
      if (childType === 'json_extract') {
        this.$refs.jsonExtractRef.initForm(samplerId)
      } else if (childType === 'after_beanshell') {
        this.$refs.afterBeanShellRef.initForm(samplerId)
      } else if (childType === 'pre_beanshell') {
        this.$refs.preBeanShellRef.initForm(samplerId)
      } else if (childType === 'header') {
        this.$refs.headerRef.initForm(samplerId)
      } else if (childType === 'rsp_assert') {
        this.$refs.rspAssertRef.initForm(samplerId)
      } else if (childType === 'json_assert') {
        this.$refs.jsonAssertRef.initForm(samplerId)
      } else if (childType === 'JSR223') {
        this.$refs.JSR223Ref.initForm(samplerId)
      }
    },
    async deleteChild(childId) {
      const { data: deleteRes } = await this.$http.post(`/jmxs/child/delete/${childId}`)
      if (deleteRes.code !== 200) {
        return this.$message.error('删除失败')
      }
      this.getThreadGroupChildren()
      return this.$message.success('删除成功')
    }
  }
}
</script>
