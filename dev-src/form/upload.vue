<template>
	<div class="st-upload-wrap">
		<template v-if="type == 'file'">
			<div>
				
			</div>
		</template>
		<template v-if="type == 'img'">
			<div>
				
			</div>
		</template>
	</div>
</template>

<script>
import * as Tool from './tool';
import XButton from "../com/Button.vue";

export default {
	name: 'XUpload',
	mixins: [Tool],
	componentName: 'XUpload',
	components: {XButton},
	props: {
		type: {
			type: String,
			default: 'file'
		},
		value: {
			type: [String,Number],
			default: ''
		},
		disabled: {
			type: Boolean,
			default: false
		},
		readonly: {
			type: Boolean,
			default: false
		},
		showPassword: {
			type: Boolean,
			default: false
		},
		clearable: {
			type: Boolean,
			default: false
		},
		placeholder:{
			type: String,
			default: ''
		},
		length: {
			type: Number,
		},
		showWordLimit: {
			type: Boolean,
			default: false
		},

	},
	data(){
		return {
			focused: false,
			hovering: false,
		};
	},
	computed: {
		showClear() {
			return this.clearable && 
        !this.disabled &&
        !this.readonly &&
        (this.focused || this.hovering);
		},
		nativeInputValue() {
			return this.value === null || this.value === undefined ? '' : String(this.value);
		},
		isWordLimitVisible() {
			return this.showWordLimit &&
        this.$attrs.maxlength &&
        (this.type === 'text' || this.type === 'textarea') &&
        !this.disabled &&
        !this.readonly &&
        !this.showPassword;
		},
		upperLimit() {
			return this.$attrs.maxlength;
		},
		textLength() {
			if (typeof this.value === 'number') {
				return String(this.value).length;
			}
			return (this.value || '').length;
		},
		inputExceed() {
			return this.isWordLimitVisible &&
        (this.textLength > this.upperLimit);
		}
	},
	watch:{
		// value(val) {
		// },
		nativeInputValue() {
			this.setNativeInputValue();
		},
		type() {
			this.$nextTick(() => {
				this.setNativeInputValue();
			});
		}
	},
	mounted(){
		this.setNativeInputValue();
	},
	methods: {
		setNativeInputValue() {
			const input = this.getInput();
			if (!input) return;
			if (input.value === this.nativeInputValue) return;
			input.value = this.nativeInputValue;
		},
		focus() {
			this.getInput().focus();
		},
		blur() {
			this.getInput().blur();
		},
		handleFocus(event) {
			this.focused = true;
			this.$emit('focus', event);
		},
		handleBlur(event) {
			this.focused = false;
			this.$emit('blur', event);
			this.$emit('validate', event.target.value);
		},
		handleInput(event) {
			if (event.target.value === this.nativeInputValue) return;
			this.$emit('input', event.target.value);
			this.$nextTick(this.setNativeInputValue);
		},
		handleChange(event) {
			this.$emit('change', event.target.value);
		},
		clear(){
			this.$emit('input', '');
			this.$emit('change', '');
			this.$emit('clear');
		},
		getInput() {
			return this.$refs.input || this.$refs.textarea;
		},
	},
};
</script>


<style lang='scss' scoped>
.st-input-wrap {
  width: 100%;
  display: flex;

  &-item {
    width: 100%;
    height: 40px;
    line-height: 40px;
    border: 1px solid #dcdfe6;
    font-size: inherit;
    padding: 0 15px;
    outline: none;
    text-align: left; 
    border-radius: 4px;
    position: relative;
  }

  &-disabled {
    background: #f5f7fa;
    border-color: #e4e7ed;
    color: #c0c4cc;
    cursor: not-allowed;
  }
  &-clear  {
    position: relative;
    right: 10px;
    width: 20px;
    height: 20px;
    transform: translate(0, 50%);
    right: 20px;
    top: 50%;
  }
  
}
.st-textarea-wrap {
  position: relative;

  &-con {
    width: 100%;
    min-height: 80px;
    text-align: left; 
    padding: 0 15px;
    outline: none;
    font-size: inherit;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
  }

  &-exceed{
    background: #fef0f0;
    border-color: #fbc4c4;
  }

  &-count {
    // color: #f56c6c;
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
}
</style>

