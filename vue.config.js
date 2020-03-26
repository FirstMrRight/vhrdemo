//定义代理对象
let proxyObj = {};
//拦截http请求
proxyObj['/']={
    ws:false,
    target:'http://localhost:8081',
    changeOrigin: true,
    pathRewrite:{
        '^/': ''
    }
}
module.exports={
    devServer:{
        host:'localhost',
        port:8080,
        proxy:proxyObj
    }
}
