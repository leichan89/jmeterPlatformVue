<template>
  <el-container class="home-container">
    <!--  头部区域  -->
    <el-header>
      <div>
        <span>性能测试平台</span>
        <div class="toggle-button" @click=toggleCollapse>
          <i :class="{'el-icon-s-fold': isCollapse == false,'el-icon-s-unfold': isCollapse == true}"/>
        </div>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--  页面主体区域  -->
    <el-container>
      <!-- 侧边栏区域 -->
      <!-- 根据isCollapse属性，动态修改侧边栏的宽度 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 侧边栏菜单区 -->
        <!-- active-text-color激活的文本的颜色，点击菜单时，字体的颜色 -->
        <!-- unique-opened="true"前面必须加一个冒号，不加冒号后面的true只是一个字符串，加冒号表示属性绑定 -->
        <!-- 也可以直接写unique-opened，表示这个属性就是true -->
        <!-- router开起路由模式，子菜单的index作为访问的路径 -->
        <!-- default-active高亮显示url，传入的是url地址 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#ffd04b" :unique-opened="true"
        :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
          <!-- 一级菜单，当index是不变的值时，展开一个菜单就会将其他菜单也展开 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 图标，图标有一个class iconfont，可以修改这个类的属性 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <!-- :index=xxx动态数据绑定 -->
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id"
            @click="saveNavState('/' + subItem.path)">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--  右侧内容区域  -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import cookie from 'js-cookie'
export default {
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      iconsObj: {
        // key是不需要引号的
        125: 'iconfont icon-user',
        103: 'el-icon-s-flag',
        101: 'el-icon-files',
        102: 'el-icon-notebook-2',
        145: 'el-icon-pie-chart'
      },
      // 是否折叠
      isCollapse: false,
      // 激活的链接地址，只是为了高亮显示使用，不是用来访问使用
      activePath: ''
    }
  },
  // created 在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图
  // 这里是在初始化页面前调用接口获取菜单信息
  created() {
    this.getMenuList()
    // 从sessionStorage中获取activePath的值
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      // 删除cookie
      cookie.remove('token')
      this.$router.push('/login')
    },
    // 获取所有菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.code !== 200) return this.$message.error(res.msg)
      // 将获取到的数据写入到data中
      this.menulist = res.data.menuList
    },
    // 点击展开或者折叠
    toggleCollapse () {
      // 对isCollapse取反
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态，被双向绑定的，就是在sessionStorage储存后，再将其赋值给data中，视图再获取这个值，再显示这个是的信息
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  /*将el-header作为容器的一部分，这样就不出出现元素在布局不合理的情况*/
  display: flex;
  /*按钮的对其方式，这里是两边对齐*/
  justify-content: space-between;
  padding-left: 0;
  /*这里是让退出按钮的大小居中*/
  align-items: center;
  color: #fff;
  font-size: 22px;
  /*设置el-header标签中的div属性*/
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 23px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    // 解决左侧菜单框多了一个像素的问题
    border-right: none;
  }
}

.el-main {
  background-color: #EAEDF1;
}

.iconfont {
  margin-right: 10px;
}

// 展开和收起字符的样式
.toggle-button {
  /*background-color: #4A5064;*/
  font-size: 26px;
  /*line-height: 22px;*/
  color: #fff;
  // 居中显示
  text-align: center;
  margin-left: 21px;
  /*// 字符之间的间距*/
  /*letter-spacing: 0.2em;*/
  // 鼠标在移动到菜单区域时，会变成小手
  cursor: pointer;
}
</style>
