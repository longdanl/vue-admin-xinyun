<template>
	<section>
		<!--文件列表-->
		<div style="padding-top: 10px"></div>
		<el-table  border stripe ref="singleTable" align:="center" :data="files" v-loading="listLoading" style="width: 80%;">
			<el-table-column type="index" width="56">
			</el-table-column>
			<el-table-column prop="memo" label="文件名" min-width="100">
			</el-table-column>
			<el-table-column prop="filename" label="文件名" min-width="200">
			</el-table-column>
			<el-table-column prop="type" label="文件类型"  width="120" :formatter="formatType" sortable>
			</el-table-column>
			<el-table-column label="预览"  width="80">
				<template scope="scope">
					<i class="fa fa-play-circle-o" v-if="showFile" @click="handlePlay(scope.$index, scope.row)"></i>
				</template>
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
		<!--播放界面-->
		<el-dialog title="点击按钮播放音频/视频" v-model="playing" :close-on-click-modal="false" style="width:50%;margin-left:25%;margin-bottom:-50%;text-align: center">
			<audio  src="http://www.w3school.com.cn/i/song.ogg" controls="controls" v-model="music">
				您的浏览器不支持预览。
			</audio >
			<video  src="http://www.w3school.com.cn/i/movie.ogg" controls="controls" v-model="video">
				您的浏览器不支持预览。
			</video >
		</el-dialog>
		<!--上传界面-->
		<el-dialog title="上传音频/视频" v-model="addFormVisible" :close-on-click-modal="false">
			<form>
				<el-form>
					<el-form-item label="文件名" prop="memo">
						<el-input v-model="memo" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="用户名" prop="username">
						<el-input v-model="username" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="文件类型">
						<el-radio-group v-model="type">
							<el-radio class="radio" :label="0">音频</el-radio>
							<el-radio class="radio" :label="1">视频</el-radio>
						</el-radio-group></br>
					</el-form-item>
				</el-form>
				<input type="file" @change="getFile($event)"></br>
				<div slot="footer" class="dialog-footer" style="float: right;padding-bottom: 10px;">
					<el-button @click.native="addFormVisible = false">取消</el-button>
					<el-button type="primary" @click="submit($event)">提交</el-button>
				</div>
			</form>
		</el-dialog>
	</section>
</template>
<script>
import { upload,getFiles,downloadFiles} from '@/api/crbt'
export default {
	data() {
		return {
			file: '',
			memo:'',
			type:'',
			username:'',
			files: [],
			total: 0,
			page: 1,
			music:false,
			video:false,
			showFile:true,
			playing:false,
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
			addFormVisible: false,//上传界面是否显示
			addLoading: false,
			//上传界面数据
		}
	},
	created() {
		this.listLoading=true;
		this.getFiles();
	},
	methods: {
		formatType: function (row) {
			return row.type == 1 ? '视频' :'音频';
		},
		getFile(event) {
			this.file = event.target.files[0];
			console.log(this.file);
		},
		submit(event) {
			console.log('文件'+this.file);
			if(!this.memo){
				this.$message({
					message: '请输入文件名!',
					type: 'error'
				});
			}else if(this.type===''){
				this.$message({
					message: '请选择文件类型!',
					type: 'error'
				});
			}else if(!this.file){
				this.$message({
					message: '请选择文件!',
					type: 'error'
				});
			}else{
				event.preventDefault();//取消默认行为
				//创建 formData 对象
				let formData = new FormData();
				// 向 formData 对象中添加文件
				formData.append('file',this.file);
				formData.append('memo',this.memo);
				formData.append('type',this.type);
				this.$confirm('确认上传该文件吗?', '提示', {
					type: 'warning'
				}).then(async()=> {
					await upload(formData)
						.then((res)=> {
							console.log(res);
							if(res.code===0){
								this.$message({
									message: '上传成功',
									type: 'success'
								});
								this.addFormVisible=false
								this.getFile()
							}else{
								this.$message({
									message: res.description,
									type: 'error'
								});
							}
						}).catch((error)=>{
							this.$message({
								message: error.description,
								type: 'error'
							});
					})
				}).catch(err => {})
			}
		},
		//预览文件
		async handlePlay(index, row) {
			console.log(row.type)
			if(row.type === 1){
				this.playing = true;
				this.video = true;
			}else{
				this.music = true;
				this.playing = true;
			}
			console.log(row.filename+'12345')
			let para = {filename: row.filename};
			await downloadFiles(para.filename);
		},

		/*// 上传前对文件的大小的判断
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
		},*/
		//刷新
		refresh() {
			this.listLoading = true;
			this.getUsers();
		},
		handleCurrentChange(val) {
			this.page = val;
			this.getUsers();
		},
		//获取文件列表
		async getFiles() {
			this.listLoading = false;
			const res = await getFiles();
			console.log(res+'---------');
			this.files = res.list;
		},
		//显示新增文件界面
		handleAdd: function () {
			this.addFormVisible = true;
			this.addForm = {
				remarks: '',
				type: "",
			};
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
	.fa-play-circle-o,.fa-pause-circle-o{
		cursor:pointer;
		font-size: 20px
	}
	.fa-play-circle-o:hover,.fa-pause-circle-o:hover{
		color:deepskyblue;
	}
</style>
