<template>
	<table class="st-table-body" :class="[locked?'st-table-locked-body':'st-table-free-body']" :style="{width:tWidth+'px'}">
		<colgroup>
			<template v-for="(col,idx) of columns">
				<col v-if="!locked || col.locked" :width="col._width" :key="idx" />
			</template> 
		</colgroup>
		<tbody>
			<tr v-for="(record,idx) of recordList" :key="idx" @mouseenter="$emit('hl', idx)" @click="$emit('focus',idx);store.$emit('rowclick',{record, evt:$event})" class="st-table-body-tr" :class="{'st-table-body-tr-hl': idx==hlRowNum, 'st-table-body-tr-focus':idx==focusRowNum}">
				<template v-for="(col, colIdx) of columns">
					<td v-if="!locked || col.locked" :key="colIdx" class="st-table-td" :class="[col.cls||'',col.type=='rownumber'?'st-table-td-rownumber':'']" :style="col.style" @click="store.$emit('cellclick', {record, col, evt:$event})">
						<template v-if="col.type=='pad'"></template>
						<label v-else-if="col.type=='radio'" class="st-table-label-cell">
								<input type="radio" :value="idx" v-model="store.radioVal" />
						</label>
						<label v-else-if="col.type=='checkbox'" class="st-table-label-cell">
								<input type="checkbox" :value="idx" v-model="store.checkboxVal" />
						</label>
						<div v-else-if="col.type=='rownumber'" class="st-table-cell" v-text="idx+1"></div>
						<div v-else-if="col.type=='text'" class="st-table-cell" :class="{'st-table-cell-nowrap':!col.cellWrap}" v-text="record[col.dataIndex]||' '"></div>
						<div v-else-if="col.type=='render'" class="st-table-cell" :class="{'st-table-cell-nowrap':!col.cellWrap}" v-html="record['_'+col.dataIndex+'_render_val']"></div>
						<div v-else-if="col.type=='image'">
							<img :src="record[col.dataIndex]" :style="col.imgStyle" />
						</div>
						<div v-else-if="col.type=='button'" class="st-table-btn-box">
							<el-button
								v-for="(btn,idx) in col.buttons"
								:key="idx"
								:icon="btn.icon"
								:type="btn.type||'primary'"
								@click="btnClick(btn, record, $event)"
								size="mini">{{btn.text}}</el-button>
						</div>
						<div v-else-if="col.type=='tag'">
							<el-tag v-for="tag in record[col.dataIndex]" :key="tag[0]" :type="tag[1]">{{tag[0]}}</el-tag>
						</div>
					</td>
				</template>
			</tr>
			<tr v-if="haveFx" class="st-table-body-tr">
				<template v-for="(col, colIdx) of columns">
					<td v-if="!locked || col.locked" :key="colIdx" class="st-table-td" :class="[col.cls||'',col.type=='rownumber'?'st-table-td-rownumber':'']" :style="col.style">
						<template v-if="col.type=='pad'"></template>
						<div v-else-if="col.type=='rownumber'" class="st-table-cell">计算</div>
						<div v-else class="st-table-cell" :class="{'st-table-cell-nowrap':!col.cellWrap}" v-text="fxResult[col.dataIndex]||' '"></div>
					</td>
				</template>
			</tr>
		</tbody>
	</table>
</template>
<script>
export default {
	inject: ['store'],
	props: ['columns', 'recordList', 'locked', 'tWidth', 'hlRowNum', 'focusRowNum', 'checkedAll', 'haveFx', 'fxResult'],
	mounted(){
		this.store.$on('selectall', (selectall)=>{
			if(selectall) {
				this.store.checkboxVal = this.recordList.map((item,idx)=>idx);
			} else {
				this.store.checkboxVal = [];
				this.store.radioVal = '';
			}
		});
	},
	watch: {
		'store.checkboxVal': function(){
			let checkedAll = this.recordList.every((item, idx)=>this.store.checkboxVal.includes(idx));
			this.$emit('update:checkedAll', checkedAll);
		}
	},
	methods: {
		btnClick(btn, record, evt){
			if(btn.click) {
				btn.click.call(this.$root, record, btn, evt);
			}
		}
	}
}
</script>
<style>
.st-table-btn-box{
	padding: 7px 8px 0;
}
.st-table-btn-box button{
	margin-bottom: 8px;
}
</style>