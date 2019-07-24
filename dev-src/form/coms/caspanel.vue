<template lang="html">
	<div class="st-multicas-wrap">
		<div class="st-multicas-wrap-con" :style="contentStyle">
			<ul class="st-multicas-wrap-menu">
				<!-- , { 'item-disabled': item.disabled ,'item-checked': item.checked } -->
				<li
					v-for="(item, index) in option"
					:key="index"
					style="border:1px solid transparent;"
					:class="[ 'st-multicas-wrap-menu-item']"
					@click="showNextLevel(item)"
				>
					<span v-if="item.multiple">
						<input
							:id="`${item.value}-${index}`"
							v-model="item.checked"
							type="checkbox"
							:disabled="item.disabled"
							@change="checkChange(item)"
						/>
						<lable :for="`${item.value}-${index}`">{{ item.label }}</lable>
					</span>
					<span v-else @click="checkChange(item)">{{ item.label }}</span>
					<i v-show="item.children && item.children.length > 0" class="st-iconfont st-icon-caret-down item-more" />
				</li>
			</ul>
		</div>
		<!-- 递归调用自身组件 -->
		<muContent
			v-if="(activeItem && activeItem.children) && (activeItem.children.length > 0)"
			:height="height"
			:width="width"
			:selected-values="selectedValues"
			:option="activeItem.children"
			@handleSelect="whenSelected"
			@handleOutPut="whenOutPut"
		/>
	</div>
</template>

<script>

export default {
	name: "MuContent",
	props: {
		option: {
			type: Array,
			default() {
				return [];
			}
		},
		// 被选中的值
		selectedValues: {
			type: Array,
			default() {
				return [];
			}
		},
		// 设置的宽度
		width: {
			type: String,
			default: ""
		},
		height: {
			type: String,
			default: ""
		}
	},
	data() {
		return {
			activeItem: "",
			tempActiveItem: "",
			contentStyle: {
				width: "",
				height: ""
			},
		};
	},
	created() {
		this.initData();
		this.whenOutPut(this.selectedValues);
	},
	methods: {
		// 逐级上传
		whenOutPut(val) {
			this.$emit("handleOutPut", val);
		},
		initData() {
			const { width, height } = this;
			this.contentStyle = Object.assign({}, this.contentStyle, {
				width,
				height
			});
		},
		// 获取到选中的值
		checkChange(item) {
			console.log(this.selectedValues);
			const getCheckedItems = item => {
				const { value, checked, level } = item;
				if (checked && level) {
					this.selectedValues.push(value);
				} else if (!checked) {
					item.disabled = false;
					if (this.selectedValues.includes(value)) {
						this.selectedValues.splice(
							this.selectedValues.findIndex(slectVal => slectVal === value),
							1
						);
					}
				}
				const itemChild = item.children;
				if (itemChild) {
					itemChild.forEach(child => (child.checked = checked));
				} else if(!itemChild && !item.multiple) {
					//单选逻辑
					this.selectedValues = [];
					this.selectedValues.push(item.value);

					if (this.selectedValues.length == 1) {
						let selectedOne = this.selectedValues[0];
						this.singleSelected(this.option, selectedOne);
					}
				}
			};

			this.recursiveFn(item, getCheckedItems);
			this.activeItem = item;
			this.$emit("handleSelect", this.option);
			this.$emit("handleOutPut", this.selectedValues);
		},
		singleSelected(datas, selectedOne) {
			for (var i in datas) {
				if (datas[i].multiple == false) {
					datas[i].checked = false;
					for (let d = 0; d < selectedOne.length; d++) {
						if (datas[i].value == selectedOne[d]) {
							datas[i].checked = true;
						}
					}
				}
			}
		},
		// 当二级菜单改变的时候
		whenSelected(val) {
			let allChildCancelChecked = true;
			if (Array.isArray(val) && val.length > 0) {
				allChildCancelChecked = val.every(child => child.checked === false);
			}
			this.activeItem.checked = !allChildCancelChecked;
			this.$emit("handleSelect", this.option);
		},
		// 递归
		recursiveFn(curItem, cb) {
			cb(curItem);
			const children = curItem.children;
			if (children && children.length > 0) {
				children.forEach(item => {
					this.recursiveFn(item, cb);
				});
			}
		},
		showNextLevel(item) {
			this.activeItem = "";
			if (!item.multiple) {
				this.selectedValues = [];
			}
			if (item.disabled) return;
      
			setTimeout(() => {
				this.activeItem = item;
			}, 10);
		}
	}
};
</script>
<style lang='scss' scoped>
.st-multicas-wrap {
  display: flex;
  justify-content: space-between;

  &-con {
    display: inline-block;
    max-height: 250px;
    overflow-y: auto;
    // border-right: 1px solid red;
  }

  &-menu-item {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    list-style-type: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    outline: none;
    padding: 8px 20px;
    font-size: 14px;
    &:hover {
      background-color: rgba(125, 139, 169, 0.1);
    }
  }

  &-menu-item input.item-input {
    display: none;
    position: absolute;
    width: 100%;
    height: inherit;
    padding: 8px 20px;
    display: inline-block;
  }

}

.item-disabled {
  color: #c0c4cc;
  cursor: not-allowed;
}
.item-checked {
  background-color: rgba(125, 139, 169, 0.1);
}
.item-more {
  opacity: 0.8;
  transform: rotate(-90deg);
}
</style>