<template>
	<div
		ref="selectbox"
		v-clickoutside="handleClose"
		class="st-select"
		:class="{ 'st-select-focus': visible }"
		@click.stop="showMenu"
	>
		<div
			v-if="multiple"
			ref="tags"
			class="st-select-tags"
			@keydown.down.prevent="navigateOptions('next')"
			@keydown.up.prevent="navigateOptions('prev')"
		>
			<span v-if="selected.length" class="st-select-tags-box">
				<x-tag
					v-for="(item, index) in selected"
					:key="index"
					type="info"
					class="st-select-tags-item"
					:closable="true"
					@close="deleteTag($event, item)"
				>
					<span class="st-select-tags-text">{{ item.label }}</span>
				</x-tag>
				<input
					v-if="filterable"
					type="text"
					class="st-select-input"
					:value="query"
					@input="handleQueryChange"
					@keydown.delete="deletePrevTag"
					@keydown.enter.prevent="handleOption"
				/>
			</span>
			<span v-else>{{ placeholder }}</span>
			<div
				class="st-icon st-icon-caret-down"
				:class="{ 'st-select-input-uparrow': visible }"
			></div>
		</div>
		<template v-else>
			<input
				:value="
					inputFoucus
						? query
						: selected && selected.length > 0
						? selected[0].label
						: selected
				"
				type="text"
				@focus="inputFoucus = true"
				@blur="inputFoucus = false"
				@input="handleQueryChange"
				:placeholder="placeholder"
				class="st-select-input"
			/>
			<div
				class="st-icon st-icon-caret-down"
				:class="{ 'st-select-input-uparrow': visible }"
			></div>
		</template>

		<div
			v-show="visible"
			class="st-select-menu"
			:style="{ 'min-width': inputW + 'px', 'margin-top': marginT + 'px' }"
		>
			<template v-if="filterOptions.length == 0">
				<ul v-show="realOptions.length > 0 && visible">
					<li
						v-for="(item, index) in realOptions"
						:key="getValueKey(item)"
						class="st-select-menu-item"
						:class="[
							{ 'st-select-menu-item-hover': index == hoverIndex },
							{ 'st-select-menu-item-select': selected.includes(item) }
						]"
						@click.stop="setSelected(index, item)"
						v-text="item.label"
					></li>
				</ul>
				<div
					v-show="realOptions.length == 0 && visible"
					class="st-select-menu-none"
				>
					暂无数据
				</div>
			</template>
			<template v-if="filterOptions.length > 0">
				<ul v-show="visible">
					<li
						v-for="(item, index) in filterOptions"
						:key="getValueKey(item)"
						class="st-select-menu-item"
						:class="[{ 'st-select-menu-item-hover': index == hoverIndex }]"
						@click.stop="setSelected(index, item)"
						@keydown.enter.prevent="setSelected(index, item)"
						v-text="item.label"
					></li>
				</ul>
			</template>
		</div>
	</div>
</template>

<script>
import XTag from './tag.vue';
import Tool from './tool';
import { loadJs, $type } from '../util/util';

