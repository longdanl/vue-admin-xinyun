<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="role">
				<el-form-item>
					<el-input v-model="role.name" placeholder="角色名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getRoles" >查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增角色</el-button>
				</el-form-item>
				<el-form-item class="btn" style="float: right">
					<el-button size="mini" style="font-size:15px;padding:8px 10px;margin-right:300px">导出</el-button>
					<el-button class='btn_child' size="mini"><i class="fa fa-refresh" aria-hidden="true" @click="refresh"></i></el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--列表-->
		<el-table align:="center" :data="roles" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 74%;">
			<el-table-column prop="name" label="角色名称" width="300" sortable>
			</el-table-column>
			<el-table-column prop="addTime" label="创建时间" width="300" sortable>
			</el-table-column>
			<el-table-column label="操作" width="640">
				<template scope="scope">
					<el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)"><i class="fa fa-edit" aria-hidden="true"></i>&nbsp;编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)"><i class="fa fa-trash" aria-hidden="true"></i>&nbsp;删除</el-button>
					<el-button size="small" type="success" @click="handleEdit(scope.$index, scope.row)"><i class="fa fa-tag" aria-hidden="true"></i>&nbsp;分配资源</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange"  :total="total" style="float:right;">
			</el-pagination>
		</el-col>
		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="角色名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="角色名称" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
import util from '../../common/js/util'
import { getRoles, removeRole, editRole, addRole } from '@/api/roles';
export default {
	data() {
		return {
			role: {
				name: ''
			},
			roles: [],
			total: 0,
			page: 1,
			listLoading: false,
			sels: [],//列表选中列

			editFormVisible: false,//编辑界面是否显示
			editLoading: false,
			editFormRules: {
				name: [
					{ required: true, message: '请输入角色名称', trigger: 'blur' }
				]
			},

			//编辑界面数据
			editForm: {
				id: 0,
				name: '',
			},
			addFormVisible: false,//新增界面是否显示
			addLoading: false,
			addFormRules: {
				name: [
					{ required: true, message: '请输入角色名称', trigger: 'blur' }
				]
			},
			//新增界面数据
			addForm: {
				name: '',
			}
		}
	},
	methods: {
		handleCurrentChange(val) {
			this.page = val;
			this.getRoles();
		},//刷新
		refresh(){
			this.listLoading = true;
			this.getRoles();
		},
		//获取角色列表
		async getRoles() {
			this.listLoading = false;
			const res = await getRoles();
			console.log(res)
			this.roles = res.list;
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
		//删除
		handleDel: function (index, row) {
			this.$confirm('确认删除该记录吗?', '提示', {
				type: 'warning'
			}).then(() => {
				this.listLoading = true;
				//NProgress.start();
				let para = { id: row.id };
				removeRole(para).then((res) => {
					this.listLoading = false;
					//NProgress.done();
					this.$message({
						message: '删除成功',
						type: 'success'
					});
					this.getRoles();
				});
			}).catch(() => {

			});
		},
		//显示编辑界面
		handleEdit: function (index, row) {
			this.editFormVisible = true;
			this.editForm = Object.assign({}, row);
		},
		//显示新增界面
		handleAdd: function () {
			this.addFormVisible = true;
			this.addForm = {
				name: '',
			};
		},
		//编辑
		editSubmit: function () {
			this.$refs.editForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true;
						//NProgress.start();
						let para = Object.assign({}, this.editForm);
						para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
						editRole(para).then((res) => {
							this.editLoading = false;
							//NProgress.done();
							this.$message({
								message: '提交成功',
								type: 'success'
							});
							this.$refs['editForm'].resetFields();
							this.editFormVisible = false;
							this.getRoles();
						});
					});
				}
			});
		},
		//新增
		addSubmit: function () {
			this.$refs.addForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.addLoading = true;
						//NProgress.start();
						let para = Object.assign({}, this.addForm);
						para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
						addRole(para).then((res) => {
							this.addLoading = false;
							//NProgress.done();
							this.$message({
								message: '提交成功',
								type: 'success'
							});
							this.$refs['addForm'].resetFields();
							this.addFormVisible = false;
							this.getRoles();
						});
					});
				}
			});
		},
		selsChange: function (sels) {
			this.sels = sels;
		},
	},
	mounted() {
		this.getRoles();
	}
}

</script>

<style scoped>
 .btn .btn_child{
	 font-size: 16px;
	border:0;
	margin-right:-10px;
	color:darkgray
 }
	.btn .el-button:hover{
		color:#20a0ff;
	}
</style>
