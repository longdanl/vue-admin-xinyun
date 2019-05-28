<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<!--<el-select v-model="filters.types" placeholder="文件类型">
					<el-option label="音频" value="音频" v-bind=files.type></el-option>
					<el-option label="视频" value="视频"></el-option>
				</el-select>-->
                <el-form-item>
                    <el-input v-model="filters.types"></el-input>
                </el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getFilesByMemo">查询</el-button>
				</el-form-item>
				<el-form-item class="btn" style="float: right">
					<el-button size="mini"><i class="fa fa-refresh" aria-hidden="true" @click="refresh"></i></el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--文件列表-->
		<div style="padding-top: 10px"></div>
		<el-table  border stripe ref="singleTable" align:="center" :data="files" v-loading="listLoading" style="width: 66%;">
			<el-table-column type="index" width="56">
			</el-table-column>
			<el-table-column prop="memo" label="文件名" min-width="100">
			</el-table-column>
			<el-table-column prop="type" label="文件类型"  width="120" :formatter="formatType" sortable>
			</el-table-column>
			<el-table-column label="预览"  width="80">
				<template scope="scope">
					<i class="fa fa-play-circle-o" v-if="showFile" @click="handlePlay(scope.$index, scope.row)"></i>
				</template>
			</el-table-column>
			<el-table-column prop="upload_timestamp" label="上传时间" width="200" sortable>
			</el-table-column>
			<el-table-column prop="username" label="上传用户" width="200">
			</el-table-column>
			<el-table-column prop="is_default" label="默认彩铃" width="120" sortable>
				是
			</el-table-column>
			<el-table-column prop="calling_numbers" label="主叫号码" width="162">
				17624203889;...
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button><i class="fa fa-cloud-upload" aria-hidden="true" @click="handleAdd">上传文件</i></el-button>
            <el-pagination  style="float: right" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
                            :page-sizes="[10, 20,50, 100]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper"
                            :total="total">
            </el-pagination>
		</el-col>
		<!--音频播放界面-->
		<el-dialog title="点击按钮播放音频" v-model="playingMusic" :close-on-click-modal="false" style="width:50%;margin-left:25%;margin-bottom:-50%;text-align: center">
            <audio src="http://172.16.10.66:8080/" controls autoplay loop>
                HTML5 audio not supported
            </audio>
		</el-dialog>
		<!--视频播放界面-->
		<el-dialog title="点击按钮播放视频" v-model="playingVideo" :close-on-click-modal="false" style="width:50%;margin-left:25%;margin-bottom:-50%;text-align: center">
			<video :src="files.filename" class="avatar" controls="controls">您的浏览器不支持视频播放</video>
		</el-dialog>
		<!--上传界面-->
		<el-dialog title="上传音频/视频" v-model="addFormVisible" :close-on-click-modal="false">
			<form>
				<el-form>
					<el-form-item label="文件名" prop="memo">
						<el-input v-model="memo" auto-complete="off"></el-input>
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
import qs from "qs"
import {formatDate} from '../../common/js/util'
import { upload,getFiles,downloadFiles,getFileByMemo} from '@/api/crbt'
export default {
	data() {
		return {
			filters: {
				types:''
			},
			file: '',
			memo:'',
			type:'',
			username:'',
			time:'',
			files: [],
            total: null,
            page: 1,
            limit:10,
			showFile:true,
			playingMusic:false,
			playingVideo:false,
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
			baseUr:"",
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
        // 当每页数量改变
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.limit = val
            this.getFiles()
        },
        // 当当前页改变
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.page = val;
            this.getFiles()
        },
		//获取文件列表
		async getFiles() {
			this.listLoading = false;
            const res = await getFiles(qs.stringify({page:this.page,
                page_size: this.limit}));
            this.total = res.total;
            this.files = res.list;
			//时间转换
			for(let i=0;i<this.files.length;i++){
				let upload_timestamp = this.files[i].upload_timestamp;
				let filename1 = this.files[i].filename;
				console.log(filename1)
				upload_timestamp = formatDate(new Date(upload_timestamp), 'yyyy-MM-dd hh:mm:ss');
				this.files[i].upload_timestamp = upload_timestamp
			}
		},
		//查询文件
		async getFilesByMemo() {
			//this.listLoading = true;
			const res = await getFileByMemo(this.filters.types);
			if(res.code!==0 && this.filters.types !==""){
				this.$message({
					message: res.description,
					type: 'error'
				});
				this.files=""
			}else if(this.filters.types ==""){
				this.$message({
					message: "请输入查询信息",
					type: 'error'
				});
				this.files=""
			}else{
				console.log(res.list)
				if(res.list.length===0){
					this.filters.types=""
					this.files="";
                    this.page = 1;
                    this.total = 0
				}else{
					let list = new Array();
					for(let i=0;i<res.list.length;i++){
						list.push(res.list[i]);
						this.files = list;
						this.filters.types=""
                        this.page = 1;
						this.total = this.files.length
					}
				}
			}
		},
		//获取文件
		getFile(event) {
			this.file = event.target.files[0];
			console.log(this.file);
		},
		//上传文件
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
							if(res.code===0){
								this.$message({
									message: '上传成功',
									type: 'success'
								});
								this.addFormVisible=false;
								let user = JSON.parse(sessionStorage.getItem('user'));
								this.username = user.username;
								this.getFile()
							}else{
								this.$message({
									message: res.description,
									type: 'error'
								});
							}
						}).catch((error)=>{})
				}).catch(err => {})
			}
		},
		//预览/下载文件
		async handlePlay(index, row) {
			console.log(row.type);
			if(row.type === 0){
				this.playingMusic = true;
			}else{
				this.playingVideo = true;
			}
			let para = {filename: row.filename};
			const playfile = await downloadFiles(para.filename);
			this.baseUr = "http://172.16.10.66:8080/crbt/10086/files/"+row.filename
			console.log(playfile)
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
            this.getFiles();
		},
		//显示新增文件界面
		handleAdd: function () {
			this.addFormVisible = true;
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
	.fa-play-circle-o{
		cursor:pointer;
		font-size: 20px
	}
	.fa-play-circle-o:hover{
		color:deepskyblue;
	}
</style>
