<template>
    <div>
        <div>
            <el-input size = "small" v-model="jl.name" style="width: 300px;" prefix-icon="el-icon-plus"
                      placeholder="添加职称"></el-input>
            <el-select v-model="jl.titleLevel" placeholder="职称等级" size="small" style="margin-left: 5px">
                <el-option
                        v-for="item in titleLevel"
                        :key="item"
                        :label="item"
                        :value="item">
                </el-option>
            </el-select>
            <el-button icon="el-icon-type-plus" type="primary" style="margin-left: 5px" size="small" @click="addJobLevel">添加</el-button>
        </div>
        <div>
            <el-table
                    :data="jls"
                    border
                    v-loading="loading"
                    element-loading-text="正在加载..."
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    size="small"
                    @selection-change="handleSelectionChange"
                    style="width: 80%">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="id"
                        label="编号"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="职称名称"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="titleLevel"
                        label="职称级别">
                </el-table-column>
                <el-table-column
                        prop="createDate"
                        label="创建时间">
                </el-table-column>
                <el-table-column
                        label="是否启用">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.enabled" type="success">已启用</el-tag>
                        <el-tag type="danger" v-else>未启用</el-tag>
                    </template>
                    <el-switch
                            v-model="updatejl.enabled"
                            active-color="#13ce66"
                            inactive-color="#ff4949">
                    </el-switch>
                </el-table-column>
                <el-table-column
                        label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" @click="showEditView(scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="deleteLevel(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--动态判断是否选中多选框中的数据-->
            <el-button @click="deleteByBatch" type="danger" size="small" style="margin-top: 8px" :disabled="multipleSelection.length==0">批量删除
            </el-button>

        </div>
        <el-dialog
            title="修改职称"
            :visible.sync="dialogVisible"
            width="30%">
            <div>
                <table>
                    <tr>
                        <td>
                            <el-tag>职称名</el-tag>
                        </td>
                        <td>
                            <el-input size="small" v-model="updatejl.name"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <el-tag>职称级别</el-tag>
                        </td>
                        <td>
                            <el-select v-model="updatejl.titleLevel" placeholder="职称等级" size="small" style="margin-left: 5px">
                                <el-option
                                        v-for="item in titleLevel"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <el-tag>是否启用</el-tag>
                        </td>
                        <td>
                            <el-switch
                                    v-model="updatejl.enabled"
                                    active-text="启用"
                                    inactive-text="禁用"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949">
                            </el-switch>
                        </td>
                    </tr>
                </table>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button ize="small" @click="dialogVisible = false">取 消</el-button>
    <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
import {getRequest} from "@/utils/api";
import {postRequest} from "@/utils/api";
import {deleteRequest} from "@/utils/api";
import {putRequest} from "@/utils/api";
export default {
        name: "JobLevelMana",
        data() {
            return {
                jl:{
                    name:'',
                    titleLevel:'',
                },
                jls:[

                ],
                titleLevel: [
                    '初级',
                    '中级',
                    '高级',
                    '总监'
                ],
                dialogVisible:false,
                updatejl:{
                    name:'',
                    titleLevel:'',
                    enabled:false
                },
                multipleSelection: [],
            }
        },
    mounted() {
        this.initJls()
    },
        methods: {
            initJls() {
                getRequest("/system/basic/joblevel/").then(resp => {
                    if (resp){
                        this.jls = resp;
                        this.jl = {
                            name : '',
                            titleLevel : ''
                        }
                    }
                })
            },
            addJobLevel() {
                //判断用户输入
                if (this.jl.name && this.jl.titleLevel) {
                    postRequest("/system/basic/joblevel/",this.jl).then(resp => {
                        if (resp) {
                            this.initJls()
                        }
                    });
                } else {
                    this.$message.error({
                        type: 'error',
                        message: '添加字段不可以为空'
                    })
                }
            },
            deleteLevel(data) {
                this.$confirm('此操作将永久删除【' + data.name + '】条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteRequest("/system/basic/joblevel/"+data.id).then(resp => {
                        this.initJls()
                    })
                }).catch(() => {
                    this.$message({
                        type : 'info',
                        message : '已取消删除'
                    })
                })
            },
            showEditView(data){
                this.dialogVisible = true;
                Object.assign(this.updatejl,data);
            },
            //更新，请求服务端
            doUpdate(){
                putRequest("/system/basic/joblevel/",this.updatejl).then(resp => {
                    this.initJls()
                    this.dialogVisible = false;
                })
            },
            handleSelectionChange(val){
                this.multipleSelection = val;
            },
            //批量删除
            deleteByBatch(){
                // console.log(this.multipleSelection)
                this.$confirm('此操作将永久删除【' + this.multipleSelection.length + '】条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids = '?';
                    this.multipleSelection.forEach(item =>{
                        //url参数拼接
                        ids += 'ids=' + item.id + '&';
                        console.log(ids);
                    })
                        deleteRequest("/system/basic/joblevel/" + ids).then(resp => {
                        console.log(ids);
                        if (resp){
                            this.initJls();
                        }
                    })
                }).catch(resp => {
                    this.$message({
                       type : 'info',
                        message : '已取消删除'
                    })
                })
            }
        }
    }
</script>

<style scoped>

</style>
