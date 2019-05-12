<!--<template>
	<el-row class="container">
		<el-col :span="24" class="header">
			<el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
				{{collapsed?'':sysName}}
			</el-col>
			<el-col :span="10">
				<div class="tools" @click.prevent="Collapse">
					<i class="fa fa-align-justify"></i>
				</div>
			</el-col>
			<el-col :span="4" class="userinfo">
				<i class="fa fa-envelope" aria-hidden="true" style="font-size: 20px;color: white;margin-right: 10px"></i>
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner"><img src="../assets/user.png" />系统管理员</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-col>
		<el-col :span="24" class="main">
			<aside :class="collapsed?'menu-collapsed':'menu-expanded'">
				&lt;!&ndash;导航菜单&ndash;&gt;
				<el-menu :default-active="defaultActiveIndex" router :collapse="collapsed" @select="handleSelect">
					<template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
						<el-submenu :index="index+''" v-if="!item.leaf">
							<template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
							<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
						</el-submenu>
						<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
					</template>
				</el-menu>
				&lt;!&ndash;导航菜单-折叠后&ndash;&gt;
				<ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
					<li v-for="(item,index) in $router.options.routes" v-if="!item.hidden" class="el-submenu item">
						<template v-if="!item.leaf">
							<div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"><i :class="item.iconCls"></i></div>
							<ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
								<li v-for="child in item.children" v-if="!child.hidden" :key="child.path" class="el-menu-item" style="padding-left: 40px;" :class="$route.path==child.path?'is-active':''" @click="$router.push(child.path)">{{child.name}}</li>
							</ul>
						</template>
						<template v-else>
                            <ul>
                                <li class="el-submenu">
                                    <div class="el-submenu__title el-menu-item" style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;" :class="$route.path==item.children[0].path?'is-active':''" @click="$router.push(item.children[0].path)"><i :class="item.iconCls"></i></div>
                                </li>
                            </ul>
						</template>
					</li>
				</ul>
			</aside>
			<section class="content-container">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="breadcrumb-container">
						<strong class="title">{{$route.name}}</strong>
						<el-breadcrumb separator="/" class="breadcrumb-inner">
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
import {logout} from "../store/modules/user"
export default {
	data() {
		return {
			sysName:'XINYUN',
			collapsed:false,
			sysUserName: '',
			sysUserAvatar: '',
			form: {
				name: '',
				region: '',
				date1: '',
				date2: '',
				delivery: false,
				type: [],
				resource: '',
				desc: ''
			},
			isCollapse: true
		}
	},
	methods: {
		onSubmit() {
			console.log('submit!');
		},
		handleopen() {
			//console.log('handleopen');
		},
		handleclose() {
			//console.log('handleclose');
		},
		handleselect: function (a, b) {
		},

		//退出登录
//		logout: function () {
//			var _this = this;
//			this.$confirm('确认退出吗?', '提示', {
//			}).then(() => {
//				this.$store.dispatch('user/logout')
//						.then(() => {
//							this.$message({
//								message:'退出成功',
//								type:'success'
//							})
//							this.loading = false
//						})
//						.catch(() => {
//							this.loading = false;
//							this.$message({
//								message:'退出失败',
//								type:'error'
//							});
//						});
//				sessionStorage.removeItem('user');
//				_this.$router.push('/login');
//			}).catch(() => {
//
//			});
//		},

		//折叠导航栏
		Collapse:function(){
			this.collapsed=!this.collapsed;
		},
		showMenu(i,status){
			this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
		},
		handleOpen(key, keyPath) {
			console.log(key, keyPath);
		},
		handleClose(key, keyPath) {
			console.log(key, keyPath);
		}
	},
	mounted() {
		var user = sessionStorage.getItem('user');
		if (user) {
			user = JSON.parse(user);
			this.sysUserName = user.name || '';
			this.sysUserAvatar = user.avatar || '';
		}

	}
}

</script>

