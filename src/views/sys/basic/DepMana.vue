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
    </div>
</template>

<script>
    import {getRequest} from "@/utils/api";

    export default {
        name: "DepMana",
        data() {
            return{
                filterText: '',
                deps:[],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            }
        },
        mounted(){
          this.initDeps();
        },
        methods: {
            showAddDepView(data){
                console.log(data)
            },
            deleteDep(data){
                console.log(data)
            },
          initDeps(){
              getRequest("/system/basic/department/").then(resp => {
                if (resp){
                    this.deps = resp;
                }
              })
          },
            /**}
             * 这个方法会被调用很多次
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
