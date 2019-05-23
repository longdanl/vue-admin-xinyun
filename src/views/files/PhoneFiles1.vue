<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.phone" placeholder="主叫号码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAddPhone">新增</el-button>
				</el-form-item>
				<el-form-item class="btn" style="float: right">
					<el-button size="mini"><i class="fa fa-refresh" aria-hidden="true" @click="refresh"></i></el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--彩铃列表-->
		<el-table :row-class-name="tableRowClassName" border stripe ref="singleTable" align:="center" :data="phoneList" v-loading="listLoading" style="width: 40%;">
			<el-table-column type="index" width="56">
			</el-table-column>
			<el-table-column prop="phone" label="主叫号码" width="150">
			</el-table-column>
			<!--<el-table-column prop="call_phone" label="被叫号码" width="200">
			</el-table-column>-->
			<el-table-column prop="arbt" label="音频文件" width="160">
			</el-table-column>
			<el-table-column prop="vrbt" label="视频文件" width="160">
			</el-table-column>
			<!--<el-table-column prop="seeIt" label="预览" width="80" class="isPlaying">
				<i class="fa fa-play-circle-o"></i>
			</el-table-column>-->
			<el-table-column label="操作" width=145 class="showBtn">
				<template scope="scope">
					<el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange"  :total="total" style="float:right;">
			</el-pagination>
		</el-col>
		<!--主叫号码新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="主叫号码" prop="phone">
					<el-input v-model="addForm.phone" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="音频文件" prop="arbt">
					<el-select v-model="addForm.arbt" placeholder="文件名">
						<el-option label="音频1" value="音频1"></el-option>
						<el-option label="音频2" value="音频2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="视频文件" prop="vrbt">
					<el-select v-model="addForm.vrbt" placeholder="文件名">
						<el-option label="视频1" value="视频1"></el-option>
						<el-option label="视频2" value="视频2"></el-option>
						<el-option label="视频3" value="视频3"></el-option>
						<el-option label="视频4" value="视频4"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary":loading="addLoading" @click.native="addPhone">提交</el-button>
			</div>
		</el-dialog>
		<!--主叫号码编辑界面-->
		<!--编辑界面-->
		<el-dialog title="新增" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="addForm">
				<el-form-item label="主叫号码" prop="phone">
					<el-input v-model="editForm.phone" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="音频文件" prop="arbt">
					<el-select v-model="editForm.arbt" placeholder="文件名">
						<el-option label="音频1" value="音频1"></el-option>
						<el-option label="音频2" value="音频2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="视频文件" prop="vrbt">
					<el-select v-model="editForm.vrbt" placeholder="文件名">
						<el-option label="视频1" value="视频1"></el-option>
						<el-option label="视频2" value="视频2"></el-option>
						<el-option label="视频3" value="视频3"></el-option>
						<el-option label="视频4" value="视频4"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" :loading="editLoading" @click.native="editPhone">提交</el-button>
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
				phone: ''
			},
			phoneList:[
				{
					call_phone:'',
					phone:'17624203889',
					arbt:'音频1',
					vrbt:'视频1',
					is_default:1
				},
				{
					call_phone:'10099',
					phone:'17624203889',
					arbt:'音频2',
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
				phone: [
					{required: true, message: '请输入主叫号码', trigger: 'blur'}
				]
			},
			//编辑界面数据
			editForm: {
				phone:'',
				arbt:'',
				vrbt:''
			},
			addFormVisible: false,//新增界面是否显示
			addLoading: false,
			addFormRules: {
				phone: [
					{required: true, message: '请输入主叫号码', trigger: 'blur'}
				]
			},
			//新增界面数据
			addForm: {
				phone:'',
				arbt:'',
				vrbt:''
			},
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
		handleAddPhone: function () {
			this.addFormVisible = true;
			this.addForm = {
				phone: "",
				arbt:'',
				vrbt:''
			};
		},
		//新增用户
		addPhone() {
			this.addFormVisible = false;
			this.addLoading = false;
		},
		//新增用户
		editPhone() {
			this.editFormVisible = false;
			this.editLoading = false;
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
	.fa-play-circle-o{
		cursor:pointer;
		font-size: 20px
	}
	.showMusicList{
		display: none;
	}
	.showList:hover{
		display: block;
	}
</style>
