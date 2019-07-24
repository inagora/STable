<template>
	<div
		class="st-switch"
		:class="{'is-checked': checked }"
		role="switch"
		:aria-checked="checked"
		@click.prevent="handleChange"
	>
		<input
			ref="input"
			class="st-switch-input"
			type="checkbox"
			:name="name"
			@change="handleChange"
			@keydown.enter="handleChange"
		/>
		<span ref="core" class="st-switch-core" />
	</div>
</template>

<script>
export default {
	name: 'XSwitch',
	compontents: 'XSwitch',
	// model: {
	//   prop: 'checked',
	//   event: 'change'
	// },
	props: {
		name: {
			type: String,
			default: ''
		},
		value: {
			type: Boolean,
			default: false,
		},
		// checked: {
		//   type: Number,
		//   default: 0
		// }
	},
	data() {
		return {
			checked: false,
		};
	},
	watch:{
		// checked: {
		// 	handler(newVal,oldVal) {
		// 		console.log(newVal)
		// 	}
		// }
	},
	methods: {
		handleChange() {
			this.checked = !this.checked;
			this.$emit('change',this.checked);
		},
	},
};
</script>

<style lang="scss" scoped>
	.st-switch {
		display: inline-flex;
    align-items: center;
    position: relative;
    font-size: 14px;
    line-height: 20px;
    height: 20px;
    vertical-align: middle;

		&-input {
			position: absolute;
			width: 0;
			height: 0;
			opacity: 0;
			margin: 0;
		}

		&-core {
			margin: 0;
			display: inline-block;
			position: relative;
			width: 40px;
			height: 20px;
			border: 1px solid #dcdfe6;
			outline: none;
			border-radius: 10px;
			box-sizing: border-box;
			background: #dcdfe6;
			cursor: pointer;
			transition: border-color .3s,background-color .3s;
			vertical-align: middle;
		}

		&-core::after {
			content: "";
			position: absolute;
			top: 1px;
			left: 1px;
			border-radius: 100%;
			transition: all .3s;
			width: 16px;
			height: 16px;
			background-color: #fff;
		}
	}
	.st-switch.is-checked .st-switch-core {
		border-color: #409eff;
    background-color: #409eff;
	}
	.st-switch.is-checked .st-switch-core:after {
    left: 100%;
    margin-left: -17px;
	}
</style>
