<template>
	<div class="st-toolbar st-pn">
		<div
			v-if="pageMode == 'waterfall' || pageMode == 'waterfall-v2'"
			class="st-pn-waterfall"
		>
			<x-button
				:conf="{
					icon: 'st-icon st-icon-left',
					size: 'small',
					disabled: !store.hasPrePage,
					title: locale.previousPage
				}"
				@click="store.loadAction = 'loadPrePage'"
			/>
			<x-button
				:conf="{
					icon: 'st-icon st-icon-left st-pn-right',
					size: 'small',
					disabled: !store.hasNextPage,
					title: locale.nextPage
				}"
				@click="store.loadAction = 'loadNextPage'"
			/>
		</div>
		<div v-else class="st-pn-normal">
			<x-button
				:conf="{
					icon: 'st-icon st-icon-left',
					size: 'small',
					disabled: store.page <= 1,
					title: locale.previousPage
				}"
				@click="jumpTo(store.page - 1)"
			/>
			<x-button
				v-for="(item, idx) of pnoList"
				:key="idx"
				:pno="store.page"
				:conf="{
					cls: store.page == item.pno ? 'st-pn-active' : '',
					size: 'small',
					text: item.text || item.pno
				}"
				@click="jumpTo(item.pno)"
			/>
			<x-button
				:conf="{
					icon: 'st-icon st-icon-left st-pn-right',
					size: 'small',
					title: locale.nextPage
				}"
				@click="jumpTo(store.page + 1)"
			/>
		</div>
		<select
			v-if="pagination.pageSizeOptions"
			v-model="pageSize"
			class="st-pn-size"
		>
			<option
				v-for="(size, idx) of pagination.pageSizeOptions"
				:key="idx"
				:value="size"
				v-text="size + ' ' + locale.pageSizeUnit"
			/>
		</select>
		<div class="st-toolbar-separator">
			&nbsp;
		</div>
		<x-button
			:conf="{
				icon: 'st-icon st-icon-sync',
				size: 'small',
				title: locale.refresh
			}"
			@click="refresh"
		/>
		<div class="st-flex-padding"></div>
		<div class="st-pn-msg" v-text="msg"></div>
	</div>
</template>

<script>
import XButton from './com/Button.vue';
export default {
	inject: {
		store: 'store',
		pageMode: 'pageMode',
		pagination: {
			default: {}
		},
		params: 'params',
		locale: 'locale'
	},
	components: { XButton },
	data() {
		return {
			msg: '',
			pageSize: this.params.count,
			pnoList: [{ pno: 1 }]
		};
	},
	watch: {
		'store.pageCount'() {
			this.buildPno();
		},
		'store.page'() {
			this.buildPno();
		}
	},
	methods: {
		jumpTo(pno) {
			if (pno > 0 && pno <= this.store.pageCount) this.store.page = pno;
		},
		buildPno() {
			let pageCount = this.store.pageCount;
			let list = [];
			let page = this.store.page;
			if (pageCount <= 9) {
				for (let i = 1; i <= pageCount; i++) list.push({ pno: i });
			} else {
				//页码总共显示9个(包括...符号)，让切换时页码总长度不会变化，这样点下一页快速切换时，按钮位置不会跳跃
				if (page <= 5) {
					for (let i = 1; i <= 7; i++) {
						list.push({ pno: i });
					}
					list.push({
						pno: Math.floor((7 + pageCount) / 2),
						text: '...'
					});
					list.push({ pno: pageCount });
				} else if (pageCount - page <= 4) {
					let start = pageCount - 6;
					list.push({ pno: 1 });
					list.push({
						pno: Math.floor((1 + start) / 2),
						text: '...'
					});
					for (let i = start; i <= pageCount; i++) {
						list.push({ pno: i });
					}
				} else {
					let start = page - 2,
						end = page + 2;
					list.push({ pno: 1 });
					list.push({
						pno: Math.floor((1 + start) / 2),
						text: '...'
					});
					for (let i = start; i <= end; i++) {
						list.push({ pno: i });
					}
					list.push({
						pno: Math.floor((end + pageCount) / 2),
						text: '...'
					});
					list.push({ pno: pageCount });
				}
			}

			this.pnoList = list;
		},
		refresh() {
			this.$parent.$refs.table[0].refresh();
		}
	}
};
</script>

<style lang="scss">
.st-pn {
	padding-right: 10px;
	padding-bottom: 10px;
	align-items: center;

	&-waterfall,
	&-normal {
		display: flex;
	}
	.st-btn {
		border-color: transparent;
		margin-bottom: 0;
		min-width: 30px;
		padding: 0 3px;
	}
	.st-btn-default:hover:disabled {
		background-color: #fff;
		border-color: transparent;
		color: #212529;
	}
	& &-active {
		color: #1890ff;
		// border-color: #1890ff;
		font-weight: 500;
	}
	.st-toolbar-separator {
		margin-bottom: 0;
	}

	&-size {
		font-size: 12px;
		margin-right: 14px;
	}

	&-right {
		transform: rotate(180deg);
	}
}
@media screen and (max-width: 375px) {
	.st-pn {
		justify-content: space-between;
		.st-flex-padding {
			display: none;
		}
		.st-pn-normal {
			flex: 1;
			display: flex;
			justify-content: space-around;
		}
		.st-btn {
			min-width: 0;
		}
	}
}
</style>
