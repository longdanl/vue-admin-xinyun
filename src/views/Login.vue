<template>
  <div class="login">
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <h3 class="logo"><img src="../assets/xinyunLogo.jpg" alt="logo" style="width:46%;"></h3>
      <div class="loginTitle">业务基础框架</div>
      <div class="loginBox">
        <div class="social-title">芯云智创</div>
        <div class="borderBottom"></div>
      </div>
      <el-form-item prop="account">
        <el-input type="text" v-model="ruleForm2.username" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input type="password" v-model="ruleForm2.password" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button class="forgetBtn" type="text" :loading="logining" @click="forgetPwd">忘记密码?</el-button>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
 // import { requestLogin } from '../api/api';

  //导入自己封装的axios：
  import request from '../utils/request';
  import qs from 'qs';


  export default {
    data() {
      return {
        logining: false,
        ruleForm2: {
          username: '',
          password: ''
        },
        rules2: {
          username: [
            { required: true, message: '请输入账号', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ]
        },
        checked: true
      };
    },
    methods: {
      forgetPwd(){
        this.$alert('请联系管理员进行密码找回！', {
          confirmButtonText: '确定',
        });
      },
      handleSubmit2(ev) {
        var _this = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            this.logining = true;
            this.$store.dispatch('user/login', this.ruleForm2)
                    .then(() => {
                      if(this.ruleForm2.username==="admin" && this.ruleForm2.password==="admin"){
                        this.$message({
                          message:'登录成功',
                          type:'success'
                        })
                        this.$router.push({ path: '/table' });
                        this.loading = false
                      }else{
                        this.loading = false;
                        this.$message({
                          message:'用户名或密码错误',
                          type:'error'
                        });
                      }
                    })
                    .catch(() => {
                      this.loading = false;
                      this.$message({
                        message:'用户名或密码错误',
                        type:'error'
                      });
                    });
            this.logining = false;
          }else{
            console.log('error submit!!');
            this.logining = false;
            return false;
          }
        });
            //NProgress.start();
            //var loginParams = { username: this.ruleForm2.account, password: this.ruleForm2.checkPass };
            //var loginParams = {  username:this.ruleForm2.account.valueOf('admin'), password:this.ruleForm2.account.valueOf('admin') };
           /* request({
              //url: '/api/oauth/token',
              url: '/api/login',
              method: 'post',

              //contentType: 'application/json;charset=utf-8',
              //data: loginParams

              //如果请求过去，且参数携带均正常，考虑是接口支持的数据格式问题（form/json）
              //data: qs.stringify(loginParams)
              data:loginParams,
              auth: {
                username: 'test',
                password: 'test'
              }
            }).then(resData => {
              console.log(resData);
              let { code,access_token,refresh_token,token_type,scope,expires_in } = resData;
              //const token = access_token;
              let user = {access_token:access_token,token_type:token_type,refresh_token:refresh_token,expires_in:expires_in,scope:scope};
              //console.log(user_info);
              if (code === 0) {
                _this.$message({
                  message:'登录成功',
                  type:'success'
                });
                //console.log(token)
                //存储token
               // localStorage.setItem('eleToken',token);
                // 存储到vuex
                //this.$store.dispatch("setAuthorization", !this.isEmpty(token));
               // this.$store.dispatch("setsuer",token);
                sessionStorage.setItem('user', JSON.stringify(user));
                this.$router.push({ path: '/table' });
              }else{
                _this.$message({
                  message:'用户名或密码错误',
                  type:'error'
                });
              }
            });*/

            /*}).catch(err => {
              console.log("error");
            })*/
            //var loginParams = {  grant_type: "refresh_token", refresh_token: "2e0fa44b-0a62-4f4e-9132-88b8bc469588" };
           /* request({
              url: '/api/oauth/token',
              method: 'post',

              //contentType: 'application/json;charset=utf-8',
              //data: loginParams

              //如果请求过去，且参数携带均正常，考虑是接口支持的数据格式问题（form/json）
              //data: qs.stringify(loginParams)
              data:qs.stringify(loginParams),
              auth: {
                username: 'test',
                password: 'test'
              }
            }).then(resData => {
              console.log(resData);

            }).catch(err => {
              console.log("error");
            })*/
      }
    }
  }

</script>

<style lang="scss" scoped>
  .login {
    height: 100%;
    width: 100%;
    background-image: url("../assets/bg2.jpg");
    background-repeat: no-repeat;
    background-size: 100%;
  .login-container {
    position: absolute;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    left: 50%;
    top:50%;
    margin-left: -175px;
    margin-top: -215px;
    width: 300px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
  .logo,.loginTitle,.loginBox {
    margin: 0px auto 20px auto;
    text-align: center;
    color: #505458;
  }
  .loginTitle{
    font-family:宋体;
    color:#505458;
    font-size: 26px;
  }
  .loginBox div{
    font-family:宋体;
    color:gray;
    margin-bottom: 20px;
    font-size: 20px;
  }
  .loginBox .borderBottom{
    border-bottom: 1px solid #ccc;
  }
  .forgetBtn {
    border: 0;
    float: left;
    font-size: 15px;
    color: #505458;
  }
  .forgetBtn:hover {
    text-decoration :underline;
  }
  }
  }
</style>
