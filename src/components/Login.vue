<template>
  <div class="login_container">
    <div class="login_box">
      <!--   头像区域   -->
      <div class="avatar_box">
        <img src="../assets/logo.png">
      </div>
      <!--   登陆表单区   -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <!--    用户名,使用的验证规则是username    -->
        <el-form-item prop="username">
          <!--     使用图标要先在main.js中导入./assets/fonts/iconfont.css     -->
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <!--    密码    -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" @keypress.native.enter="login" type="password" prefix-icon="iconfont icon-3702mima" placeholder="请输入密码"></el-input>
        </el-form-item>
        <!--    按钮区域    -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<!-- 注意不要随便留空格 -->
<script>
import cookie from 'js-cookie'
export default {
  data () {
    return {
      loginForm: {
        // 只能用单引号
        username: '',
        password: ''
      },
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登陆名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 在methods中创建方法如果报错：在.eslintrc.js中添加规则"space-before-function-paren": [0, "always"]
    // 重置表单填充的数据，表单如果有默认值，则重置为默认值
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      // validate接收回调函数，回调函数的参数可以是一个valid
      // 如果只传入一个参数，只可以不加括号，如果传入两个参数，需要加括号(valid, param)
      // 这里将箭头函数修饰成异步方法
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        try {
          // 这里只处理status_code是200的请求，响应不是200的直接被catch
          const { data: res } = await this.$http.post('login', this.loginForm)
          if (res.code !== 200) return this.$message.error(res.msg)
          this.$message.success('登陆成功')
          // 将登陆成功之后的token保存到客户端的sessionStorage中，而不是localStorage中
          // sessionStorage是会话期间的存储机制，每次会话生效，loclaStorage是持久化的存储
          window.sessionStorage.setItem('token', res.data.token)
          window.sessionStorage.setItem('userId', res.data.user)
          cookie.set('token', res.data.token)
          cookie.set('userId', res.data.user)
          // $router编程式导航对象，通过它跳转到后台主页/home
          this.$router.push('/home')
        } catch (error) {
          this.$message.error('登陆失败！')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  /*圆角设置*/
  border-radius: 10px;
  /*定位*/
  position: absolute;
  /*距离左侧50%*/
  left: 50%;
  top: 35%;
  transform: translate(-50%, -50px);
  /*头像盒子的宽高*/
  .avatar_box {
    height: 130px;
    width: 130px;
    /*盒子的边框*/
    border: 1px solid #eee;
    /*圆角边框*/
    border-radius: 50%;
    /*图片和边框的间距*/
    padding: 10px;
    /*向外扩散10像素*/
    box-shadow: 0 0 10px #ddd;
    /*定位*/
    position: absolute;
    /*整体距离左侧50%*/
    left: 50%;
    /*自身再向左移动自身50%的距离*/
    transform: translate(-50%, -50%);
    background-color: #fff;
    /*图片的宽高*/
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      /*图片的背景色*/
      background-color: #eee;
    }
  }
}
.login_form {
  position: absolute;
  /*距离底部为0*/
  bottom: 0;
  width: 100%;
  /*上下左右间距，上下为0，左右为20px*/
  padding: 0 20px;
  /*表单的尺寸为表单外的box的尺寸*/
  box-sizing: border-box;
}

.btns {
  /*弹性盒模型，它的所有子元素自动成为容器成员，这里让登陆的两个输入框成为容器的成员*/
  /*https://www.cnblogs.com/hellocd/p/10443237.html*/
  display: flex;
  /*右对其，flex-start为左对其，默认左对其*/
  justify-content: flex-end;
}
</style>
