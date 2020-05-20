<template>
    <div>
        <el-input
                placeholder="输入部门名称进行搜索..."
                v-model="filterText">
        </el-input>

        <el-tree
                class="filter-tree"
                :data="deps"
                :props="defaultProps"
                default-expand-all
                :filter-node-method="filterNode"
                ref="tree">
        </el-tree>
    </div>
</template>

<script>
    //todo:16:31
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
        }
    }
</script>

<style scoped>

</style>
