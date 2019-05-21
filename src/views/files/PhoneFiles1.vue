<template>
	<section>
		<!--彩铃列表-->
		<el-table :row-class-name="tableRowClassName" border stripe ref="singleTable" align:="center" :data="phoneList" v-loading="listLoading" style="width: 70%;">
			<el-table-column type="index" width="56">
			</el-table-column>
			<el-table-column prop="call_phone" label="被叫号码" width="200">
			</el-table-column>
			<el-table-column prop="arbt" label="音频文件"  min-width="200" @click="handleEdit">
				<editable-cell
						slot-scope="{row}"
						editable-component="el-select"
						:can-edit="editModeEnabled"
						close-event="change"
						v-model="row.arbt">
					<el-tag size="medium"
							slot="content">
						{{row.arbt === '音频1' ? '音频1': '音频2'}}
					</el-tag>
					<template slot="edit-component-slot">
						<el-option value="音频1" label="音频1"></el-option>
						<el-option value="视频1" label="音频2"></el-option>
					</template>
				</editable-cell>
			</el-table-column>
			<el-table-column prop="vrbt" label="视频文件"  width="200">
				<editable-cell :show-input="row.editMode" slot-scope="{row}" v-model="row.vrbt">
					<span slot="content">{{row.vrbt}}</span>
				</editable-cell>
			</el-table-column>
			<el-table-column prop="seeIt" label="预览" width="160" class="isPlaying">
				<i class="fa fa-play-circle-o" style='font-size: 24px;' v-show="playing"></i>
				<i class="fa fa-pause-circle-o" style='font-size: 24px;' v-show="!playing"></i>
			</el-table-column>
			<el-table-column prop="phone" label="主叫号码" width="168">
			</el-table-column>
			<el-table-column label="操作" width=190 class="showBtn">
				<template scope="scope">
					<el-button type="danger" size="small" @click="handleChoose(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange"  :total="total" style="float:right;">
			</el-pagination>
		</el-col>
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
	</section>
</template>

<script>
import { getUsers, addUsers, deleteUsers, updateUsers, getUsersById} from '@/api/users'
import EditableCell from "../../components/EditableCell.vue";
export default {
	components: {
		EditableCell
	},
	data() {
		return {
			editModeEnabled: true,
			phoneList:[
				{
					call_phone:'',
					arbt:'音频1',
					vrbt:'视频1',
					phone:'17624203889',
					is_default:1
				},
				{
					call_phone:'10099',
					arbt:'音频2',
					vrbt:'视频2',
					phone:'17624203889',
					is_default:0
				},
			],
            playing:true,
			is_default:false,
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
	mounted() {
		this.gridData = this.gridData.map(row => {
			return {
				...row,
				editMode: false
			};
		});
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
	.isPlaying .fa{
		font-size: 40px;
		color: red;
	}
	.edit-cell {
		min-height: 35px;
		cursor: pointer;
	}
</style>
