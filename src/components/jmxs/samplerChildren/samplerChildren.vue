<template>
  <!-- 用户列表区 -->
  <el-table :data="childrenList" border stripe style="margin-top: -21px;margin-left: -3px; margin-bottom: -21px">
    <el-table-column label="id" prop="id"></el-table-column>
    <el-table-column label="子元素名称" prop="child_name"></el-table-column>
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
      </template>
    </el-table-column>
    <el-table-column label="添加时间" prop="add_time"></el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
          <editHeader v-if="scope.row.child_type==='header'" :childId="scope.row.id" :sampId="sampId"/>
        </el-tooltip>
        <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
          <editRspAssert v-if="scope.row.child_type==='rsp_assert'" :childId="scope.row.id" :sampId="sampId"/>
        </el-tooltip>
        <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
          <editJsonExtract v-if="scope.row.child_type==='json_extract'" :childId="scope.row.id" :sampId="sampId"/>
        </el-tooltip>
        <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
          <editPreBeanShell v-if="scope.row.child_type==='pre_beanshell'" :childId="scope.row.id" :sampId="sampId"/>
        </el-tooltip>
        <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
          <editAfterBeanShell v-if="scope.row.child_type==='after_beanshell'" :childId="scope.row.id" :sampId="sampId"/>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>

import editHeader from './editHeader'
import editRspAssert from './editRspAssert'
import editJsonExtract from './editJsonExtract'
import editPreBeanShell from './editPreBeanShell'
import editAfterBeanShell from './editAfterBeanShell'

export default {
  data() {
    return {
      sampId: '',
      childrenList: []
    }
  },
  props: ['samplerId'],
  created() {
    this.getSamplerChildren()
  },
  components: {
    editHeader,
    editRspAssert,
    editJsonExtract,
    editPreBeanShell,
    editAfterBeanShell
  },
  methods: {
    async getSamplerChildren() {
      this.sampId = this.samplerId
      const { data: childrenRes } = await this.$http.get(`/samplers/children/${this.sampId}`)
      if (childrenRes.code !== 200) {
        return this.$message.error('获取列表失败')
      }
      this.childrenList = childrenRes.data
    }
  }
}
</script>
