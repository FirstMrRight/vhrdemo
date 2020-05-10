<template>
    <div>
        <div>
            <el-input
                    size="small"
                    class="addPosInput"
                    style="width: 300px;margin-right: 8px"
                placeholder="添加职位..."
                    prefix-icon="el-icon-plus"
                    @keydown.enter.native="addPosition"
                v-model="pos.name">
            </el-input>
            <el-button icon="el-icon-plus" size="small" type="primary" @click="addPosition">添加</el-button>
            <div class="posManaMain">

                <el-table
                        :data="positions"
                        border
                        @selection-change="handleSelectionChange"
                        size="small"
                        stripe
                        style="width: 70%">
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
                            label="职位名称"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="createDate"
                            width="150"
                            label="创建时间">
                    </el-table-column>
                    <el-table-column
                            label="是否启用">
                        <template slot-scope="scope">
                            <el-tag size="small" type="success" v-if="scope.row.enabled">已启用</el-tag>
                            <el-tag size="small" type="danger" v-else>未启用</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    @click="showEditView(scope.$index, scope.row)">编辑
                            </el-button>
                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="handleDelete(scope.$index, scope.row)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--动态判断是否选中多选框中的数据-->
                <el-button @click="deleteByBatch" type="danger" size="small" style="margin-top: 8px" :disabled="multipleSelection.length==0">批量删除
                </el-button>
            </div>
            <el-dialog
                    title="修改职位"
                    :visible.sync="dialogVisible"
                    width="30%">
                <div>
                    <div>
                        <el-tag>职位名称</el-tag>
                        <el-input class="updatePosInput" size="small" v-model="updatePos.name"></el-input>
                    </div>
<!--                    <div>-->
<!--                        <el-tag>是否启用</el-tag>-->
<!--                    </div>-->
                </div>
                <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="dialogVisible = false">取 消</el-button>
    <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
  </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import {getRequest} from "@/utils/api";
    import {postRequest} from "@/utils/api";
    import {deleteRequest} from "@/utils/api";
    import {putRequest} from "@/utils/api";

    export default {
        name: "PosMana",
        data(){
            return{
                pos:{
                    name:'',
                },
                updatePos:{
                    name:'',
                },
                dialogVisible:false,
                /*表格返回的数据*/
                positions:[],
                multipleSelection: [],
            }
        },
        mounted() {
            this.initPositions();
        },
        methods:{
            //点击事件回调
            handleSelectionChange(val){
                this.multipleSelection=val;
            },
            deleteByBatch(){
                this.$confirm('此操作将永久删除【' + this.multipleSelection.length + '】条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids = '?';
                    this.multipleSelection.forEach(item => {
                        ids += 'ids=' + item.id + '&';
                    })
                    deleteRequest("/system/basic/pos/"+ids).then(resp => {
                        if (resp) {
                            this.initPositions();
                        }
                    })
                }).catch(resp => {
                    console.log(resp)
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            addPosition(){
                //判断用户是否输入值
                /**
                 * 在使用的el-table-column标签中
                 * Element UI点击时已获取到点击的数据：index和data
                 */
                if (this.pos.name){
                    postRequest("system/basic/pos/",this.pos).then(resp=>{
                        if (resp){
                            //刷新表格
                            this.initPositions();
                            this.pos.name='';
                        }
                    })
                }else {
                    this.$message.error('职位不可以为空')
                }
            },
            //根据id删除
            handleDelete(index,data){
                this.$confirm('此操作将永久删除【'+data.name+'】, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteRequest("system/basic/pos/"+data.id).then(resp=>{
                        if (resp){
                            this.initPositions()
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'error',
                        message: '删除失败'
                    });
                });
            },

            doUpdate() {
                this.putRequest("/system/basic/pos/", this.updatePos).then(resp => {
                    if (resp) {
                        this.initPositions();
                        this.updatePos.name = '';
                        this.dialogVisible = false;
                    }
                })
            },
            showEditView(index,data){
                Object.assign(this.updatePos,data);//拷贝
                // this.updatePos=data;
                this.dialogVisible=true;
            },
            initPositions(){
                getRequest("/system/basic/pos/").then(resp=>{
                    if (resp){
                        this.positions=resp;
                        console.log(resp)
                    }
                })
            }
        }
    }
</script>

<style>
    .addPosInput{
        margin-right: 8px;
        width: 300px;
    }
    .posManaMain{
        margin-top: 10px;
    }
    .updatePosInput{
        width: 260px;
        margin-left: 10px;
    }
</style>
