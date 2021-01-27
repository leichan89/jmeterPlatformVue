<template>
  <span style="margin-left: 10px;margin-right: 10px">
    <el-button type="info" @click="initForm" size="small" class="myicon" icon="el-icon-tickets" circle/>
    <el-dialog title="修改JMX属性" :visible.sync="eidtThreadNumVisible" width="25%">
      <el-form ref="editThreadNumFormRef" :model="threadNumFormData" status-icon size="small" label-width="80px" :rules="editThreadNumFormRules">
        <el-form-item label="JMX名称" prop="jmxAlias">
          <el-input v-model="threadNumFormData.jmxAlias" placeholder="JMX名称" size="small"/>
        </el-form-item>
        <el-form-item label="线程组数" prop="numThreads">
          <el-input v-model="threadNumFormData.numThreads" maxLength="9" placeholder="线程组数" size="small"/>
        </el-form-item>
        <el-form-item label="RampUp" prop="rampTime">
          <el-input v-model="threadNumFormData.rampTime" maxLength="9" placeholder="Ramp-Up时间（单位s）" size="small"/>
        </el-form-item>
        <el-form-item label="循环次数" prop="loops">
          <el-input v-model="threadNumFormData.loops" placeholder="循环次数为正整数或-1，-1为永久循环" maxLength="9" size="small"/>
        </el-form-item>
        <el-form-item label="调度器">
          <el-select v-model="threadNumFormData.scheduler" size="small" style="width:100%">
            <el-option
              v-for="item in threadNumOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="持续时间" prop="duration">
          <el-input v-model="threadNumFormData.duration" placeholder="持续时间（单位s）" maxLength="9" size="small" :disabled="threadNumFormData.scheduler==='false'"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="eidtThreadNumVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submit" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
export default {
  data() {
    const validateNumber = (rule, value, callback) => {
      if (/^[0]/g.test(value)) {
        callback(new Error('不能为0'))
      } else if (value.length === 0) {
        callback(new Error('长度不能为空'))
      } else if (/[^0-9]/g.test(value)) {
        callback(new Error('只能输入数字'))
      } else {
        callback()
      }
    }
    const validateLoops = (rule, value, callback) => {
      if (value === '-1') {
        callback()
      } else if (value.length === 0) {
        callback(new Error('长度不能为空'))
      } else if (value === '0') {
        callback(new Error('不能为0'))
      } else if (/[^0-9]/g.test(value)) {
        callback(new Error('只能输入正整数或者-1'))
      } else {
        callback()
      }
    }
    return {
      eidtThreadNumVisible: false,
      threadNumOptions: [
        {
          value: 'true',
          label: '使用调度器'
        },
        {
          value: 'false',
          label: '不使用调度器'
        }
      ],
      threadNumFormData: {
        jmxId: '',
        jmxAlias: '',
        numThreads: '',
        rampTime: '',
        loops: '',
        scheduler: '',
        duration: ''
      },
      // 校验必填参数
      editThreadNumFormRules: {
        // 使用了validator后，就不要有message消息，不然就一直使用message消息
        jmxAlias: [
          { required: true, message: '请输入JMX名称', trigger: 'blur' }
        ],
        numThreads: [
          { required: true, validator: validateNumber, trigger: 'change' }
        ],
        rampTime: [
          { required: true, validator: validateNumber, trigger: 'change' }
        ],
        loops: [
          { required: true, validator: validateLoops, trigger: 'change' }
        ],
        duration: [
          { required: true, validator: validateNumber, trigger: 'change' }
        ]
      }
    }
  },
  props: ['jmxId'],
  methods: {
    initForm() {
      this.eidtThreadNumVisible = true
      setTimeout(() => {
        this.getThreadInfo()
      }, 10)
    },
    async getThreadInfo() {
      const { data: threadNumRes } = await this.$http.get(`/jmxs/thread_num/${this.jmxId}`)
      if (threadNumRes.code !== 200) {
        return this.$message.error('获取线程组信息失败')
      }
      const threadNumInfo = JSON.parse(threadNumRes.data.thread_base_info)
      this.threadNumFormData.jmxId = this.jmxId
      this.threadNumFormData.jmxAlias = threadNumRes.data.jmx_alias
      this.threadNumFormData.numThreads = threadNumInfo.num_threads
      this.threadNumFormData.rampTime = threadNumInfo.ramp_time
      this.threadNumFormData.loops = threadNumInfo.loops
      this.threadNumFormData.scheduler = threadNumInfo.scheduler
      this.threadNumFormData.duration = threadNumInfo.duration
    },
    submit() {
      this.$refs.editThreadNumFormRef.validate(async valid => {
        if (!valid) return
        const { data: editThreadNum } = await this.$http.post('/jmxs/update_thread_num', this.threadNumFormData)
        if (editThreadNum.code !== 200) {
          return this.$message.error('修改线程组属性失败')
        }
        this.$emit('fatherFn')
        this.eidtThreadNumVisible = false
        return this.$message.success('修改线程组属性成功')
      })
    }
  }
}
</script>
