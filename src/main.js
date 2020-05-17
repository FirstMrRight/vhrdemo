import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import store from "./store";
// import store from "@vue/cli-service/generator/vuex/template/src/store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {initMenu} from "@/utils/menus";
import 'font-awesome/css/font-awesome.min.css'

// //
// import {postRequest} from "./utils/api";
// import {getRequest} from "./utils/api";
// import {putRequest} from "./utils/api";
// import {deleteRequest} from "./utils/api";
// import {postKeyValueRequest} from "./utils/api";
//
// /*请求方法封装注册成插件*/
// Vue.prototype.postRequest = postRequest();
// Vue.prototype.getRequest = getRequest();
// Vue.prototype.putRequest = putRequest();
// Vue.prototype.deleteRequest = deleteRequest();
// Vue.prototype.postKeyValueRequest = postKeyValueRequest();


/*
*
* 全局路由守卫
* */

router.beforeEach((to,from,next)=>{
  //去登陆页
  if (to.path =='/'){
    next();
  }else {
    //去其他页面,判断是否登录
    if(window.sessionStorage.getItem("user")){
      initMenu(router, store);
      next();
    }else {
      //没有登录去登录
      next('/')
    }

  }
})

Vue.use(ElementUI,{size:'mini'});
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
