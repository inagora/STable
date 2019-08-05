<template>
	<div
		v-if="columns.length>0"
		class="st-table-head-box"
		:class="{
			'st-table-head-left':locked=='left',
			'st-table-head-right':locked=='right',
			'st-table-head-free': !locked
		}"
	>
		<table
			class="st-table-head"
			:style="{width: tableWidth+'px'}"
		>
			<thead>
				<tr class="st-table-head-tr">
					<th
						v-for="(col, colIdx) of columns"
						:key="colIdx"
						class="st-table-head-th"
						:class="[col.cls, {
							'st-table-head-th-hover':col._hl
						}]"
						:style="[col.style, {
							width: col._st_width+'px'
						}]"
					>
						<div v-if="col.type=='radio'" class="st-table-cell">
							<div class="st-table-head-text">
								&nbsp;
							</div>
						</div>
						<label v-else-if="col.type=='checkbox'" class="st-table-cell st-table-cell-label" @click="selectAll">
							<input v-model="chkAll" type="checkbox" />
						</label>
						<div
							v-else-if="col.type=='rownumber'"
							class="st-table-cell"
						>
							<div class="st-table-head-text st-table-cell-wrap" v-text="col.text"></div>
						</div>
						<template v-else-if="col.type=='pad'">
							<div v-if="col._width>0" class="st-table-cell">
								&nbsp;
							</div>
						</template>
						<template v-else>
							<div
								class="st-table-cell"
								:class="{
									'st-table-head-sortable': col.sortable
								}"
								:title="col.text"
								@mousedown="$emit('dragprepare', col)"
								@mousemove="$emit('drag', {
									column:col, evt:$event
								})"
								@mouseup="$emit('drop', {
									column:col, evt:$event
								})"
							>
								<div class="st-table-head-text st-table-cell-wrap" v-text="col.text||'&nbsp;'"></div>
								<div
									v-if="col.sortable"
									class="st-table-head-sort-icon st-iconfont"
									:class="[store.sortKey==col.dataIndex?(store.sortDirection=='asc'?'st-icon-sort-ascending':'st-icon-sort-descending'):'st-icon-swap']"
								></div>
							</div>
							<div
								class="st-iconfont st-icon-caret-down st-table-head-menu-btn"
								@click="$emit('menushow', {
									column:col, evt:$event
								})"
							></div>
							<div
								class="st-table-head-resizer"
								@mousedown="$emit('resizestart', {
									column:col, evt:$event
								})"
							></div>
						</template>
					</th>
				</tr>
			</thead>
		</table>
	</div>
</template>

<script>
/**
 * @param {String} column.desc 列头的描述
 */
export default {
	props: {
		locked:{
			type: [Boolean, String],
			required: true
		},
		columns:{
			type: Array,
			required: true
		},
		tableWidth: {
			type: Number,
			default: 0
		},
		recordsHeight:{
			type: Array,
			default(){
				return [];
			}
		}
	},
	inject: ['store']
};
</script>

<style lang="scss">
.st-table-head-free{
	flex: 1;
	overflow-x: hidden;
	z-index: 1;
}
.st-table-head-left{
	z-index: 2;
}
.st-table-head-right{
	z-index: 2;
}

.st-table-head{
	table-layout: fixed;
	border-collapse: collapse;
	border-spacing: 0;
	background-color: #fff;

	&-th{
		border-right: 1px solid #d0d0d0;
		color: #191919;
		font-size: 14px;
		line-height: 21px;
		font-weight: 400;
		text-align: left;
		-webkit-user-select: none;
		user-select: none;
		position: relative;
	}
	&-right{
		border-left: 1px solid #d0d0d0;
	}
	&-right &-th:last-of-type{
		border-right: none;
	}
	&-sortable{
		cursor: pointer;
	}
	& &-sort-icon{
		font-size: 14px;
		opacity: 0.6;
		margin-left: 5px;
		font-weight: 400;

		&.st-icon-swap{
			transform: rotate(90deg);
		}
	}

	&-menu-btn{
		opacity: 0;
		position: absolute;
		top: 0;
		right: 0;
		width: 20px;
		height: 100%;

		display: flex;
		justify-content: center;
		align-items: center;
		background: #fff;
		border-left: 1px solid #d0d0d0;
		cursor: pointer;
	}
	& &-menu-btn{
		font-size: 14px;
		font-weight: 400;
	}
	&-th-hover &-menu-btn,
	&-th:hover &-menu-btn{
		opacity: 0.6;
	}

	.st-table-cell{
		display: flex;
		align-items: center;
		justify-content: flex-start;
		background-image: linear-gradient(180deg,#fdfdfd,#f8f8f8);
		word-break: normal;
	}

	&-th-hover .st-table-cell,
	&-th:hover .st-table-cell{
		background-image: none;
		background-color: #f0f0f0;
	}

	&-resizer{
		position: absolute;
		top: 0;
		right: 0;
		width: 3px;
		height: 100%;
		overflow: hidden;
		z-index: 2;
		background-color: #fff;
		opacity: 0;
		cursor: ew-resize;
	}
}
</style>
