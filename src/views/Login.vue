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
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            this.logining = true;
            this.$store.dispatch('user/login', this.ruleForm2)
                    .then(() => {
                      console.log("登录成功");
                      if(this.ruleForm2.username==="admin" && this.ruleForm2.password==="admin"){
                        this.$message({
                          message:'登录成功',
                          type:'success'
                        });
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