export default {
	components: { XTag },
	directives: { clickoutside: Tool._clickOutside },
	mixins: [Tool],
	props: {
		filterable: {
			type: Boolean,
			default: true
		},
		allowCreate: {
			type: Boolean,
			default: true
		},
		multiple: {
			type: Boolean,
			default: false
		},
		options: {
			type: [Array, Object],
			default() {
				return [];
			}
		},
		list: {
			type: [Array, Object],
			default() {
				return [];
			}
		},
		valueKey: {
			type: String,
			default: 'value'
		},
		placeholder: {
			type: String,
			default: '请选择'
		},
		defaultValue: {
			type: [Array, String],
			default() {
				return [];
			}
		}
	},
	data() {
		return {
			selected: [],
			visible: false,
			hoverIndex: -1,
			query: '',
			filterOptions: [],
			inputW: 80,
			marginT: 50,
			realOptions: [],
			i: 0,
			inputFoucus: false
		};
	},
	// computed: {
	// 	marginT: function() {
	// 		this.$nextTick(()=>{
	// 			return 100;
	// 		})
	// 	}
	// },
	watch: {
		selected: {
			handler(val) {
				this.selected = val;
				if (this.selected) {
					this.$emit('selectchange', this.selected);
					this.$emit('validate', this.selected.toString());
				}
			}
		},
		visible: {
			handler(val) {
				this.visible = val;
			}
		},
		filterOptions: {
			deep: true,
			handler(val) {
				this.filterOptions = val;
			}
		},
		query: {
			handler(val) {
				this.query = val;
				if (val == '') {
					this.filterOptions = [];
				}
			}
		}
	},
	mounted() {
		this.$nextTick(() => {
			this.inputW = this.$refs.tags ? this.$refs.tags.clientWidth + 36 : 116;
		});
	},
	created() {
		let def = this.defaultValue;
		let tmpList = this.options ? this.options : this.list;
		if (def && def != '') {
			this.$nextTick(() => {
				let def_exist = this.findVal(def, tmpList);
				if (def_exist && def_exist.length > 0) {
					this.selected = def_exist;
				} else {
					if ($type(def) == 'array') {
						this.selected = def;
					} else if ($type(def) == 'string') {
						this.selected = [
							{
								label: def,
								value: def
							}
						];
					}
				}
			});
		}
		this.realOptions = tmpList;
	},
	methods: {
		findVal(target, arr) {
			if (arr && arr.length) {
				return arr.filter(x => {
					if (this.multiple && $type(target) == 'array') {
						return target.includes(x.value);
					} else if ($type(target) == 'object') {
						return target[x.value];
					} else if ($type(target) == 'string') {
						return x.value === target;
					}
				});
			}
		},
		handleOption() {
			if (!this.visible) {
				this.showMenu();
			} else {
				if (
					this.filterOptions.length == 0 &&
					this.realOptions[this.hoverIndex]
				) {
					this.setSelected(this.hoverIndex, this.realOptions[this.hoverIndex]);
				}
				if (
					this.filterOptions.length > 0 &&
					this.filterOptions[this.hoverIndex]
				) {
					this.setSelected(
						this.hoverIndex,
						this.filterOptions[this.hoverIndex]
					);
				}
			}
		},
		showMenu() {
			if (!this.visible) this.visible = true;
			this.$emit('showmenu', this.visible);
		},
		deleteTag(event, tag) {
			let index = this.selected.indexOf(tag);
			if (index > -1) {
				const value = this.selected.slice();
				value.splice(index, 1);
				this.selected = value;
			}
			event.stopPropagation();
			this.$nextTick(() => {
				this.marginT = this.$refs.selectbox.clientHeight;
			});
		},
		setSelected(index, option) {
			if (!this.multiple) {
				this.selected = [option];
				this.visible = false;
			} else {
				let arr = this.selected;
				let optionIndex = this.getValueIndex(arr, option);
				if (optionIndex > -1) {
					arr.splice(optionIndex, 1);
				} else {
					arr.push(option);
				}
				this.selected = arr;
				this.visible = true;
				this.query = '';
			}
			this.$nextTick(() => {
				this.marginT = this.$refs.selectbox.clientHeight;
			});
		},
		getValueKey(item) {
			if (
				Object.prototype.toString.call(item.label).toLowerCase() !==
				'[object object]'
			) {
				return item.value;
			} else {
				return Tool._getValueByPath(item.label, this.valueKey);
			}
		},
		getValueIndex(arr = [], value) {
			if ($type(value) != 'object') {
				return arr.indexOf(value);
			} else {
				const valueKey = this.valueKey;
				let index = -1;
				arr.some((item, i) => {
					if (
						Tool._getValueByPath(item, valueKey) ===
						Tool._getValueByPath(value, valueKey)
					) {
						index = i;
						return true;
					}
					return false;
				});
				return index;
			}
		},
		handleQueryChange(event) {
			this.query = event.target.value;
			this.searchQuery(this.realOptions, this.query);
		},
		searchQuery(options) {
			function joinText(arr) {
				return arr.map(item => item[0]).join('');
			}
			loadJs(
				'https://oss.wandougongzhu.cn/lib/@inagora/stable/2.0.20/dist/pinyin.min.js'
			).then(() => {
				let py = window.pinyin;
				let _options = options;
				_options.forEach(item => {
					let text = item.label.toLocaleLowerCase();
					item._s = [
						text,
						joinText(py(text, { style: py.STYLE_FIRST_LETTER })),
						joinText(py(text, { style: py.STYLE_INITIALS })),
						joinText(py(text, { style: py.STYLE_NORMAL }))
					];
				});
				let q = this.query.toLocaleLowerCase();
				let newOptions = _options.filter(item => {
					let opt = item._s;
					return opt.includes(q) || item.label.includes(q);
				});
				this.filterOptions = newOptions;
			});
		},
		createOption(event) {
			let tmpList = this.options ? this.options : this.list;
			let query = event.target.value;
			if (query && query != '' && this.selected.indexOf(query) == '-1') {
				if (this.multiple) {
					this.selected.push(query);
					this.query = '';
				} else {
					this.selected.label = query;
					this.query = '';
				}
			} else if (query == '') {
				this.setSelected(this.hoverIndex, tmpList[this.hoverIndex]);
			}
		},
		navigateOptions(direction) {
			let tmpList = this.options ? this.options : this.list;
			if (tmpList.length === 0) return;
			if (direction === 'next') {
				this.hoverIndex++;
				if (this.hoverIndex === tmpList.length) {
					this.hoverIndex = 0;
				}
			} else if (direction === 'prev') {
				this.hoverIndex--;
				if (this.hoverIndex < 0) {
					this.hoverIndex = this.realOptions.length - 1;
				}
			}
		},
		setHoverIndex(index, item) {
			this.hoverIndex = index;
			this.setSelected(index, item);
		},
		deletePrevTag() {
			if (
				(this.multiple && this.selected.length == 0) ||
				(!this.multiple && this.selected.label == '') ||
				this.query != ''
			)
				return;
			this.selected.pop();
		},
		handleClose() {
			this.visible = false;
		},
		reset() {
			this.selected = this.defaultValue || '';
		}
	}
};
</script>

