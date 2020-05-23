<template>
    <div style="width: 500px">
        <el-input
                prefix-icon="el-icon-search"
                placeholder="输入部门名称进行搜索..."
                v-model="filterText">
        </el-input>

        <el-tree
                :data="deps"
                :props="defaultProps"
                :filter-node-method="filterNode"
                :expand-on-click-node="false"
                ref="tree">
            <span class="custom-tree-node" style="display:flex;justify-content: space-between;width: 100%" slot-scope="{node,data}">
                <span>{{data.name}}</span>
        <span>
          <el-button
                  type="primary"
                  size="mini"
                  class="depBtn"
                  @click="() => showAddDepView(data)">
            添加部门
          </el-button>
          <el-button
                  type="danger"
                  size="mini"
                  class="depBtn"
                  @click="() => deleteDep(data)">
            删除部门
          </el-button>
        </span>
      </span>
        </el-tree>

        <el-dialog
                title="添加部门"
                :visible.sync="dialogVisible"
                width="30%">
            <div>
                <table>
                    <tr>
                        <td><el-tag>上级部门</el-tag></td>
                        <td>{{pname}}</td>
                    </tr>
                    <tr>
                        <td><el-tag>部门名称</el-tag></td>
                        <td><el-input v-model="dep.name" placeholder="请输入部门名称..."></el-input></td>
                    </tr>
                </table>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="doAddDep">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getRequest, postRequest} from "@/utils/api";

    export default {
        name: "DepMana",
        data() {
            return{
                filterText: '',
                /*需要添加的对象*/
                dep:{
                    name:'',
                    parentId:-1
                },
                pname:'',
                deps:[],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                dialogVisible:false
            }
        },
        mounted(){
          this.initDeps();
        },
        methods: {
            //初始化变量，置空二次点击添加部门按钮input框中的数据
            initDep(){
                this.dep={
                    name : '',
                        parentId:-1
                }
                this.pname = '';
            },
            //防止部门添加完成后部门树自动关闭，给数组动态刷新元素，实现动态刷新
            addDep2Deps(deps,dep){
                for (let i=0;i<deps.length;i++){
                    let d = deps[i];
                    if (d.id == dep.parentId){
                        d.chrildren = d.chrildren.concat(dep);
                        return;
                    }else {
                        this.addDep2Deps(d.chrildren,d.dep)
                    }
                }
            },
            doAddDep(){
                postRequest("/system/basic/department/",this.dep).then(resp => {
                    if (resp){
                        this.addDep2Deps(this.deps,resp.obj)
                        this.initDeps();
                        this.dialogVisible = false;
                        this.initDep();
                    }
                })
            },
            showAddDepView(data){
                this.pname = data.name;
                this.dep.parentId = data.id;
                this.dialogVisible = true
            },
            deleteDep(data){
            },
          initDeps(){
              getRequest("/system/basic/department/").then(resp => {
                if (resp){
                    this.deps = resp;
                }
              })
          },
            /**}
             * 这个方法会被调用很多次,节点过滤
             * filterText就是我们要过滤的内容
             *
             * @param value 传进来的最新值
             * @param data  json数组中的每一项 股东会、董事会...
             * @returns {boolean}
             */
            filterNode(value,data){

              if (!value)
                  return true;
              return data.name.indexOf(value) != -1;
            }
        },
        watch:{
            filterText(val){
                //val:filterText的最新值
                this.$refs.tree.filter(val)
            }
        }


    }
</script>

<style>
    .depBtn{
        margin: 2px;
        padding: 2px;
    }
</style>
