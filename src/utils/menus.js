import {getRequest} from "@/utils/api";
import Vue from 'vue'
import router from "@/router";
// import store from 'store'
import format from "element-ui/src/locale/format";
import store from "@vue/cli-service/generator/vuex/template/src/store";

/**
 * 菜单数据格式化
 * @param router
 * @param store
 */

export const initMenu=(router,store)=>{
    //如果用户按F5,state中没有值，所以重新赋值，如果有值，就是用户正常点击跳转
    if (store.state.length>0)
        return;
    //服务端返回的数据是字符串,需要格式化
    getRequest("/system/config/menu").then(data=>{
        if (data){
            let fmtRoutes=formatRoutes(data);
            router.addRoutes(fmtRoutes);
            //调用store的方法
            store.commit('initRoutes',fmtRoutes)
        }
    })
}


//遍历,批量的遍历定义
export const formatRoutes=(routes)=>{
    let fmRoutes =[];
    routes.forEach(router=>{
        let {
            path,
            component,
            name,
            meta,
            iconCls,
            children,
        }=router
        if (children&&children instanceof Array){
            //满足有children且children是一个Array形式的数组，说明是二级菜单，重新赋值
            children = formatRoutes(children)
        }
        let fmRouter={
            path:path,
            name:name,
            iconCls:iconCls,
            meta:meta,
            children: children,
            //动态加载
            component(resolve) {
                if (component.startsWith("Home")) {
                    require(['../views/' + component + '.vue'], resolve);
                } else if (component.startsWith("Emp")) {
                    require(['../views/emp/' + component + '.vue'], resolve);
                } else if (component.startsWith("Per")) {
                    require(['../views/per/' + component + '.vue'], resolve);
                } else if (component.startsWith("Sal")) {
                    require(['../views/sal/' + component + '.vue'], resolve);
                } else if (component.startsWith("Sta")) {
                    require(['../views/sta/' + component + '.vue'], resolve);
                } else if (component.startsWith("Sys")) {
                    require(['../views/sys/' + component + '.vue'], resolve);
                }
            }
        }
        fmRoutes.push(fmRouter)
    })
    return fmRoutes;
}
