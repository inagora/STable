<template>
	<div
		v-show="columns.length>0"
		class="st-table-body-box"
		:class="{
			'st-table-body-left':locked=='left',
			'st-table-body-right':locked=='right',
			'st-table-body-free': !locked
		}"
		@mousedown="blur"
	>
		<table
			class="st-table-body"
			:style="{
				width: tableWidth+'px'
			}"
		>
			<col
				v-for="(col, idx) of columns"
				:key="idx"
				:width="col._st_width"
			/>
			<tbody>
				<tr
					v-for="(record, idx) of recordList"
					:key="idx"
					class="st-table-body-tr"
					:class="{
						'st-table-body-tr-hl': idx==store.hlRowNum,
						'st-table-body-tr-focus':idx==store.focusRowNum
					}"
					:style="{height:recordsHeight[idx]}"
					@mouseenter="store.hlRowNum=idx"
					@mousedown="store.focusRowNum=idx"
					@click="store.emit('rowclick', record, $event)"
				>
					<td
						v-for="(col, colIdx) of columns"
						:key="colIdx"
						class="st-table-body-td"
						:class="[
							col.cls,
							{
								'st-table-td-rownumber':col.type=='rownumber'
							}
						]"
						:style="col.style"
						@click="cellClick(record, col, $event);store.emit('cellclick', record, col, $event)"
					>
						<label v-if="col.type=='radio'" class="st-table-label-cell st-table-cell">
							<input v-model="store.radioVal" :value="idx" type="radio" />
						</label>
						<label v-else-if="col.type=='checkbox'" class="st-table-label-cell st-table-cell">
							<input v-model="store.checkboxVal" :value="idx" type="checkbox" />
						</label>
						<div v-else-if="col.type=='rownumber'" class="st-table-cell" v-text="record._st_aux.rownumber"></div>
						<template v-else-if="col.type=='text'">
							<template v-if="sublistAt.includes(col.dataIndex)">
								<div
									v-for="(_text,_textIdx) of record[col.dataIndex]"
									:key="_textIdx"
									class="st-table-cell"
									:class="{'st-table-cell-nowrap':!col.cellWrap}"
									v-text="_text"
								></div>
							</template>
							<div
								v-else
								class="st-table-cell"
								:class="{'st-table-cell-nowrap':!col.cellWrap}"
								v-text="record[col.dataIndex]"
							></div>
						</template>
						<div
							v-else-if="col.type=='render'"
							class="st-table-cell"
							:class="{'st-table-cell-nowrap':!col.cellWrap}"
							v-html="record._st_aux.render[col.dataIndex]"
						></div>
						<div v-else-if="col.type=='button'" class="st-table-btn-box st-table-cell">
							<template v-for="(btn, btnIdx) of col.buttons">
								<x-button
									v-if="record._st_aux.btnsVisible[col.dataIndex][btnIdx]"
									:key="btnIdx"
									:conf="btn"
									@click="btnClick(btn, record, $event)"
								/>
							</template>
						</div>
						<div
							v-else-if="col.type=='option'"
							class="st-table-cell"
							:class="{'st-table-cell-nowrap':!col.cellWrap}"
							v-text="record._st_aux.option[col.dataIndex]"
						></div>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import XButton from '../com/Button.vue';
export default {
	inject: [
		'store',
		'sublistAt', 
		'layoutMode'
	],
	components: {XButton},
	props: {
		locked:{
			type: [Boolean, String],
			default: false
		}, 
		columns: {
			type: Array,
			required: true
		}, 
		recordList: {
			type: Array,
			required: true
		}, 
		tableWidth: {
			type: Number,
			required: true
		},
		recordsHeight: {
			type: Array,
			required: true
		}
	},
	methods: {
		btnClick(btn, record, evt){
			if(btn.click) {
				btn.click.call(this.$parent.$parent, record, btn, evt);
			}
		},
		blur(evt){
			if(evt.target.classList.contains('st-table-body-box')){
				this.store.focusRowNum = -1;
			}
		},
		cellClick(record, col, evt){
			if(col.click)
				col.click.call(this.$parent.$parent, record, col, evt);
		}
	}
};
</script>

<style lang="scss">
.st-table-body{
	table-layout: fixed;
	border-collapse: collapse;
	border-spacing: 0;
	background-color: #fff;

	&-left{
		border-right: 1px solid #e8eaec;
		z-index: 1;
	}
	&-right{
		border-left: 1px solid #e8eaec;
		z-index: 1;
	}
	
	&-free{
		flex: 1;
		overflow-x: auto;
		overflow-y: hidden;
	}

	&-tr{
		border-bottom: 1px solid #e8eaec;
	}
	&-tr:nth-of-type(2n) {
		background-color: #fafafa;
	}
	& &-tr-hl{
		background-color: #f5f5f5;
	}
	& &-tr-focus{
		background-color: #ffefbb;
	}
}
.st-table-btn-box.st-table-cell{
	padding-bottom: 0;
	display: flex;
	flex-wrap: wrap;
}
.st-table-cell-nowrap{
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.st-table-btn-box .st-btn{
	margin-right: 10px;
	margin-bottom: 7px;
}
</style>
