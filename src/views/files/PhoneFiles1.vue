<template>
	<section>
		<!--彩铃列表-->
		<el-table :row-class-name="tableRowClassName" border stripe ref="singleTable" align:="center" :data="users" v-loading="listLoading" style="width: 70%;">
			<el-table-column type="index" width="56">
			</el-table-column>
			<el-table-column prop="phone" label="被叫号码" width="200">
			</el-table-column>
			<el-table-column prop="username" label="音频文件ID"  width="200">
			</el-table-column>
			<el-table-column prop="username" label="视频文件ID"  width="200">
			</el-table-column>
			<el-table-column prop="see" label="预览" width="160">
			</el-table-column>
			<el-table-column prop="phone" label="主叫号码" width="168">
			</el-table-column>
			<el-table-column label="操作" width=190 class="showBtn">
				<template scope="scope">
					<el-button size="small" type="primary" @click="handleSet(scope.$index, scope.row)">编辑</el-button>
					<el-button type="success" size="small" @click="handleChoose(scope.row)">选择</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange"  :total="total" style="float:right;">
			</el-pagination>
		</el-col>
		<!--设置界面-->
		<el-dialog title="主叫列表" v-model="setFormVisible" :close-on-click-modal="false">
			<el-button type="primary" size="small" @click="handleAdd" style="margin-bottom: 10px">新增</el-button>
			<!--主叫列表-->
			<el-table show-overflow-tooltip="true" height="400" border align:="center" :data="users" highlight-current-row v-loading="listLoading" style="width: 100%;">
				<el-table-column prop="username" label="用户名" width="300">
				</el-table-column>
				<el-table-column prop="phone" label="手机号码"  width="300">
				</el-table-column>
				<el-table-column label="操作" width=280 class="showBtn">
					<template scope="scope">
						<el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-dialog>
		<!--上传音频界面-->
		<el-dialog title="导入音频" v-model="uploadFormVisible" :close-on-click-modal="false">
			<el-form :model="uploadForm" label-width="80px" ref="uploadForm">
				<el-form-item label="备注">
					<el-input v-model="uploadForm.remark"></el-input>
				</el-form-item>
				<el-upload
						class="upload-demo"
						ref="upload"
						action="https://jsonplaceholder.typicode.com/posts/"
						:on-preview="handlePreview"
						:file-list="fileList"
						:auto-upload="false">
					<el-button slot="trigger" size="small" type="primary">选择文件</el-button>
					<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传文件</el-button>
					<div slot="tip" class="el-upload__tip">（只能上传 wav / amr 文件）</div>
				</el-upload>
				<!--<el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-change="handleChange" :file-list="fileList">
					<el-button size="small" type="primary">点击上传</el-button>
					<div slot="tip" class="el-upload__tip">（只能上传 wav / amr 文件）</div>
				</el-upload>
				<el-form-item label="备注">
					<el-input style="margin-right: -20px" v-model="uploadForm.remark"></el-input>
				</el-form-item>-->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="uploadFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addUsers" :loading="uploadLoading">确定</el-button>
			</div>
		</el-dialog>
		<!--主叫号码编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="用户名" prop="name">
					<el-input v-model="editForm.username" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="手机号码">
					<el-input v-model="editForm.phone"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="updateUsers" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--新增主叫号码界面-->
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
import { getUsers, addUsers, deleteUsers, updateUsers, getUsersById} from '@/api/users'
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
			sel: '',//列表选中列
			setFormVisible: false,
			editFormVisible: false,//编辑界面是否显示
			editLoading: false,
			editFormRules: {
				username: [
					{required: true, message: '请输入用户名', trigger: 'blur'}
				]
			},
			//编辑界面数据
			editForm: {
				username: '',
				phone: "",
			},
			addFormVisible: false,//新增界面是否显示
			addLoading: false,
			addFormRules: {
				username: [
					{required: true, message: '请输入用户名', trigger: 'blur'}
				]
			},
			//新增界面数据
			addForm: {
				username: '',
				password:'',
			},
			//上传音频界面数据
			uploadFormVisible: false,//新增界面是否显示
			uploadLoading: false,
			uploadForm: {
				remark:''
			},
			currentRow: null
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
		//刷新
		refresh() {
			//this.listLoading = true;
			this.getUsers();
		},
		//显示用户编辑界面
		handleEdit: function (index, row) {
			this.editFormVisible = true;
			this.editForm = Object.assign({}, row);
		},
		handleCurrentChange(val) {
			this.page = val;
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
		},
		//获取用户列表
		async getUsers() {
			this.listLoading = false;
			const res = await getUsers();
			this.users = res.list;
		},
		handleRowChange(val) {
			this.currentRow = val;
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
			}).catch(() => {
			})
		},
		//显示编辑界面
		handleSet: function (index, row) {
			this.setFormVisible = true;
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
				username: '',
				phone: "",
			};
		},
		//显示上传音频界面
		handleMusic: function () {
			this.uploadFormVisible = true;
			this.uploadForm = {
				remark:''
			};
		},
		//上传音频
		submitUpload() {
			if(this.fileList.length>0){
				this.$confirm('确认上传该音频吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.$refs.upload.submit();
					this.$message({
						message: '上传成功',
						type: 'success'
					});
					this.$refs.upload.clearFiles();
				}).catch(() => {
					this.$message({
						message: '取消上传',
						type: 'warning'
					});
				})
			}else{
				this.$message({
					message: '请选择上传的文件',
					type: 'error'
				});
				this.fileList.length+=1
			}

		},
		/*handleRemove(file, fileList) {
			console.log(file, fileList);
		},*/
		handlePreview(file) {
			console.log(file);
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
		tableRowClassName({row, rowIndex}) {
			if (rowIndex === 1) {
				return 'warning-row';
			} else if (rowIndex === 3) {
				return 'success-row';
			}
			return '';
		},
		//选择彩铃
		handleChoose(row){
			this.$confirm('确认选择该彩铃吗?', '提示', {
				type: 'warning'
			}).then(() => {
				this.$refs.singleTable.setCurrentRow(row);

				this.$message({
					message: '选择成功',
					type: 'success'
				});
			}).catch(()=> {})
		}
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
	.el-table .success-row {
		background: red;

	}
</style>
