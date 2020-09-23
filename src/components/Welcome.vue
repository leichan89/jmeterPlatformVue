<template>
  <div>
    <el-divider content-position="left">请求名称</el-divider>
    <el-divider content-position="left">请求头设置</el-divider>
    <el-form :model="headerFormData" ref="headerFormData" status-icon style="width:100%" size="mini">
      <!-- 参数输入 -->
      <el-form-item label="请求头参数">
        <el-row :gutter="10">
          <el-col :span="20">
            <el-row
              :gutter="20"
              v-for="(item,index) in headerFormData.list"
              :key="index"
              class="alignT spaceTop1"
            >
              <el-col :span="4">
                <el-form-item
                  :prop="'list[' + index + '].key'"
                  :rules="{validator: rule_name,trigger: 'blur'}"
                >
                  <el-input placeholder="请输入key" v-model="item.name" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item
                  :prop="'list[' + index + '].value'"
                  :rules="{validator: rule_age,trigger: 'blur'}"
                >
                  <el-input placeholder="请输入value" v-model="item.age" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span=".5">
                <i
                  class="iconBtn"
                  @click="headerListMethod(index)"
                  :class="{'el-icon-circle-plus-outline': index == 0,'el-icon-remove-outline': index>0}"
                ></i>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 按钮 -->
      <!-- <el-row>
        <el-col :span=".5">
          <el-form-item>
            <el-button type="primary" @click="submit('formData')">提交</el-button>
          </el-form-item>
        </el-col>
      </el-row> -->
    </el-form>
    <el-divider content-position="left">请求设置</el-divider>

    <el-form :model="paramFormData" ref="paramFormData" status-icon style="width:100%" size="mini">
      <el-form-item label="请求路径">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="paramFormData.requestUrl">
            <el-select v-model="paramFormData.requestMethod" slot="prepend" placeholder="请选择">
              <el-option label="GET" value="GET"></el-option>
              <el-option label="POST" value="POST"></el-option>
            </el-select>
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="参数类型">
        <el-radio v-model="paramFormData.paramType" label="form">form</el-radio>
        <el-radio v-model="paramFormData.paramType" label="json">json</el-radio>
      </el-form-item>
      <!-- 参数输入 -->
      <el-form-item label="请求参数">
        <el-row :gutter="10">
          <el-col :span="20">
            <el-row
              :gutter="20"
              v-for="(item,index) in paramFormData.list"
              :key="index"
              class="alignT spaceTop1"
            >
              <el-col :span="4">
                <el-form-item
                  :prop="'list[' + index + '].key'"
                  :rules="{validator: rule_name,trigger: 'blur'}"
                >
                  <el-input placeholder="请输入key" v-model="item.name" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item
                  :prop="'list[' + index + '].value'"
                  :rules="{validator: rule_age,trigger: 'blur'}"
                >
                  <el-input placeholder="请输入value" v-model="item.age" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span=".5">
                <i
                  class="iconBtn"
                  @click="paramListMethod(index)"
                  :class="{'el-icon-circle-plus-outline': index == 0,'el-icon-remove-outline': index>0}"
                ></i>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 按钮 -->
      <!-- <el-row>
        <el-col :span=".5">
          <el-form-item>
            <el-button type="primary" @click="submit('formData')">提交</el-button>
          </el-form-item>
        </el-col>
      </el-row> -->
    </el-form>
    <el-divider content-position="left">返回校验</el-divider>
  </div>
</template>
<script>
export default {
  name: 'elementForm' /* element-ui表单验证 */,
  data() {
    return {
      headerFormData: {
        list: [{ key: '', value: '' }]
      },
      paramFormData: {
        requestMethod: 'GET',
        requestUrl: '',
        paramType: 'form',
        list: [{ key: '', valye: '' }]
      }
    }
  },
  mounted() {},
  methods: {
    // 表单增减操作
    headerListMethod(n) {
      if (n > 0) {
        this.headerFormData.list.splice(n, 1)
      } else {
        const o = { key: '', value: '' }
        this.headerFormData.list.push(o)
      }
    },
    paramListMethod(n) {
      if (n > 0) {
        this.paramFormData.list.splice(n, 1)
      } else {
        const o = { key: '', value: '' }
        this.paramFormData.list.push(o)
      }
    },
    // 姓名校验方法
    rule_name(rule, value, callback) {
      console.log(value)
      // 姓名不能为空
      if (!value) {
        return callback(new Error('请输入姓名'))
      }
      callback()
    },
    // 年龄校验方法
    rule_age(rule, value, callback) {
      if (!value) {
        return callback(new Error('请输入年龄'))
      }

      const n = Number(value)

      if (n < 1) {
        return callback(new Error('年龄不能小于1岁'))
      }

      if (n > 200) {
        return callback(new Error('年龄不能大于200岁'))
      }

      callback()
    },
    // 提交
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          // 验证不通过禁止提交
          console.log('验证不通过')
          return false
        }

        console.log(this.formData)
      })
    }
  }
}
</script>

<style scoped>
.align {
  display: flex;
  align-items: center;
}
.alignT {
  display: flex;
  align-items: flex-start;
}
.iconBtn {
  color: #409eff;
  font-size: 18px;
  cursor: pointer;
  margin-top:6px
}
</style>
