<template>
<div>
    <div style="margin-top: 10px;display: flex;justify-content: center">
        <el-input v-model ="keywords" placeholder="通过用户名搜索用户..." prefix-icon="el-icon-search" style="width: 400px;margin-right: 10px"></el-input>
        <el-button icon="el-icon-search" type="primary">搜索</el-button>
    </div>
    <div class="hr-container">
            <el-card class="hr-card" v-for="(hr,index) in hrs" :key="index">
                <div slot="header" class="clearfix">
                    <span>{{hr.name}}</span>
                    <el-button style="float: right; padding: 3px 0;color: red" type="text" icon="el-icon-delete"></el-button>
                </div>
                <div class="img-container">
                    <img :src="hr.userface" :alt="hr.name" :title="hr.name" class="userface-img">
                </div>
                <div class="userinfo-container">
                    <div>id:{{hr.id}}</div>
                    <div>用户名:{{hr.name}}</div>
                    <div>手机号码:{{hr.phone}}</div>
                    <div>电话号码:{{hr.telephone}}</div>
                    <div>地址:{{hr.address}}</div>
                    <div>用户状态:
                        <el-switch
                                v-model="hr.enabled"
                                active-text="启用"
                                @change = "enabledChange(hr)"
                                inactive-text="禁用"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                        </el-switch>
                    </div>
                    <div>用户角色:
                        <el-tag type="success" style="margin-right: 4px" v-for="(role,indexj) in hr.roles"
                                :key="indexj">{{role.nameZh}}
                        </el-tag>
                        <el-button icon="el-icon-more" type="text"></el-button>
                    </div>
                    <div>备注：{{hr.remark}}</div>
                </div>
            </el-card>
    </div>
</div>
</template>

<script>
    import {getRequest, putRequest} from "@/utils/api";

    export default {
        name: "SysHr",
        data(){
            return{
                keywords:'',
                hrs:[],
            }
        },
        mounted(){
            this.initHrs();
        },
        methods:{
            enabledChange(hr){
                // console.log(hr)
                /**
                 * 删掉前端往后端传输的数据：
                 * 由于前端需要往后端传递的数据中有一个roles集合
                 * 但是后端的mapper里并未对集合做处理
                 * 如果不删除roles的话，请求后端500异常
                 */
                delete hr.roles;
                putRequest("/system/hr/",hr).then(resp => {
                    console.log(resp)
                    if (resp){
                        this.initHrs();
                    }
                })
            },
            initHrs(){
                getRequest("/system/hr/").then(resp =>{
                    if (resp){
                        this.hrs = resp;
                    }

                })
            }
        }
    }
</script>

<style>
    .userinfo-container div {
        font-size: 12px;
        color: #409eff;
    }
    .userinfo-container {
        margin-top: 20px;
    }
    .img-container {
        width: 100%;
        display: flex;
        justify-content: center;
    }
    .userface-img {
        width: 72px;
        height: 72px;
        border-radius: 72px;
    }
    .hr-container {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }
    .hr-card {
        width: 350px;
        margin-bottom: 20px;
    }

</style>
