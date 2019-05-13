<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.username" placeholder="文件名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getUsersById">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">上传文件</el-button>
				</el-form-item>
				<el-form-item class="btn" style="float: right">
					<el-button size="mini"><i class="fa fa-refresh" aria-hidden="true" @click="refresh"></i></el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<el-table align:="center" :data="files" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 62%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="name" label="文件名" width="200">
			</el-table-column>
			<el-table-column prop="size" label="文件大小"  width="200">
			</el-table-column>
			<el-table-column prop="time" label="上传时间" width="200">
			</el-table-column>
			<el-table-column prop="see" label="预览" width="200px" :formatter="formatActive">
			</el-table-column>
			<el-table-column label="操作" width="174" class="showBtn">
				<template scope="scope">
					<el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">设置</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="deleteUsersBatch" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange"  :total="total" style="float:right;">
			</el-pagination>
		</el-col>
		<!--编辑界面-->
		<el-dialog title="设置主叫号码" v-model="editFormVisible" :close-on-click-modal="false">
			<el-table align:="center" :data="phone" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 30%;">
				<el-table-column prop="name" label="主叫号码" width="200">
				</el-table-column>
				<el-table-column label="操作" width="174" class="showBtn">
					<template scope="scope">
						<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-dialog>
	</section>
</template>

<script>
import { getUsers, addUsers, deleteUsers, updateUsers, getUsersById, deleteUsersBatch } from '@/api/users'
export default {
	data() {
		return {
			filters: {
				id: ''
			},
			files: [],
			total: 0,
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
			//设置界面数据
			editForm: {
				phone:""
			},
		}
	},
	created() {
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
			console.log(res);
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
		//删除用户
		handleDel(index, row) {
			let para = {id: row.id};
			console.log(para.id)
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
			}).catch(error => {
				this.$message({
					message: error.description,
					type: 'success'
				});
			})
		},
		//批量删除用户
		deleteUsersBatch() {
			var ids = this.sels.map(item => item.id).toString();
			console.log(ids);
			this.$confirm('确认删除选中记录吗？', '提示', {
				type: 'warning'
			}).then(async() => {
				this.listLoading = true;
				await deleteUsersBatch(ids);
				this.$message({
					message: '删除成功',
					type: 'success'
				});
			}).catch(err => { console.error(err) })
		},
		//显示编辑界面
		handleEdit: function (index, row) {
			this.editFormVisible = true;
			this.editForm = Object.assign({}, row);
			let see =  this.editForm;
			console.log("see :" + see.toString());
		},
		//编辑用户
		async updateUsers() {
			await updateUsers(this.editForm.id,this.editForm);
			this.editFormVisible = false;
			/*this.$confirm('确认修改该记录吗?', '提示', {
				type: 'warning'
			}).then(async() => {
				await updateRole(row.id, this.editForm);
				/!*for (let index = 0; index < this.rolesList.length; index++) {
					if (this.rolesList[index].key === this.role.key) {
						this.rolesList.splice(index, 1, Object.assign({}, this.role))
						break
					}
				}*!/
				this.editLoading = false;
				this.$message({
					message: '修改成功',
					type: 'success'
				});
			}).catch(err => {
				this.$message({
					message: err.description,
					type: 'success'
				});
			})*/
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
				active: "",
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
			this.addLoading = true;
			this.$refs['addForm'].resetFields();
			console.log(res);
			this.getUsers();
		},
		/*//编辑
		editSubmit: function () {

			this.$refs.editForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true;
						//NProgress.start();
						let para = Object.assign({}, this.editForm);
						para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
						editUser(para).then((res) => {
							this.editLoading = false;
							//NProgress.done();
							this.$message({
								message: '提交成功',
								type: 'success'
							});
							this.$refs['editForm'].resetFields();
							this.editFormVisible = false;
							this.getUsers();
						});
					});
				}
			});
		},*/
		//新增
		/*addSubmit: function () {
			this.$refs.addForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.addLoading = true;
						//NProgress.start();
						let para = Object.assign({}, this.addForm);
						para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
						addUser(para).then((res) => {
							this.addLoading = false;
							//NProgress.done();
							this.$message({
								message: '提交成功',
								type: 'success'
							});
							this.$refs['addForm'].resetFields();
							this.addFormVisible = false;
							this.getUsers();
						});
					});
				}
			});
		},*/
		/*//批量删除
		batchRemove: function () {
			var ids = this.sels.map(item => item.id).toString();
			this.$confirm('确认删除选中记录吗？', '提示', {
				type: 'warning'
			}).then(() => {
				this.listLoading = true;
				//NProgress.start();
				let para = { ids: ids };
				batchRemoveUser(para).then((res) => {
					this.listLoading = false;
					//NProgress.done();
					this.$message({
						message: '删除成功',
						type: 'success'
					});
					this.getUsers();
				});
			}).catch(() => {});
	    }*/
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