<style scoped lang="scss">
    @import '~scss_vars';
	.el-menu-vertical-demo:not(.el-menu&#45;&#45;collapse) {
		width: 200px;
		min-height: 400px;
	}
    .container {
        position: absolute;
        top: 0px;
        bottom: 0px;
        width: 100%;
        .header {
            height: 60px;
            line-height: 60px;
            background: $color-primary;
            color:#fff;
            .userinfo {
                text-align: right;
                padding-right: 35px;
                float: right;
                .userinfo-inner {
                    cursor: pointer;
                    color:#fff;
                    img {
                        width: 40px;
                        height: 40px;
                        border-radius: 20px;
                        margin: 10px 0px 10px 10px;
                        float: right;
                    }
                }
             }
            .logo {
            //width:230px;
                height:60px;
                font-size: 22px;
                padding-left:20px;
                padding-right:20px;
                border-color: rgba(238,241,146,0.3);
                border-right-width: 1px;
                border-right-style: solid;
                img {
                    width: 40px;
                    float: left;
                    margin: 10px 10px 10px 18px;
                }
                .txt {
                    color:#fff;
                }
            }
            .logo-width{
                width:230px;
            }
            .logo-collapse-width{
                width:60px
            }
            .tools{
                padding: 0px 23px;
                width:14px;
                height: 60px;
                line-height: 60px;
                cursor: pointer;
            }
        }
        .main {
            display: flex;
        // background: #324057;
            position: absolute;
            top: 60px;
            bottom: 0px;
            overflow: hidden;
            aside {
                flex:0 0 230px;
                width: 230px;
            // position: absolute;
            // top: 0px;
            // bottom: 0px;
                .el-menu{
                    height: 100%;
                }
                .collapsed{
                    width:60px;
                .item{
                    position: relative;
                }
                .submenu{
                    position:absolute;
                    top:0px;
                    left:60px;
                    z-index:99999;
                    height:auto;
                    display:none;
                }
            }
        }
            .menu-collapsed{
                flex:0 0 60px;
                width: 60px;
            }
            .menu-expanded{
                flex:0 0 230px;
                width: 230px;
            }
            .content-container {
            // background: #f1f2f7;
                flex:1;
            // position: absolute;
            // right: 0px;
            // top: 0px;
            // bottom: 0px;
            // left: 230px;
                overflow-y: scroll;
                padding: 20px;
                .breadcrumb-container {
                //margin-bottom: 15px;
                    .title {
                        width: 200px;
                        float: left;
                        color: #475669;
                    }
                    .breadcrumb-inner {
                        float: right;
                    }
                }
                .content-wrapper {
                    background-color: #fff;
                    box-sizing: border-box;
                }
            }
        }
    }
</style>-->
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
				<span style="font-size: 18px;color: #fff;">后台管理系统</span>
			</div>
			<div class="topbar-account topbar-btn">
				<i class="fa fa-envelope" aria-hidden="true" style="font-size: 20px;color: white;margin-right: 10px"></i>
				<el-dropdown trigger="click">
					<el-dropdown trigger="hover">
						<span class="el-dropdown-link userinfo-inner"><img src="../assets/user.png" />系统管理员</span>
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
				<!--展开折叠开关-->
				<div class="menu-toggle" @click.prevent="collapse">
					<i class="fa fa-angle-double-left" aria-hidden="true" v-show="!collapsed"></i>
					<i class="fa fa-angle-double-right" aria-hidden="true" v-show="collapsed"></i>
				</div>
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
				nickname: '',
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
				let that = this;
				this.$confirm('确认退出吗?', '提示', {
					confirmButtonClass: 'el-button--warning'
				}).then(() => {
					//确认
					that.loading = true;
					API.logout().then(function (result) {
						that.loading = false;
						localStorage.removeItem('access-user');
						that.$router.go('/login'); //用go刷新
					}, function (err) {
						that.loading = false;
						that.$message.error({showClose: true, message: err.toString(), duration: 2000});
					}).catch(function (error) {
						that.loading = false;
						console.log(error);
						that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
					});
				}).catch(() => {});
			}
		},
		mounted() {
			var user = sessionStorage.getItem('user');
			if (user) {
				user = JSON.parse(user);
				this.sysUserName = user.name || '';
				this.sysUserAvatar = user.avatar || '';
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

	.menu-toggle {
		background: #4A5064;
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
