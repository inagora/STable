<template>
	<div v-if="pageMode=='waterfall' || store.page_count>1" class="st-pagination">
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
	</div>
</template>
<script>
	export default {
		inject: ['store', 'pageMode', 'locale'],
		methods:{
			load(action){
				this.store.loadAction = action;
			}
		}
	}
</script>
<style>
	.st-pagination{
		padding: 5px 0 7px;
		border-top: 1px solid #d0d0d0;
	}
	.st-pagination-waterfall{
		text-align: center;
	}
</style>