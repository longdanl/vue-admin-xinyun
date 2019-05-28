<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.phone" placeholder="主叫号码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getPhones">查询</el-button>
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
		<el-table @selection-change="selsChange" border stripe ref="singleTable" align:="center" :data="phoneList" v-loading="listLoading" style="width: 43%;">
			<el-table-column type="selection" width="52">
			</el-table-column>
			<el-table-column type="index" width="54">
			</el-table-column>
			<el-table-column prop="calling_number" label="主叫号码" width="150">
			</el-table-column>
			<!--<el-table-column prop="call_phone" label="被叫号码" width="200">
			</el-table-column>-->
			<el-table-column prop="arbt_file_memo" label="音频文件" width="160">
			</el-table-column>
			<el-table-column prop="vrbt_file_memo" label="视频文件" width="160">
			</el-table-column>
			<!--<el-table-column prop="seeIt" label="预览" width="80" class="isPlaying">
				<i class="fa fa-play-circle-o"></i>
			</el-table-column>-->
			<el-table-column label="操作" width=145 class="showBtn" prop="is_default">
				<template scope="scope">
					<el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="deletePhone(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="deletePhoneBatch" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination  style="float: right" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
							:page-sizes="[10, 20,50, 100]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper"
							:total="total">
			</el-pagination>
		</el-col>
		<!--主叫号码新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="主叫号码" prop="calling_number">
					<el-input v-model="addForm.calling_number" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="音频文件" prop="arbt">
					<el-select v-model="addForm.arbt_file_id" placeholder="文件名">
						<el-option :label=item.memo v-for="(item,index) in arbtList" :value=item.id></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="视频文件" prop="vrbt">
					<el-select v-model="addForm.vrbt_file_id" placeholder="文件名">
						<el-option :label=item.memo v-for="(item,index) in vrbtList" :value=item.id ></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" :loading="addLoading" @click.native="addPhone">提交</el-button>
			</div>
		</el-dialog>
		<!--主叫号码编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" ref="editForm">
				<el-form-item label="音频文件" prop="arbt">
					<el-select v-model="editForm.arbt_file_id" placeholder="文件名">
						<el-option :label=item.memo v-for="(item,index) in arbtList" :value=item.id></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="视频文件" prop="vrbt">
					<el-select v-model="editForm.vrbt_file_id" placeholder="文件名">
						<el-option :label=item.memo v-for="(item,index) in vrbtList" :value=item.id></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" :loading="editLoading" @click.native="updatePhone">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>
