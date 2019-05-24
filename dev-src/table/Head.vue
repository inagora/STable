<template>
	<div
		v-if="columns.length>0"
		class="st-table-head-box"
		:class="{
			'st-table-head-left':locked=='left',
			'st-table-head-right':locked=='right',
			'st-table-head-free': !locked,
			'st-table-head-safari-patch': locked&&isSafari
		}">
		<table
			class="st-table-head"
			:style="{width: tableWidth+'px'}">
			<thead>
				<tr class="st-table-head-tr">
					<th
						v-for="(col, colIdx) of columns"
						:key="colIdx"
						class="st-table-head-th"
						:class="[col.cls]"
						:style="[col.style, {width: col._width+'px'}]"
						@mousemove="$emit('drag', {column:col, evt:$event})"
						@mouseup="$emit('drop', {column:col, evt:$event})">
						<div v-if="col.type=='radio'" class="st-table-cell">
							<div class="st-table-head-text">&nbsp;</div>
						</div>
						<label v-else-if="col.type=='checkbox'" class="st-table-cell st-table-cell-label" @click="selectAll">
							<input type="checkbox" v-model="chkAll" />
						</label>
						<div
							v-else-if="col.type=='rownumber'"
							class="st-table-cell">
							<div class="st-table-head-text st-table-cell-wrap" v-text="col.text"></div>
						</div>
						<template v-else-if="col.type!='pad'">
							<div
								class="st-table-cell"
								:class="{'st-table-head-sortable': col.sortable}"
								:title="col.text"
								@mousedown="$emit('dragprepare', col)">
								<div class="st-table-head-text st-table-cell-wrap" v-text="col.text||'&nbsp;'"></div>
								<div v-if="col.sortable" class="st-table-head-sort-icon st-iconfont" :class="[store.sortKey==col.dataIndex?(store.sortDirection=='asc'?'st-icon-sort-ascending':'st-icon-sort-descending'):'st-icon-swap']"></div>
							</div>
							<div
								class="st-iconfont st-icon-caret-down st-table-head-menu-btn"
								@click="showMenu"></div>
						</template>
					</th>
				</tr>
			</thead>
		</table>
	</div>
</template>

<script>
import {isSafari} from '../util';
import XMenu from './Menu';
/**
 * @param {String} column.desc 列头的描述
 */
export default {
	props: ['locked', 'columns', 'tableWidth', 'recordsHeight'],
	inject: ['store'],
	data(){
		return {
			isSafari
		}
	},
	mounted(){
		if(isSafari){
			setTimeout(()=>{
				this.$el.style.display = 'block';
			}, 0);
		}
	},
	destroyed(){
		if(this.menu) {
			this.menu.$destroy();
			this.menu = null;
		}
	},
	methods: {
		showMenu(){
			if(!this.menu){
				let el = document.createElement('div');
				document.body.appendChild(el);
				this.menu = new Vue({
					el,
					template: '<x-menu></x-menu>',
					components: {XMenu}
				});
			}
		}
	}
}
</script>

<style lang="scss">
.st-table-head-free{
	width: 100%;
	overflow-x: auto;
	z-index: 1;
}
.st-table-head-free::-webkit-scrollbar{
	display: none;
}
.st-table-head-left{
	position: absolute;
	left: 0;
	top: 0;
	z-index: 2;
}
.st-table-head-right{
	position: absolute;
	right: 0;
	top: 0;
	z-index: 2;
}

.st-table-head-safari-patch{
	display: none;
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
		font-weight: 400;
		text-align: left;
		user-select: none;
		-webkit-user-select: none;
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

	&-th:hover .st-table-cell{
		background-image: none;
		background-color: #f0f0f0;
	}
}
</style>
