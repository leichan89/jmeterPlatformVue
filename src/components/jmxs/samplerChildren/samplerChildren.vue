<template>
  <!-- 用户列表区 -->
  <el-table :data="childrenList" border stripe style="margin-top: -21px;margin-left: -3px; margin-bottom: -21px">
    <el-table-column label="id" prop="id"></el-table-column>
    <el-table-column label="子元素名称" prop="child_name"></el-table-column>
    <el-table-column label="子元素类型" prop="child_type"></el-table-column>
    <el-table-column label="添加时间" prop="add_time"></el-table-column>
    <!--<el-table-column label="操作">-->
    <!--  <template slot-scope="scope">-->
    <!--    <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">-->
    <!--      <editSampler v-if="scope.row.child_type==='sampler'" :samplerId="scope.row.id"/>-->
    <!--    </el-tooltip>-->
    <!--  </template>-->
    <!--</el-table-column>-->
  </el-table>
</template>

<script>

export default {
  data() {
    return {
      childrenList: []
    }
  },
  props: ['samplerId'],
  created() {
    this.getSamplerChildren()
  },
  methods: {
    async getSamplerChildren() {
      const { data: childrenRes } = await this.$http.get(`/samplers/children/${this.samplerId}`)
      if (childrenRes.code !== 200) {
        return this.$message.error('获取列表失败')
      }
      this.childrenList = childrenRes.data
    }
  }
}
</script>
