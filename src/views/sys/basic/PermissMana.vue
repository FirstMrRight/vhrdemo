<template>
    <div>
        <div class="permissManaTool">
            <el-input size="small" placeholder="请输入角色英文名" v-model="role.name">
                <template slot="prepend">ROLE_</template>
            </el-input>
            <el-input size="small" placeholder="请输入角色中文名" v-model="role.nameZh">
                <template slot="prepend">ROLE_</template>
            </el-input>
            <el-button size="small" icon="el-icon-plus" type="primary">添加角色</el-button>
        </div>
        <div class = "permissManaMain">
            <el-collapse accordion @change="change"
                         v-loading="loading"
                         element-loading-text="正在加载..."
                         element-loading-spinner="el-icon-loading"
                         element-loading-background="rgba(0, 0, 0, 0.8)"
                         v-model="activeName">
                <el-collapse-item :title="r.nameZh" :name="r.id" v-for="(r,index) in roles" :key="index">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>可访问的资源</span>
                            <el-button style="float: right; padding: 3px 0; color: #ff0000;" icon="el-icon-delete" type="text"></el-button>
                        </div>
                        <div>
                            <el-tree
                                    show-checkbox
                                    node-key="id"
                                    ref="tree"
                                    :default-checked-keys="selectdMenus"
                                    :data="allmenus" :props="defaultProps"></el-tree>
                            <div style="display: flex;justify-content: flex-end">
                                <el-button size="mini" @click="canelUpdate">取消修改</el-button>
                                <el-button size="mini" @click="doUpdate(r.id,index)">确认修改</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>
    import {getRequest, putRequest} from "@/utils/api";

    export default {
        name: "PermissMana",
        data() {
            return{
                role :{
                    name:'',
                    nameZh:''
                },
                roles:[],
                allmenus:[],
                defaultProps:{
                    children : 'children',
                    label : 'name'
                },
                selectdMenus:[],
                activeName:-1,
                loading:false
            }
        },
        mounted(){
          this.initRoles();
        },
        methods:{
            initRoles(){
                this.loading =  true;
                getRequest("/system/basic/permiss/").then(resp =>{
                    this.loading=false;
                    if (resp){
                        this.roles = resp
                    }
                })
            },
            change(rid){
                //手风琴，打开时响应，关闭时不响应
                if (rid){
                    this.initAllMenus();
                    this.initSelectedMenus(rid);
                }
            },
            initAllMenus(){
                getRequest("/system/basic/permiss/menus").then(resp =>{
                    this.allmenus = resp;
                })
            },
            initSelectedMenus(rid){
                getRequest("/system/basic/permiss/mids/"+rid).then(resp => {
                    if (resp){
                        this.selectdMenus = resp;
                    }
                })
            },
            //需要知道是点击修改的哪一个，id在上边的for循环中
            //rid:角色id,找index中的一个，树上选中的一个
            //tree 拿到的是一个数组，循环，13个，需要用到其中一个(index)
            //展开项对应的tree
            doUpdate(rid,index){
                let tree = this.$refs.tree[index];
                let selectKeys = tree.getCheckedKeys(true);
                let url = '/system/basic/permiss/?rid=' + rid;
                selectKeys.forEach(key=>{
                    url += '&mids' +key;
                })
                putRequest(url).then(resp => {
                    this.initRoles();
                })
            },
            canelUpdate(){
                this.activeName = -1;
            }

        }
    }
</script>

<style>
    .permissManaTool{
        display: flex;
        justify-content: flex-start;
    }
    .permissManaTool .el-input{
        width: 300px;
        margin-left: 6px;
    }
    .permissManaTool .el-button{
        margin-left: 6px;
    }
    .permissManaMain {
        margin-top: 10px;
        width: 700px;
    }
</style>
