<template>
	<div
		v-show="columns.length>0"
		class="st-table-body-box"
		@mousedown="blur"
		:class="{
			'st-table-body-left':locked=='left',
			'st-table-body-right':locked=='right',
			'st-table-body-free': !locked
		}">
		<table
			class="st-table-body"
			:style="{
				width: tableWidth+'px'
			}">
			<col
				v-for="(col, idx) of columns"
				:width="col._width"
				:key="idx"/>
			<tbody>
				<tr
					v-for="(record, idx) of recordList"
					:key="idx"
					class="st-table-body-tr"
					@mouseenter="store.hlRowNum=idx"
					@mousedown="store.focusRowNum=idx"
					:class="{
						'st-table-body-tr-hl': idx==store.hlRowNum,
						'st-table-body-tr-focus':idx==store.focusRowNum
					}"
					:style="{height:recordsHeight[idx]}">
					<td
						v-for="(col, colIdx) of columns"
						:key="colIdx"
						:rowspan="record._wd_aux.merges[col.dataIndex]"
						class="st-table-body-td"
						:class="[
							col.cls,
							{
								'st-table-td-rownumber':col.type=='rownumber'
							}
						]"
						:style="col.style">
						<label v-if="col.type=='radio'" class="st-table-label-cell st-table-cell">
							<input type="radio" :value="idx" v-model="store.radioVal" />
						</label>
						<label v-else-if="col.type=='checkbox'" class="st-table-label-cell st-table-cell">
							<input type="checkbox" :value="idx" v-model="store.checkboxVal" />
						</label>
						<div v-else-if="col.type=='rownumber'" class="st-table-cell" v-text="record._wd_aux.rownumber"></div>
						<template v-else-if="col.type=='text'">
							<template v-if="sublistAt.includes(col.dataIndex)">
								<div
									v-for="(_text,_textIdx) of record[col.dataIndex]"
									:key="_textIdx"
									class="st-table-cell"
									:class="{'st-table-cell-nowrap':!col.cellWrap}"
									v-text="_text"></div>
							</template>
							<div v-else class="st-table-cell" :class="{'st-table-cell-nowrap':!col.cellWrap}" v-text="record[col.dataIndex]"></div>
						</template>
						<div v-else-if="col.type=='render'" class="st-table-cell" :class="{'st-table-cell-nowrap':!col.cellWrap}" v-html="record['_'+col.dataIndex+'_render_val']"></div>
						<template v-else-if="col.type=='image'">
							<template v-if="sublistAt.includes(col.dataIndex)">
								<div
									v-for="(_src,_srcIdx) of record[col.dataIndex]"
									:key="_srcIdx">
									<img :src="_src" :style="col.imgStyle" />
								</div>
							</template>
							<div v-else>
								<img :src="record[col.dataIndex]" :style="col.imgStyle" />
							</div>
						</template>
						<div v-else-if="col.type=='button'" class="st-table-btn-box st-table-cell">
							<x-button
								v-for="btn of col.buttons"
								:key="btn"
								:type="btn.type"
								:size="btn.size"
								:icon="btn.icon"
								@click="btnClick(btn, record, $event)">{{btn.text}}</x-button>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import XButton from '../com/Button.vue';
export default {
	inject: ['store', 'groupBy','sublistAt', 'layoutMode'],
	props: ['locked', 'columns', 'recordList', 'tableWidth', 'recordsHeight'],
	components: {XButton},
	data(){
		return {
			tableStyle: {}
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
		}
	}
}
</script>

<style lang="scss">
.st-table-body{
	table-layout: fixed;
	border-collapse: collapse;
	border-spacing: 0;
	background-color: #fff;

	&-left{
		border-right: 1px solid #e8eaec;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
		overflow: hidden;
	}
	&-right{
		border-left: 1px solid #e8eaec;
		position: absolute;
		top: 0;
		right: 0;
		z-index: 1;
		overflow: hidden;
	}
	
	&-free{
		flex: 1;
		overflow-x: auto;
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
}
.st-table-btn-box .st-btn{
	margin-right: 10px;
	margin-bottom: 7px;
}
.st-fixed-stable .st-table-body-free{
	overflow-y: scroll;
	overflow-x: auto;
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
}
</style>