<script>
import qs from "qs"
import { updatePhone,deletePhone,deletePhoneBatch,getFile,addPhone,getPhones,getPhoneList} from '@/api/crbt'
export default {
	data() {
		return {
			filters: {
				phone: ''
			},
			arbtList:[],
			vrbtList:[],
			phoneList:[],
            playing:true,
			is_default:false,
			limit: 10,
			total: null,
			page: 1,
			listLoading: false,
			sels: '',//列表选中列
			setFormVisible: false,
			editFormVisible: false,//编辑界面是否显示
			editLoading: false,
			//编辑界面数据
			editForm: {
				arbt_file_id:'',
				vrbt_file_id:'',
				vrbt_file_memo:'',
				arbt_file_memo:'',
			},
			addFormVisible: false,//新增界面是否显示
			addLoading: false,
			addFormRules: {
				calling_number: [
					{required: true, message: '请输入绑定号码', trigger: 'blur'}
				],
			},
			//新增界面数据
			addForm: {
				arbt_file_id:'',
				vrbt_file_id:''
			},
		}
	},
	created() {
		//this.listLoading=true;
		this.getPhoneList();
		this.getVideoFile();
		this.getMusicFile();

	},
	methods: {
		formatActive: function (row) {
			return row.active == 1 ? '启用' :'禁用';
		},
		//刷新
		refresh() {
			//this.listLoading = true;
			this.getPhoneList();
		},
		//查询绑定号码
		async getPhones() {
			//this.listLoading = true;
			const res = await getPhones(this.filters.phone);
			if(res.code!==0 && this.filters.phone !==""){
				this.$message({
					message: res.description,
					type: 'error'
				});
				this.files=""
			}else if(this.filters.phone ==""){
				this.$message({
					message: "请输入查询信息",
					type: 'error'
				});
				this.files=""
				this.page = 1;
				this.total=0
			}else{
				console.log(res.list)
				if(res.list.length===0){
					this.filters.phone=""
					this.phoneList=""
				}else{
					let list = new Array();
					for(let i=0;i<res.list.length;i++){
						list.push(res.list[i]);
						this.phoneList = list;
						this.filters.phone="";
						this.page = 1;
						this.total = this.phoneList.length
					}
				}
			}
		},
		//删除用户
		deletePhone(index, row) {
			let para = {id: row.id};
			console.log(para.id)
			this.$confirm('确认删除该记录吗?', '提示', {
				type: 'warning'
			}).then(async() => {
				await deletePhone(para.id);
				this.listLoading = false;
				this.phoneList.splice(index, 1);
				this.$message({
					message: '删除成功',
					type: 'success'
				});
				this.getPhoneList();
			}).catch(() => {})
		},
		selsChange: function (sels) {
			this.sels = sels;
		},
		//批量删除用户
		deletePhoneBatch() {
			var ids = this.sels.map(item => item.id);
			this.$confirm('确认删除选中记录吗？', '提示', {
				type: 'warning'
			}).then(async() => {
				this.listLoading = false;
				let para = { ids: ids };
				await deletePhoneBatch(para);
				this.$message({
					message: '删除成功',
					type: 'success'
				});
				this.getPhoneList();
			}).catch(error => {
				this.$message({
					message: error.description,
					type: 'success'
				}); })
		},
		async getVideoFile(row){
			const res = await getFile();
			let list = new Array();
			list = res.list;
			let vemp = /^vrbt_/;
			let videoList = list.filter(item =>item.filename = (vemp).test(item.filename));
			this.vrbtList = videoList;
			console.log(videoList);
			for(let i=0;i<videoList.length;i++){
				this.addForm.vrbt_file_id = videoList[i].id;
			}
		},
		async getMusicFile(){
			const res = await getFile();
			let list = new Array();
			list = res.list;
			let aemp = /^arbt_/;
			let musicList = list.filter(item =>item.filename = (aemp).test(item.filename));
			this.arbtList = musicList;
			for(let i=0;i<musicList.length;i++){
				this.addForm.arbt_file_id = musicList[i].id;
			}
		},
		//显示编辑界面
		handleEdit: function (index, row) {
			console.log(JSON.stringify(this.editForm))
			this.editFormVisible = true;
			this.editForm = Object.assign({}, row);
			if(this.editForm.arbt_file_id ==-1){
				this.editForm.arbt_file_id = "";
			}
			if(this.editForm.vrbt_file_id ==-1){
				this.editForm.vrbt_file_id = "";
			}
		},
		//编辑用户
		updatePhone() {
			console.log(this.editForm+"=======");
			this.$confirm('确认修改该记录吗?', '提示', {
				type: 'warning'
			}).then(async() => {
				let id = this.editForm.id;
				await updatePhone(id,{arbt_file_id:this.editForm.arbt_file_id,vrbt_file_id:this.editForm.vrbt_file_id});
				this.editFormVisible = false;
				this.editLoading = false;
				this.$message({
					message: '修改成功',
					type: 'success'
				});
				this.getPhoneList();
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
				calling_number:'',
				arbt_file_memo:'',
				vrbt_file_memo:''
			};
		},
		//新增用户
		addPhone() {
			this.$confirm('确认提交该号码绑定吗?', '提示', {
				type: 'warning'
			}).then(async() =>{
				if(!this.addForm.calling_number){
					this.$message({
						message: '请输入绑定号码',
						type: 'error'
					});
				}else{
					this.addFormVisible = false;
					const res = await addPhone(this.addForm).then((res)=>{
						if(!res.code==0){
							this.$message({
								message:res.description,
								type: 'error'
							});
						}else{
							this.$message({
								message: '提交成功',
								type: 'success'
							});
							console.log(JSON.stringify(res));
							this.addFormVisible = false;
							this.addLoading = false;
							this.$refs['addForm'].resetFields();
							console.log(res);
							this.getPhoneList();
						}
					}).catch((res)=>{
						this.$message({
							message:res.description,
							type: 'error'
						});
					})
				}
			}).catch((err)=>{
				this.$message({
					message: err.description,
					type: 'error'
				});
			})
		},
		//新增用户
		editPhone() {
			this.editFormVisible = false;
			this.editLoading = false;
		},
		// 当每页数量改变
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`);
			this.limit = val
			this.getPhoneList()
		},
		// 当当前页改变
		handleCurrentChange(val) {
			console.log(`当前页: ${val}`);
			this.page = val;
			this.getPhoneList()
		},
		//获取号码列表
		async getPhoneList() {
			this.listLoading = false;
			const res = await getPhoneList(qs.stringify({page:this.page,
				page_size: this.limit}));
			this.total = res.total;
			this.phoneList = res.list
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
