<template>
	<el-row class="container">
		<!--头部-->
		<el-col :span="24" class="topbar-wrap">
			<div class="topbar-logo">
				<a :class="collapsed?'':'show'" style="padding-left:8px;"></a>
			</div>
			<div class="topbar-logos" v-show="!collapsed">
				<a>{{collapsed?'':sysName}}</a>
			</div>
			<div class="topbar-title">
				<!--展开折叠开关-->
				<div @click.prevent="collapse">
					<i class="fa fa-bars" aria-hidden="true" v-show="!collapsed"><span style="font-size: 18px;color: #fff;">&nbsp;后台管理系统</span></i>
					<i class="fa fa-bars" aria-hidden="true" v-show="collapsed"><span style="font-size: 18px;color: #fff;">&nbsp;后台管理系统</span></i>
				</div>
			</div>
			<div class="topbar-account topbar-btn">
				<i class="fa fa-envelope" aria-hidden="true" style="font-size: 24px;color: white;margin-right: 10px"><el-badge is-dot class="item"></el-badge></i>
				<el-dropdown trigger="click">
					<el-dropdown trigger="hover">
						<span class="el-dropdown-link userinfo-inner"><img src="../assets/user.png" />{{username}}</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</el-dropdown>
			</div>
		</el-col>
		<!--中间-->
		<el-col :span="24" class="main">
			<!--左侧导航-->
			<aside :class="{showSidebar:!collapsed}">
				<!--导航菜单-->
				<el-menu :default-active="defaultActiveIndex" router :collapse="collapsed" @select="handleSelect">
					<template v-for="(item,index) in $router.options.routes" v-if="item.menuShow">
						<el-submenu v-if="!item.leaf" :index="index+''">
							<template slot="title"><i :class="item.iconCls" style="color:rgb(135,141,153)"></i><span slot="title" style="color: #eeeeee">{{item.name}}</span></template>
							<el-menu-item v-for="term in item.children" :key="term.path" :index="term.path" v-if="term.menuShow"
										  :class="$route.path==term.path?'is-active':''">
								<i :class="term.iconCls"></i><span slot="title">{{term.name}}</span>
							</el-menu-item>
						</el-submenu>
						<el-menu-item v-else-if="item.leaf&&item.children&&item.children.length" :index="item.children[0].path"
									  :class="$route.path==item.children[0].path?'is-active':''">
							<i :class="item.iconCls" style="color:rgb(135,141,153)"></i><span slot="title" style="color: #eeeeee">{{item.children[0].name}}</span>
						</el-menu-item>
					</template>
				</el-menu>
			</aside>
			<!--右侧内容区-->
			<section class="content-container">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="breadcrumb-container">
						<strong class="title">{{$route.name}}</strong>
						<el-breadcrumb separator="/" class="breadcrumb-inner" style="float: right">
							<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
								{{ item.name }}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
			</section>
		</el-col>
	</el-row>
</template>

<script>
import {logout} from "@/api/user"
import { getToken} from '../utils/auth'
import {bus} from '../bus.js'
export default {
	name: 'home',
	created(){
		bus.$on('setNickName', (text) => {
			this.nickname = text;
		})
	},
	data () {
		return {
			defaultActiveIndex: "0",
			username: '',
			collapsed: false,
			sysName:'XINYUN'
		}
	},
	methods: {
		handleSelect(index){
			this.defaultActiveIndex = index;
		},
		//折叠导航栏
		collapse: function () {
			this.collapsed = !this.collapsed;
		},
		logout(){
			this.$confirm('确认退出吗?', '提示', {
				confirmButtonClass: 'el-button--warning'
			}).then(() => {
				this.$store.dispatch('user/logout')
						.then(() => {
							this.$message({
								message:"退出成功",
								type:'success'
							});
							this.$router.push({ path: '/login' });
						})
						.catch((error) => {
							this.loading = false;
							this.$message({
								message:error.description,
								type:'error'
							});
						});
				this.logining = false;
			}).catch(() => {});
		}
	},
	mounted() {
		var user = sessionStorage.getItem('user');
		if (user) {
			user = JSON.parse(user);
			this.username = user.username || '';
			/*this.sysUserAvatar = user.avatar || '';*/
		}
	}
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;

	.topbar-wrap {
		height: 50px;
		line-height: 50px;
		background: #373d41;
		padding: 0px;

	.topbar-btn {
		color: #fff;
	}
	/*.topbar-btn:hover {*/
	/*background-color: #4A5064;*/
	/*}*/
	.topbar-logo {
		float: left;
		width: 59px;
		line-height: 26px;
	}
	.topbar-logo .show{
		display:block
	}
	.item {
		margin-top:-12px;
		left:-2px;
	}
	.topbar-logos {
		float: left;
		width: 179px;
		line-height: 50px;
		text-align: center;
	}
	.topbar-logos a{
		color:white;
		height:50px;
		line-height: 50px;
		font-size: 36px;
	}
	.topbar-logo img, .topbar-logos img {
		height: 40px;
		margin-top: 5px;
		margin-left: 2px;
	}
	.topbar-title {
		float: left;
		text-align: left;
		width: 200px;
		padding-left: 10px;
		border-left: 1px solid #000;
	}
	.topbar-account {
		float: right;
		padding-right: 12px;
	}
	.topbar-account img {
		width: 40px;
		height: 40px;
		border-radius: 20px;
		margin: 5px 0px 10px 10px;
		float: right;
	}
	.userinfo-inner {
		cursor: pointer;
		color: #fff;
		padding-left: 10px;
	}
	}
	.main {
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		position: absolute;
		top: 50px;
		bottom: 0px;
		overflow: hidden;
	}

	aside {
		min-width: 50px;
		background: #333744;
	&::-webkit-scrollbar {
		 display: none;
	 }

	&.showSidebar {
		 overflow-x: hidden;
		 overflow-y: auto;
	 }

	.el-menu {
		height: 100%; /*写给不支持calc()的浏览器*/
		height: -moz-calc(100% - 80px);
		height: -webkit-calc(100% - 80px);
		height: calc(100% - 80px);
		border-radius: 0px;
		background-color: #333744;
		border-right: 0px;
	}

	.el-submenu .el-menu-item {
		min-width: 60px;
	}
	.el-menu {
		width: 180px;
	}
	.el-menu--collapse {
		width: 60px;
	}

	.el-menu .el-menu-item, .el-submenu .el-submenu__title {
		height: 46px;
		line-height: 46px;
	}

	.el-menu-item:hover, .el-submenu .el-menu-item:hover, .el-submenu__title:hover {
		background-color: #7ed2df;
	}
	}
    .fa{
		color: white;
		font-size: 20px;
	}
	.menu-toggle {
		text-align: center;
		color: white;
		height: 26px;
		line-height: 30px;
	}

	.content-container {
		background: #fff;
		flex: 1;
		overflow-y: auto;
		padding: 10px;
		padding-bottom: 1px;

	.content-wrapper {
		background-color: #fff;
		box-sizing: border-box;
	}
	}
	}
</style>
