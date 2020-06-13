<template>
    <div>
        <div style="margin-top: 10px;display: flex;justify-content: center">
            <el-input v-model="keywords" placeholder="通过用户名搜索用户..." prefix-icon="el-icon-search"
                      style="width: 400px;margin-right: 10px" @keydown.enter.native="doSearch"></el-input>
            <el-button icon="el-icon-search" type="primary" @click="doSearch">搜索</el-button>
        </div>
        <div class="hr-container">
            <el-card class="hr-card" v-for="(hr,index) in hrs" :key="index">
                <div slot="header" class="clearfix">
                    <span>{{hr.name}}</span>
                    <el-button style="float: right; padding: 3px 0;color: #e30007;" type="text"
                               icon="el-icon-delete" @click="deleteHr(hr)"></el-button>
                </div>
                <div>
                    <div class="img-container">
                        <img :src="hr.userface" :alt="hr.name" :title="hr.name" class="userface-img">
                    </div>
                    <div class="userinfo-container">
                        <div>用户名：{{hr.name}}</div>
                        <div>手机号码：{{hr.phone}}</div>
                        <div>电话号码：{{hr.telephone}}</div>
                        <div>地址：{{hr.address}}</div>
                        <div>用户状态：
                            <el-switch
                                    v-model="hr.enabled"
                                    active-text="启用"
                                    @change="enabledChange(hr)"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949"
                                    inactive-text="禁用">
                            </el-switch>
                        </div>


                        <div class="hrrole">
                            <i class="el-icon-user-solid"></i>:
                            <el-tag size="mini" effect="dark" type="success" v-for="(role,indexj) in hr.roles" :key="indexj">{{role.nameZh}}</el-tag>
                            <el-popover
                                    placement="right"
                                    title="角色列表"
                                    width="200"
                                    @show="showPop(hr)"
                                    @hide="hidePop(hr)"
                                    trigger="click">
                                <el-select v-model="selectroles" placeholder="请选择" multiple>
                                    <el-option
                                            v-for="(r,indexk) in allroles"
                                            :key="indexk"
                                            :label="r.nameZh"
                                            :value="r.id">
                                    </el-option>
                                </el-select>
                                <el-button icon="el-icon-more" size="mini" type="text" slot="reference"></el-button>
                            </el-popover>

                        </div>

                        <div>备注：{{hr.remark}}</div>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
    import {deleteRequest, getRequest, putRequest} from "@/utils/api";

    export default {
        name: "SysHr",
        data() {
            return {
                keywords: '',
                hrs: [],
                selectroles:[],
                allroles: []
            }
        },
        mounted() {
            this.initHrs();
        },
        methods: {
            deleteHr(hr) {
                this.$confirm('此操作将永久删除【'+hr.name+'】, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteRequest("/system/hr/"+hr.id).then(resp=>{
                        if (resp) {
                            this.initHrs();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            doSearch() {
                this.initHrs();
            },
            hidePop(hr) {
                /*
                * 不做判断的话，如果取消当前用户的一个角色，
                * 再选中另一个没有选中的角色，不会走更新的请求，
                * 所以这个地方需要如下逻辑进行判断
                *
                * */
                let roles = [];
                Object.assign(roles, hr.roles);
                let flag = false;
                if (roles.length != this.selectroles.length) {
                    flag = true;
                } else {
                    //roles里边保存的是对象，selectroles里保存的是id，所以只能通过循环的方式去对比
                    for (let i = 0; i < roles.length; i++) {
                        let role = roles[i];
                        for (let j = 0; j < this.selectroles.length; j++) {
                            let sr = this.selectroles[j];
                            //判断roles的id和selectroles的id是否相同
                            if (role.id == sr) {
                                //选中的角色中有roles的id，移除一个数据
                                roles.splice(i, 1);//移除
                                //移除的话，数组的下标改变了，少了一个元素,遍历会跳过一个元素，i--使下标一致
                                i--;
                                break;
                            }
                        }
                    }
                    if (roles.length != 0) {
                        flag = true;
                    }
                }

            /**
             * 当点中下拉列表时，不改变selected的情况下，不发送update请求，改变，发送
             */
            if (flag) {
                let url = '/system/hr/role?hrid=' + hr.id;
                this.selectroles.forEach(sr => {
                    url += '&rids=' + sr;
                });
                putRequest(url).then(resp => {
                    if (resp) {
                        this.initHrs();
                    }
                });
            }
        },
            showPop(hr) {
                this.initAllRoles();
                let roles = hr.roles;
                this.selectroles = [];
                roles.forEach(r => {
                    this.selectroles.push(r.id);
                })
            },
            enabledChange(hr) {
                delete hr.roles;
                putRequest("/system/hr/", hr).then(resp => {
                    if (resp) {
                        this.initHrs();
                    }
                })
            },
            initAllRoles() {
               getRequest("/system/hr/roles/").then(resp => {
                    if (resp) {
                        this.allroles = resp;
                    }
                })
            },
            initHrs() {
               getRequest("/system/hr/?keywords="+this.keywords).then(resp => {
                    if (resp) {
                        this.hrs = resp;
                    }
                })
            }
        }
    }


</script>
<style>
    .hrrole span{
        margin-right: 5px;
        margin-top: 5px;
    }
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
