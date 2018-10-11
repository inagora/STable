<template>
	<table
		class="st-table-head"
		:class="{'st-table-locked-head': locked, 'st-table-free-head': !locked}"
		:style="{'width':width+'px'}">
		<colgroup>
			<template v-for="(col, colIdx) of columns">
				<col v-if="!locked || col.locked" :width="col._width" :key="colIdx" />
			</template> 
		</colgroup>
		<thead>
			<tr class="st-table-head-tr">
				<template v-for="(col, colIdx) of columns">
					<th
						v-if="!locked || col.locked"
						class="st-table-th"
						:class="[{
							'st-table-th-rownumber':col.type=='rownumber',
							'st-table-th-sortable':col.sortable
							}, col.cls]"
						:style="col.style"
						:key="colIdx">
						<div v-if="col.type=='radio'" class="st-table-cell">
							<div class="st-table-th-text st-table-cell-nowrap">&nbsp;</div>
						</div>
						<label v-else-if="col.type=='checkbox'" class="st-table-cell st-table-label-cell" @click="selectAll">
							<input type="checkbox" v-model="chkAll" />
						</label>
						<div
							v-else-if="col.type!='pad'"
							class="st-table-cell"
							draggable="true"
							@dragstart="$emit('st_dragstart',{colIdx, evt:$event})"
							@dragover="$emit('st_dragover', {colIdx, evt:$event})"
							@drop="$emit('st_drop',$event)"
							@dragend="$emit('st_dragend')"
							@dragleave="$emit('st_dragleave')"
							@click="sort(col)"
							:title="col.text">
							<div class="st-table-th-text st-table-cell-nowrap" v-text="col.text||'&nbsp;'"></div>
							<el-tooltip
								v-if="col.desc"
								placement="top"
								:content="col.desc"
								popper-class="st-table-th-tip">
								<el-button icon="el-icon-info" size="mini" type="text" class="st-table-th-tip-icon" title=""></el-button>
							</el-tooltip>
							<div v-if="col.sortable" class="st-table-th-sort" :class="[store.sortKey==col.dataIndex?(store.sortDirection=='asc'?'el-icon-caret-top':'el-icon-caret-bottom'):'el-icon-d-caret']"></div>
						</div>
					</th>
				</template>
			</tr>
		</thead>
	</table>
</template>
<script>
export default {
	props: ['locked', 'width', 'columns', 'checkedAll'],
	inject: {
		store:'store', 
		defaultSortDirection:'sortDirection'
	},
	data(){
		return {chkAll: this.checkedAll};
	},
	watch: {
		checkedAll(val){
			this.chkAll = val;
		}
	},
	methods: {
		selectAll(){
			this.store.$emit('selectall',!this.checkedAll);
		},
		sort(col){
			if(col.sortable){
				if(this.store.sortKey == col.dataIndex) {
					this.store.sortDirection = this.store.sortDirection=='asc'?'desc':'asc';
				} else {
					this.store.sortKey = col.dataIndex;
					this.store.sortDirection = this.defaultSortDirection;
				}
			}
		}
	}
}
</script>