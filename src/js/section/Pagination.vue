<template>
	<div
		v-if="pageMode=='waterfall' || store.page_count>1 || pagebar"
		:class="{'st-pagination-have-msg': pagebar}"
		class="st-pagination">
		<div v-if="pageMode=='waterfall'" class="st-pagination-waterfall">
			<el-button size="small" icon="el-icon-arrow-left" :disabled="!store.hasPrePage" @click="load('loadPrePage')">{{locale.previousPage}}</el-button>
			<el-button size="small" :disabled="!store.hasNextPage" @click="load('loadNextPage')">{{locale.nextPage}}<i class="el-icon-arrow-right el-icon--right"></i></el-button>
		</div>
		<el-pagination
			v-else
		  layout="prev, pager, next, jumper"
		  :current-page.sync="store.page"
		  :page-count="store.page_count">
		</el-pagination>
		<div v-if="pagebar" class="st-pagination-msg" v-text="msg"></div>
	</div>
</template>
<script>
	import {tmpl} from '../util';
	export default {
		inject: ['store', 'pageMode', 'pagebar', 'params', 'locale'],
		data(){
			console.log(this.pagebar)
			return {
				msg: ''
			}
		},
		watch: {
			'store.page'(){
				this.generateMsg();
			},
			'store.page_count'(){
				this.generateMsg();
			},
			'store.total'(){
				this.generateMsg();
			}
		},
		methods:{
			load(action){
				this.store.loadAction = action;
			},
			generateMsg(){
				if(!this.pagebar) return;
				let page = this.store.page,
					pageCount = this.store.page_count,
					pageSize = this.params.count,
					total = this.store.total;
				if(total<=0) {
					this.msg = this.pagebar.emptyMsg||this.locale.emptyMsg;
				} else if(this.pagebar.msg){
					let msg = tmpl(this.pagebar.msg, {page, pageCount, pageSize, total});
					this.msg = msg;
				}
			}
		}
	}
</script>
<style>
	.st-pagination-have-msg{
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.st-pagination{
		padding: 5px 0 7px;
		border-top: 1px solid #d0d0d0;
	}
	.st-pagination-waterfall{
		text-align: center;
	}
	.st-pagination-msg{
		border-left: 1px solid #d0d0d0;
		color: #4b4c4c;
		margin-left: 10px;
		padding-left: 10px;
	}
</style>