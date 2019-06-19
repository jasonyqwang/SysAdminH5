<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="form" :rules="rules" ref="loginForm" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="form.username" placeholder="用户名">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="form.password" @keyup.enter.native="submitForm('loginForm')">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
                </div>
                <p class="login-tips">用户名：admin     密码：111111</p>
            </el-form>
        </div>
    </div>
</template>

<script>
    import { login } from '@/api/modules/system'
    import { mapActions } from 'vuex'

    export default {
        data: function(){
            return {
                form: {
                    username: 'admin',
                    password: '111111'
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            ...mapActions([
                'setLeftMenus'
            ]),
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        login(this.form).then(res => {
                            if(res.code != this.$_GLOBAL.API_CODE.SUCCESS){
                                this.$refs[formName].fields[1].validateMessage = res.msg
                                this.$refs[formName].fields[1].validateState = 'error'
                            }else{
                                let data = res.data
                                localStorage.setItem(this.$_GLOBAL.STORAGE.USERNAME, data.username);
                                localStorage.setItem(this.$_GLOBAL.STORAGE.ROLE_ID, data.role_id);
                                localStorage.setItem(this.$_GLOBAL.STORAGE.API_TOKEN, data.token);
                                localStorage.setItem(this.$_GLOBAL.STORAGE.LAST_IP, data.last_ip);

                                this.setLeftMenus();
                                this.$router.push('/');
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background-image: url(../../assets/img/login-bg.jpg);
        background-size: 100%;
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .login-tips{
        font-size:12px;
        line-height:30px;
        color:#fff;
    }
</style>