<style lang="scss" scoped>
.st-input {
	position: relative;
	font-size: 1.4em;
	width: 100%;
	&-uparrow {
		transform: rotate(180deg);
	}
}
.st-select {
	// width: 100%;
	min-width: 120px;
	min-height: 32px;
	display: flex;
	flex-wrap: nowrap;
	max-width: 320px;
	position: relative;
	border: 1px solid #dcdfe6;
	border-radius: 4px;
	padding: 0 30px 0 15px;
	background: #fff;

	&-input {
		width: 100px;
		border: none;
		font-size: 1em;
		color: #606266;
	}
	&-input:focus {
		outline: none;
	}
	&-tags {
		line-height: normal;
		white-space: normal;
		z-index: 1;
		text-align: center;
		flex-wrap: wrap;
		display: flex;
		align-items: center;
		min-height: 32px;
		&-box {
			display: flex;
			flex-wrap: wrap;
			width: 240px;
		}
		&-item {
			height: 2em;
			padding: 0 8px;
			box-sizing: border-box;
			margin: 2px 0 2px 6px;
		}
	}

	&-menu {
		width: 100%;
		max-height: 300px;
		overflow-y: scroll;
		position: absolute;
		border: 1px solid #e4e7ed;
		border-radius: 4px;
		background-color: #fff;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		box-sizing: border-box;
		margin: 3.5em auto 0 -15px;
		padding: 6px 0;
		z-index: 9;
		> ul {
			padding: 0;
		}
		&-item {
			font-size: 14px;
			padding: 0 20px;
			position: relative;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			color: #606266;
			height: 34px;
			line-height: 34px;
			box-sizing: border-box;
			cursor: pointer;

			&-hover {
				background: #f5f7fa;
			}
			&-select {
				color: #409eff;
			}
		}
		&-none {
			height: 20px;
			line-height: 20px;
			text-align: center;
		}
	}
	&-focus {
		border-color: #409eff;
		-webkit-box-shadow: 0 0 5px rgba(59, 180, 242, 0.3);
		box-shadow: 0 0 5px rgba(59, 180, 242, 0.3);
	}
	.st-icon-caret-down {
		position: absolute;
		right: 10px;
	}
}
</style>
