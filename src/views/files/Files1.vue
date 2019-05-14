<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<i class="fa fa-music" aria-hidden="true" style="color: royalblue">&nbsp;<strong style="color: royalblue">音频文件</strong></i>
				</el-form-item>
				<el-form-item>
					<el-button size="small" @click="addMusic">导入音频</el-button>
				</el-form-item>
				<el-form-item class="btn" style="float: right">
					<el-button size="mini"><i class="fa fa-refresh" aria-hidden="true" @click="refresh"></i></el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--列表-->
		<el-table align:="center" :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 70%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="username" label="文件名" width="200">
			</el-table-column>
			<el-table-column prop="phone" label="文件大小"  width="200">
			</el-table-column>
			<el-table-column prop="email" label="上传时间" width="220">
			</el-table-column>
			<el-table-column prop="see" label="预览" width="160">
			</el-table-column>
			<el-table-column prop="remarks" label="备注" width="168">
			</el-table-column>
			<el-table-column label="操作" width=170 class="showBtn">
				<template scope="scope">
					<el-button type="success" size="small" @click="handleChoose(scope.$index, scope.row)">选择</el-button>
					<el-button size="small" type="primary" @click="handleSet(scope.$index, scope.row)">设置</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange"  :total="total" style="float:right;">
			</el-pagination>
		</el-col>
		<!--导入音频界面-->
		<el-dialog title="导入音频" v-model="addMusicVisible" :close-on-click-modal="false">
			<el-form :model="addMusicForm" label-width="80px" ref="addMusicForm">
				<el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-change="handleChange" :file-list="fileList">
					<el-button type="primary">点击导入</el-button><p slot="tip" class="el-upload__tip">（只能上传jpg/png文件，且不超过500kb）</p>
				</el-upload>
				<el-form-item label="备注" prop="remarks">
					<el-input v-model="addMusic.remarks" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addMusicVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addUsers" :loading="addMusicLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--新增用户界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="用户名" prop="name">
					<el-input v-model="addForm.username" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="手机号码">
					<el-input v-model="addForm.phone"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addUsers" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<i class="fa fa-video-camera" aria-hidden="true" style="color: royalblue">&nbsp;<strong style="color: royalblue">视频文件</strong></i>
				</el-form-item>
				<el-form-item>
					<el-button size="small" @click="addVideo">导入视频</el-button>
				</el-form-item>
				<el-form-item class="btn" style="float: right">
					<el-button size="mini"><i class="fa fa-refresh" aria-hidden="true" @click="refresh"></i></el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--列表-->
		<el-table align:="center" :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 70%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="username" label="文件名" width="200">
			</el-table-column>
			<el-table-column prop="phone" label="文件大小"  width="200">
			</el-table-column>
			<el-table-column prop="email" label="上传时间" width="220">
			</el-table-column>
			<el-table-column prop="see" label="预览" width="160">
			</el-table-column>
			<el-table-column prop="remarks" label="备注" width="168">
			</el-table-column>
			<el-table-column label="操作" width=170 class="showBtn">
				<template scope="scope">
					<el-button type="success" size="small" @click="handleChoose(scope.$index, scope.row)">选择</el-button>
					<el-button size="small" type="primary" @click="handleSet(scope.$index, scope.row)">设置</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange"  :total="total" style="float:right;">
			</el-pagination>
		</el-col>
		<!--导入视频界面-->
		<el-dialog title="导入视频" v-model="addVideoVisible" :close-on-click-modal="false">
			<el-form :model="addVideoForm" label-width="80px" ref="addVideoForm">
				<el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-change="handleChange" :file-list="fileList">
					<el-button type="primary">点击导入</el-button><p slot="tip" class="el-upload__tip">（只能上传3gp文件，且不超过500kb）</p>
				</el-upload>
				<el-form-item label="备注" prop="remarks">
					<el-input v-model="addVideo.remarks" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addVideoVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addUsers" :loading="addVideoLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--新增用户界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="用户名" prop="name">
					<el-input v-model="addForm.username" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="手机号码">
					<el-input v-model="addForm.phone"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addUsers" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

	</section>
