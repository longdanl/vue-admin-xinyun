<template>
	<div id="app" @click="OperatingWebsite()">
		<transition name="fade"
		            mode="out-in">
			<router-view :key="key"></router-view>
		</transition>
	</div>
</template>

<script>
import request from './utils/request';
import qs from 'qs';
export default {
	name: 'app',
	computed:{
		key(){
			return this.$route.path + Math.random();
		}
	},
	methods: {
		OperatingWebsite() {
			let currentTime = this.currentTime;
			let lastTime = new Date().getTime();
			let timeOut = 30* 60* 1000; //设置时间30分钟
			if (lastTime - currentTime > timeOut) {
				// 30分钟未操作页面，跳转登录页面
				this.currentTime = new Date().getTime();
				/*const fullPath = this.$route.fullPath;
				const query = this.$Base64.encode(fullPath);*/
				this.$router.push({
					path: "/login",
					/*query: {
						type: query
					}*/
				});
			} else {
				this.currentTime = new Date().getTime();
				let refresh_token = JSON.parse(localStorage.getItem('refresh_token'));
				//console.log('刷新refresh_token:'+refresh_token);
				//var loginParams = {  grant_type: "refresh_token", refresh_token:refresh_token  };
				/*request({
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
				/*this.$store.dispatch('refresh/refresh', refresh_token)
						.then(() => {
							console.log('刷新成功')
						})
						.catch(() => {
							console.log('刷新失败')
						});*/
				/*let user = JSON.parse(sessionStorage.getItem('user'));
				console.log('1.'+user)
				let token = user.refresh_token;
				console.log(token)
				var loginParams = {  grant_type: "refresh_token", refresh_token: token };*/
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
					 console.log('2.'+user);
					 let { code,access_token,refresh_token,token_type,scope,expires_in } = resData;
					 //const token = access_token;
					 let user = {access_token:access_token,token_type:token_type,refresh_token:refresh_token,expires_in:expires_in,scope:scope};
					 //console.log(user_info);
					 console.log('user.'+user)
                     sessionStorage.setItem('user', JSON.stringify(user));
                 }).catch(err => {
                   console.log("error");
                 })*/
			}
		}
	},
}

</script>

<style lang="scss">
body {
	margin: 0px;
	padding: 0px;
	/*background: url(assets/bg1.jpg) center !important;
		background-size: cover;*/
	// background: #1F2D3D;
	font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
	font-size: 14px;
	-webkit-font-smoothing: antialiased;
}

#app {
	position: absolute;
	top: 0px;
	bottom: 0px;
	width: 100%;
}

.el-submenu [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}

.el-menu-item [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}

.toolbar {
	background: #f2f2f2;
	padding: 10px;
	//border:1px solid #dfe6ec;
	margin: 10px 0px;
	.el-form-item {
		margin-bottom: 10px;
	}
}

.fade-enter-active,
.fade-leave-active {
	transition: all .2s ease;
}

.fade-enter,
.fade-leave-active {
	opacity: 0;
}
</style>
