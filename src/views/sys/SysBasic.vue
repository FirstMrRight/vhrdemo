<template>
<div>
    <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="部门管理" name="depmana"><DepMana></DepMana></el-tab-pane>
        <el-tab-pane label="职位管理" name="posmana"><PosMana></PosMana></el-tab-pane>
        <el-tab-pane label="职称管理" name="joblevelmana"><JobLevelMana></JobLevelMana></el-tab-pane>
        <el-tab-pane label="奖惩规则" name="ecmana"><EcMana></EcMana></el-tab-pane>
        <el-tab-pane label="权限组" name="permissmana"><PermissMana></PermissMana></el-tab-pane>
    </el-tabs>
</div>

</template>


<script>
    import DepMana from "@/views/sys/basic/DepMana";
    import PosMana from "@/views/sys/basic/PosMana";
    import JobLevelMana from "@/views/sys/basic/JobLevelMana";
    import EcMana from "@/views/sys/basic/EcMana";
    import PermissMana from "@/views/sys/basic/PermissMana";

    export default {
        name: "SysBasic",
        data(){
            return {
                activeName:'first'
            }
        },
        //组件注册
        components: {
            'DepMana':DepMana,
            'PosMana':PosMana,
            'JobLevelMana':JobLevelMana,
            'EcMana':EcMana,
            'PermissMana':PermissMana,
        }
    }
</script>

<style scoped>

</style>