</template>
<script>
import { getUsers, addUsers, deleteUsers, updateUsers, getUsersById } from '@/api/users'
export default {
	data() {
		return {
			filters: {
				id: ''
			},
			fileList: [],
			users: [],
			total: 0,
			page: 1,
			listLoading: false,
			sels: [],//列表选中列
			//编辑界面数据
			editFormVisible: false,//编辑界面是否显示
			editLoading: false,
			editFormRules: {
				username: [
					{required: true, message: '请输入用户名', trigger: 'blur'},
				],
				phone: [
					{required: true, message: '请输入用户名', trigger: 'blur'},
				]
			},
			editForm: {
				username: '',
				phone:'',
			},
			addMusicVisible: false,//新增界面是否显示
			addMusicLoading: false,
			//新增音频界面数据
			addMusicForm: {
				remarks: '',
			},
			addVideoVisible: false,//新增界面是否显示
			addVideoLoading: false,
			//新增音频界面数据
			addVideoForm: {
				remarks: '',
			},
			addFormVisible: false,//新增界面是否显示
			addLoading: false,
			addFormRules: {
				username: [
					{required: true, message: '请输入用户名', trigger: 'blur'},
				],
				phone: [
					{required: true, message: '请输入用户名', trigger: 'blur'},
				]
			},
			//新增界面数据
			addForm: {
				username: '',
				phone: "",
			}
		}
	},
	created() {
		//this.listLoading=true;
		this.getUsers();
	},
	methods: {
		formatActive: function (row, column) {
			return row.active == 1 ? '启用' :'禁用';
		},
		handleCurrentChange(val) {
			this.page = val;
			this.getUsers();
		},
		//刷新
		refresh() {
			//this.listLoading = true;
			this.getUsers();
		},
		//查询用户ID
		async getUsersById() {
			//this.listLoading = true;
			const res = await getUsersById(this.filters.id);
			if(res.code!==0 && this.filters.id !==""){
				this.$message({
					message: res.description,
					type: 'error'
				});
				this.users=""
			}else if(this.filters.id ==""){
				this.$message({
					message: "请输入用户ID",
					type: 'error'
				});
				this.users=""
			}else{
				console.log(res)
				let list = new Array();
				let user = res;
				let users = list.push(user)
				console.log("users----"+users)
				//this.users = users;
				console.log(list);
				this.users = list;
				this.filters.id=""
			}
			/*var arr=[];
			for(let i in res){
				let o=res[i];
				arr.push(o);
			}
			console.log(arr);*/
			/*let self = [];
			for(var i in res){
				self.push(res[i]);
			}
			console.log(self);*/
			/*this.users = res;
			console.log("this.users"+this.users);*/
			//console.log(res.list);
			/*this.total = res.total;
			let page = 1;
			this.users = this.users.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, {
						total: total,
					}]);
				}, 1000);
			});*/
			//console.log("this.users"+this.users);
		},
		//获取用户列表
		async getUsers() {
			const res = await getUsers();
			this.users = res.list;
			//this.listLoading = false;
			/*this.total = res.total;
			let page = 1;
			this.users = this.users.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, {
						total: total,
					}]);
				}, 1000);
			});*/
			//console.log("this.users"+this.users);
		},
		selsChange: function (sels) {
			this.sels = sels;
		},
		//选择文件
		handleChoose(index, row) {
			let para = {id: row.id};
			console.log(para.id)
			this.$confirm('确认选择该文件作为视频彩铃吗?', '提示', {
				type: 'warning'
			}).then(async() => {
				await deleteUsers(para.id);
				this.listLoading = false;
				this.editFormVisible = false;
				this.users.splice(index, 1);
				this.$message({
					message: '删除成功',
					type: 'success'
				});
			}).catch(()=> {})
		},
		//显示编辑界面
		handleEdit: function (index, row) {
			this.editFormVisible = true;
			this.editForm = Object.assign({}, row);
		},
		//编辑用户
		async updateUsers() {
			this.$confirm('确认修改该记录吗?', '提示', {
				type: 'warning'
			}).then(async() => {
				let id = this.editForm.id;
				console.log(id);
				await updateUsers(id,this.editForm);
				this.editFormVisible = false;
				this.editLoading = false;
				this.$message({
					message: '修改成功',
					type: 'success'
				});
				this.getUsers();
			}).catch(err => {
				this.$message({
					message: err.description,
					type: 'error'
				});
			})
		},
		//显示导入音频界面
		addMusic(){
			this.addMusicVisible = true;
			this.addMusicForm = {
				remarks: ''
			}
		},
		//导入音频
		handleChange(file, fileList) {
			this.fileList = fileList.slice(-3);
		},
		//显示导入视频界面
		addVideo(){
			this.addVideoVisible = true;
			this.addVideoForm = {
				remarks: 'haha'
			}
		},
		//显示新增界面
		handleSet: function () {
			this.addFormVisible = true;
			this.addForm = {
				username: '',
				phone: "",
			};
		},
		//新增用户
		async addUsers() {
			const res = await addUsers(this.addForm);
			this.$message({
				message: '提交成功',
				type: 'success'
			});
			this.addFormVisible = false;
			this.addLoading = false;
			this.$refs['addForm'].resetFields();
			console.log(res);
			this.getUsers();
		},
	}
}
</script>

<style scoped>
	.btn .el-button{
		font-size: 16px;
		border:0;
		margin-right:-10px;
		color:darkgray
	}
	.btn .el-button:hover{
		color:#20a0ff;
	}
</style>
