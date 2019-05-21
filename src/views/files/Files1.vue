<template>
	<section>
		<!--文件列表-->
		<div style="padding-top: 10px"></div>
		<el-table :row-class-name="tableRowClassName" border stripe ref="singleTable" align:="center" :data="files" v-loading="listLoading" style="width: 69%;">
			<el-table-column type="index" width="56">
			</el-table-column>
			<el-table-column prop="memo" label="文件名" width="220">
			</el-table-column>
			<el-table-column prop="type" label="文件类型"  width="120">
			</el-table-column>
			<el-table-column prop="upload_timestamp" label="上传时间" width="200">
			</el-table-column>
			<el-table-column prop="username" label="用户名" width="200">
			</el-table-column>
			<el-table-column prop="is_default" label="设置默认彩铃" width="200">
			</el-table-column>
			<el-table-column prop="calling_numbers" label="主叫号码" width="162">
				17624203889;...
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button><i class="fa fa-cloud-upload" aria-hidden="true" @click="handleAdd">上传文件</i></el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange"  :total="total" style="float:right;">
			</el-pagination>
		</el-col>
		<!--上传界面-->
		<el-dialog title="上传音频/视频" v-model="addFormVisible" :close-on-click-modal="false">
			<!--<el-form :model="addForm" label-width="80px" ref="addForm">
				<el-form-item label="文件名" prop="remarks">
					<el-input v-model="addForm.memo" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="文件类型">
					<el-radio-group v-model="addForm.type">
						<el-radio class="radio" :label="1">音频</el-radio>
						<el-radio class="radio" :label="0">视频</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<el-upload
					class="upload-demo"
					ref="upload"
					action="http://172.16.10.66:8080/crbt/10086/files"
					:on-preview="handlePreview"
					:on-remove="handleRemove"
					:beforeUpload="beforeAvatarUpload"
					:file-list="fileList"
					:auto-upload="false">
				<el-button slot="trigger" type="primary" v-model="addForm.file">选取文件</el-button>
				<el-button style="margin-left: 10px;" type="success" @click="submitUpload">上传到服务器</el-button>
				<div slot="tip" class="el-upload__tip">只能上传3gp、wav、amr文件</div>
			</el-upload>-->
			<form>
				<input type="text" value="" v-model="memo" placeholder="请输入文件名">
				<input type="file" @change="getFile($event)">
				<button @click="submit($event)">提交</button>
			</form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addFormVisible = false">确定</el-button>
			</div>
		</el-dialog>
	</section>
</template>
<script>
import { getUsers, addUsers, deleteUsers, updateUsers, getUsersById} from '@/api/users'
import { upload,getFiles} from '@/api/crbt'
export default {
	data() {
		return {
			file: '',
			memo:'',
			files: [],
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
			disabled:true,
			//编辑界面数据
			editForm: {
				username: '',
				phone: "",
			},
			addFormVisible: false,//上传界面是否显示
			addLoading: false,
			//上传界面数据
			addForm: {
				memo:'',
				type:'',
				file:''
			},
		}
	},
	created() {
		//this.listLoading=true;
		this.getFiles();
	},
	methods: {
		getFile(event) {
			this.file = event.target.files[0];
			console.log(this.file);
		},
		async submit(event) {
			console.log('文件'+this.file);
			event.preventDefault();//取消默认行为
			//创建 formData 对象
			let formData = new FormData();
			// 向 formData 对象中添加文件
			formData.append('file',this.file);
			formData.append('memo',this.memo);
			await upload(formData).then(function (response) {
				console.log("res: ",response);
			})
		},
		// 上传前对文件的大小的判断
		beforeAvatarUpload (file) {
			const extension = file.name.split('.')[1] === '3gp';
			const extension2 = file.name.split('.')[1] === 'wav';
			const extension3 = file.name.split('.')[1] === 'amr';
			if (!extension && !extension2 && !extension3) {
				this.$message({
					message: '上传文件格式错误!',
					type: 'error'
				});
				return false
			}
			this.$message({
				message: '上传成功',
				type: 'success'
			});
		},
		submitUpload() {
			this.$confirm('确认上传该文件吗?', '提示', {
				type: 'warning'
			}).then(async()=> {
				this.$refs.upload.submit();
				const res = await upload(this.addForm);
				console.log(res);
				this.$refs.upload.clearFiles();
			}).catch(err => {
				this.$message({
					message: '上传失败',
					type: 'error'
				});
				this.$refs.upload.abort();
			})
		},
		handleRemove(file, fileList) {
			console.log(file, fileList);
		},
		handlePreview(file) {
			console.log(file);
		},
		formatActive: function (row) {
			return row.active == 1 ? '启用' :'禁用';
		},
		//刷新
		refresh() {
			//this.listLoading = true;
			this.getUsers();
		},
		handleCurrentChange(val) {
			this.page = val;
			this.getUsers();
		},
		//获取用户列表
		async getFiles() {
			this.listLoading = false;
			const res = await getFiles();
			console.log(res+'---------');
			this.files = res.list;
		},
		handleRowChange(val) {
			this.currentRow = val;
		},
		//删除用户
		handleDel(index, row) {
			let para = {id: row.id};
			console.log(para.id)
			this.$confirm('确认删除该文件吗?', '提示', {
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
		//显示新增界面
		handleAdd: function () {
			this.addFormVisible = true;
			this.addForm = {
				remarks: '',
				type: "",
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
		tableRowClassName({row, rowIndex}) {
			if (rowIndex === 1) {
				return 'warning-row';
			} else if (rowIndex === 3) {
				return 'success-row';
			}
			return '';
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
	.el-table .success-row {
		background: red;

	}
</style>
