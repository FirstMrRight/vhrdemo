<script src="../../babel.config.js"></script>
<template>
<div>
    <el-container>
        <el-header class="homeHeader">
            <div class="title">动力驿站后台管理项目</div>
            <div>
                <el-dropdown class="userInfo" @command="commandHandler">
  <span class="el-dropdown-link">
    {{user.name}}<i><img :src="user.userface" alt=""></i>
  </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
                        <el-dropdown-item command="setting">设置</el-dropdown-item>
                        <el-dropdown-item command="logout" divided>注销登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </el-header>
    </el-container>
        <!--this.$router.options.routes获取到router里的列表数据
        index是为了区分是不是同一个菜单
        index+''是为了把index拼成一个字符串，consloe界面不报警告
        -->
<el-container>
        <el-aside width="200px">
            <el-menu unique-opened router>
                <el-submenu :index="index+''" v-for="(item,index) in routes" v-if="!item.hidden" :key="index">
                    <template slot="title">
                        <i style="color: #409eff;margin-right: 5px" :class="item.iconCls"></i>
                        <span>{{item.name}}</span>
                    </template>
                    <el-menu-item :index="child.path" v-for="(child,indexj) in item.children" :key="indexj">
                        {{child.name}}</el-menu-item>
                </el-submenu>
            </el-menu>
        </el-aside>
        <el-main>
            <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path!='/home'">
                <el-breadcrumb-item :to="{ path: '/home' }">登录页</el-breadcrumb-item>
                <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="homeWelcome" v-if="this.$router.currentRoute.path=='/home'">
                欢迎来到动力驿站
            </div>
            <router-view class="homeRouterView"/>
        </el-main>
    </el-container>
</div>
</template>

<script>

    import {getRequest} from "../utils/api";
    export default {
        name: "Home",
        data(){
            return {
                user:JSON.parse(window.sessionStorage.getItem("user"))
            }
        },
        computed:{
          routes(){
              return this.$store.state.routes;
          }
        },
        methods: {
            menuClick(path,indexPath){

            },
            commandHandler(cmd){
                if (cmd=='logout'){
                    this.$confirm('此操作将退出登录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        getRequest("/logout");
                        window.sessionStorage.removeItem("user")
                        //登出时清空一下store中的数据，初始化一下菜单。不然下一个用户在登录后，不刷新页面会显示原账户的信息
                        this.$store.commit("initRoutes",[])
                        this.$router.replace("/")
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消登出'
                        });
                    });
                }
            },
        }
    }
</script>

<style>
    .homeHeader{
        background-color: #409eff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0px 0px 15px 15px;
    }
    .homeHeader .title{
        font-size: 30px;
        font-family: 隶书;
        color: #eaeaea;
    }
    .homeHeader .userInfo {
        cursor: pointer;
    }
    .el-dropdown-link img {
        width: 30px;
        height: 30px;
        border-radius: 24px;
        margin-left: 8px;
    }

    .el-dropdown-link {
        display: flex;
        align-items: center;
    }
    .homeWelcome{
        text-align: center;
        font-size: 30px;
        font-family: 隶书;
        color: #409eff;
        padding-top: 50;
    }
    .homeRouterView{
        margin-top: 15px;
    }
</style>
