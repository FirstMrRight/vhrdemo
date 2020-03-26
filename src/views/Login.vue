<template>
    <div>
        <el-form :rules="rules" ref="loginForm" :model="loginForm" class="loginContainer">
            <h3 class="loginTitle">系统登录</h3>
            <el-form-item label="用户名" prop="pass">
                <el-input type="text" v-model="loginForm.username" autocomplete="off" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="checkPass">
                <el-input type="password" v-model="loginForm.password" autocomplete="off" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-checkbox class="loginRemember" v-model="checked">记住密码</el-checkbox>
            <el-button size="normal" type="primary" style="width: 100%;" @click="submitForm">登录</el-button>

        </el-form>
    </div>
</template>

<script>
    import {postKeyValueRequest} from "../utils/api";

    export default {
        name: "Login",
        data(){
            return {
                /*登录校验*/
                rules : {
                    username:[{required: true, message: '请输入用户名', trigger: 'blur'}],
                    password:[{required: true, message: '请输入密码', trigger: 'blur'}]
                },
                /*是否记住密码*/
                checked:true,
                /*表单数据对象*/
                loginForm: {
                    username: 'admin',
                    password: '123'
                },
            }
        },
        methods: {
            /*账号密码在校验之后再登录*/
            submitForm() {
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        //.then:接口返回的数据
                        postKeyValueRequest('/doLogin', this.loginForm).then(resp => {
                            console.log(this.loginForm.password,this.loginForm.username)//正确获取到DOM的值:admin,123
                            if (resp){
                                /*把用户信息存储到本地*/
                                console.log(resp)//返回值500，obj:null
                                window.sessionStorage.setItem("user",JSON.stringify(resp.obj))
                                this.$router.replace('/home')//浏览器无法回退
                            }else {
                                console.log(resp)
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
        }
    }
</script>
<style>
    .loginContainer{
        border-radius: 15px;
        background-clip:padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 35px 35px 35px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 20px #cac6c6;
    }
    .loginTitle{
        /*上右下左*/
        margin: 0px auto 40px auto;
        text-align: center;
    }
    .loginRemember{
        text-align: left;
        margin: 0px 0px 15px 0px;
    }
</style>
