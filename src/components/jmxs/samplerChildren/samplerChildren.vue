<template>
  <!-- 用户列表区 -->
  <el-table :data="childrenList" border stripe style="margin-top: -21px;margin-left: -3px; margin-bottom: -21px">
    <el-table-column label="id" prop="id"/>
    <el-table-column label="子元素名称" prop="child_name"/>
    <el-table-column label="子元素类型" prop="child_type">
      <template slot-scope="scope">
        <span v-if="scope.row.child_type==='header'">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium" type="info">请求头</el-tag>
          </div>
        </span>
        <span v-if="scope.row.child_type==='rsp_assert'">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium" type="info">响应断言</el-tag>
          </div>
        </span>
        <span v-if="scope.row.child_type==='json_assert'">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium" type="info">JSON断言</el-tag>
          </div>
        </span>
        <span v-if="scope.row.child_type==='json_extract'">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium" type="info">JSON提取器</el-tag>
          </div>
        </span>
        <span v-if="scope.row.child_type==='pre_beanshell'">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium" type="info">前置BeanShell</el-tag>
          </div>
        </span>
        <span v-if="scope.row.child_type==='after_beanshell'">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium" type="info">后置BeanShell</el-tag>
          </div>
        </span>
        <span v-if="scope.row.child_type==='JSR223'">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium" type="info">JSR223</el-tag>
          </div>
        </span>
      </template>
    </el-table-column>
    <el-table-column label="创建时间" prop="add_time"></el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <editHeader ref="headerRef" @fatherFn="getSamplerChildren"/>
        <editRspAssert ref="rspAssertRef" @fatherFn="getSamplerChildren"/>
        <editJsonAssert ref="jsonAssertRef" @fatherFn="getSamplerChildren"/>
        <editJsonExtract ref="jsonExtractRef" @fatherFn="getSamplerChildren"/>
        <editAfterBeanShell ref="afterBeanShellRef" @fatherFn="getSamplerChildren"/>
        <editPreBeanShell ref="preBeanShellRef" @fatherFn="getSamplerChildren"/>
        <editPreBeanShell ref="preBeanShellRef" @fatherFn="getSamplerChildren"/>
        <editJSR223 ref="JSR223Ref" @fatherFn="getSamplerChildren"/>
        <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
          <el-button type="primary" @click="modifyChild(sampId, scope.row.id, scope.row.child_type)" size="small" class="myicon" icon="el-icon-edit" circle/>
        </el-tooltip>
        <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
          <!-- 删除存在一个bug，删除后，编辑其他子元素会报错，需要刷新整个页面，目前没有找到合适解决方法 -->
          <el-popconfirm title="确定是否删除子元素？" @onConfirm="deleteChild(sampId, scope.row.id)">
            <el-button style="margin-left: 10px" slot="reference" class="myicon" type="danger" size="small" icon="el-icon-delete" circle/>
          </el-popconfirm>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>

import editHeader from './editHeader'
import editRspAssert from './editRspAssert'
import editJsonAssert from './editJsonAssert'
import editJsonExtract from './editJsonExtract'
import editPreBeanShell from './editPreBeanShell'
import editAfterBeanShell from './editAfterBeanShell'
import editJSR223 from './editJSR223'

export default {
  data() {
    return {
      sampId: '',
      childrenList: []
    }
  },
  // props中为父组件传递过来的参数名称
  props: ['samplerId'],
  created() {
    this.getSamplerChildren()
  },
  components: {
    editHeader,
    editRspAssert,
    editJsonAssert,
    editJsonExtract,
    editPreBeanShell,
    editAfterBeanShell,
    editJSR223
  },
  methods: {
    async getSamplerChildren() {
      this.sampId = this.samplerId
      const { data: childrenRes } = await this.$http.get(`/samplers/children/${this.sampId}`)
      if (childrenRes.code !== 200) {
        return this.$message.error('获取列表失败')
      }
      this.childrenList = childrenRes.data
    },
    modifyChild(samplerId, childId, childType) {
      if (childType === 'json_extract') {
        this.$refs.jsonExtractRef.initForm(samplerId, childId)
      } else if (childType === 'after_beanshell') {
        this.$refs.afterBeanShellRef.initForm(samplerId, childId)
      } else if (childType === 'pre_beanshell') {
        this.$refs.preBeanShellRef.initForm(samplerId, childId)
      } else if (childType === 'header') {
        this.$refs.headerRef.initForm(samplerId, childId)
      } else if (childType === 'rsp_assert') {
        this.$refs.rspAssertRef.initForm(samplerId, childId)
      } else if (childType === 'json_assert') {
        this.$refs.jsonAssertRef.initForm(samplerId, childId)
      } else if (childType === 'JSR223') {
        this.$refs.JSR223Ref.initForm(samplerId, childId)
      }
    },
    async deleteChild(samplerId, childId) {
      const { data: deleteRes } = await this.$http.post(`/samplers/delete/${samplerId}/${childId}`)
      if (deleteRes.code !== 200) {
        return this.$message.error('删除子元素失败')
      }
      // 重新加载子元素列表
      // this.getSamplerChildren()
      window.location.reload()
      return this.$message.success('删除子元素成功')
    }
  }
}
</script>
