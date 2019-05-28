<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.id" placeholder="用户ID"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getUsersById">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增用户</el-button>
				</el-form-item>
				<el-form-item class="btn" style="float: right">
					<el-button size="mini"><i class="fa fa-refresh" aria-hidden="true" @click="refresh"></i></el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--列表-->
		<el-table border stripe align:="center" :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 74%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="username" label="用户名" width="200">
			</el-table-column>
			<el-table-column prop="phone" label="手机号码"  width="200">
			</el-table-column>
			<el-table-column prop="email" label="用户邮箱" width="200">
			</el-table-column>
			<el-table-column prop="id" label="用户ID" width="200" sortable>
			</el-table-column>
			<el-table-column prop="active" label="当前状态" width="200px" :formatter="formatActive" sortable>
			</el-table-column>
			<el-table-column label="操作" width=186 class="showBtn">
				<template scope="scope">
					<el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="deleteUsersBatch" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination  style="float: right" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
							:page-sizes="[10, 20,50, 100]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper"
							:total="total">
			</el-pagination>
		</el-col>
		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="用户名" prop="name">
					<el-input v-model="editForm.username" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="用户密码">
					<el-input v-model="editForm.password"></el-input>
				</el-form-item>
				<el-form-item label="手机号码">
					<el-input v-model="editForm.phone"></el-input>
				</el-form-item>
				<el-form-item label="用户邮箱">
					<el-input v-model="editForm.email"></el-input>
				</el-form-item>
				<el-form-item label="当前状态">
					<el-radio-group v-model="editForm.active">
						<el-radio class="radio" :label="1">启用</el-radio>
						<el-radio class="radio" :label="0">禁用</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="updateUsers" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="用户名" prop="username">
					<el-input v-model="addForm.username" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="用户密码" prop="password">
					<el-input v-model="addForm.password"></el-input>
				</el-form-item>
				<el-form-item label="手机号码">
					<el-input v-model="addForm.phone"></el-input>
				</el-form-item>
				<el-form-item label="用户邮箱">
					<el-input v-model="addForm.email"></el-input>
				</el-form-item>
				<el-form-item label="当前状态" prop="active">
					<el-radio-group v-model="addForm.active">
						<el-radio class="radio" :label="1">启用</el-radio>
						<el-radio class="radio" :label="0">禁用</el-radio>
					</el-radio-group>
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
import qs from "qs"
import {getUsersPage, getUsers, addUsers, deleteUsers, updateUsers, getUsersById, deleteUsersBatch } from '@/api/users'
export default {
	data() {
		return {
			filters: {
				id: ''
			},
			users: [],
			limit: 10,
			total: null,
			page: 1,
			listLoading: false,
			sels: [],//列表选中列
			editFormVisible: false,//编辑界面是否显示
			editLoading: false,
			editFormRules: {
				username: [
					{required: true, message: '请输入用户名', trigger: 'blur'}
				]
			},
			//编辑界面数据
			editForm: {
				id: 0,
				username: '',
				password:'',
				phone: "",
				email: '',
				active: "",
			},
			addFormVisible: false,//新增界面是否显示
			addLoading: false,
			addFormRules: {
				username: [
					{required: true, message: '请输入用户名', trigger: 'blur'}
				],
				password: [
					{required: true, message: '请输入用户名', trigger: 'blur'}
				],
				active: [
					{required: true, message: '请输入用户名', trigger: 'blur'}
				],
			},
			//新增界面数据
			addForm: {
				id: 0,
				username: '',
				password:'',
				phone: "",
				email: '',
				active:''
			}

		}
	},
	created() {
		//this.listLoading=true;
		this.getUsers();
	},
	methods: {
		formatActive: function (row) {
			return row.active == 1 ? '启用' :'禁用';
		},
		// 当每页数量改变
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`);
			this.limit = val
			this.getUsers()
		},
		// 当当前页改变
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
				this.users="";
				this.page = 1;
				this.total = 0
			}else{
				console.log(res)
				let list = new Array();
				let user = res;
				let users = list.push(user)
				console.log("users----"+users)
				//this.users = users;
				console.log(list);
				this.users = list;
				this.filters.id="";
				this.page = 1;
				this.total = this.users.length
			}
		},
		//获取用户列表
		async getUsers() {
			this.listLoading = false;
			const res = await getUsers(qs.stringify({page:this.page,
					page_size: this.limit}));
			this.total = res.total;
			this.users = res.list
		},
		selsChange: function (sels) {
		this.sels = sels;
		},
		//删除用户
		handleDel(index, row) {
			console.log(row.id)
			let para = {id: row.id};
			console.log(para.id)
			if(row.username!=='admin'){
				this.$confirm('确认删除该记录吗?', '提示', {
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
				}).catch(() => {
				})
			}
		},
		//批量删除用户
		deleteUsersBatch() {
			var ids = this.sels.map(item => item.id);
			this.$confirm('确认删除选中记录吗？', '提示', {
				type: 'warning'
			}).then(async() => {
				this.listLoading = false;
				let para = { ids: ids };
				await deleteUsersBatch(para);
				this.$message({
					message: '删除成功',
					type: 'success'
				});
				this.getUsers()
			}).catch(error => {
				this.$message({
				message: error.description,
				type: 'success'
			}); })
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
		//显示新增界面
		handleAdd: function () {
			this.addFormVisible = true;
			this.addForm = {
				id: 0,
				username: '',
				password:'',
				phone: "",
				email: '',
				active: 1,
			};
			console.log(this.addForm.id)
		},
		//新增用户
		async addUsers(row) {
			let temp = /^[\w.\-]+@(?:[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,3}$/
			if(!this.addForm.username){
				this.$message({
					message: '请输入用户信息及选定当前状态',
					type: 'error'
				});
			}else if (this.addForm.email && (!(temp).test(this.addForm.email))) {
				this.$message({
					message: '请输入正确的邮箱',
					type: 'error'
				});
			}else{
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
			}
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
