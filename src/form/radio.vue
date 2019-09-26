<template>
	<div>
		<label 
			v-for="(item, index) in options"
			:key="index" 
			class="st-radio"
			role="radio"
			:class="{
				'is-checked': index === checkIndex                        
			}"
			:aria-checked="index === checkIndex"
		>
			<span
				class="st-radio-input"
				:class="{
					'is-checked': index === checkIndex
				}"
			>
				<span class="st-radio-inner" />
				<input 
					ref="radio"
					class="st-radio-original"
					:value="item.value"
					type="radio"
					aria-hidden="true"
					:name="name"
					@click="handleChange(index)"
				/>
			</span>
			<span class="st-radio-label" v-text="item.label"></span>
		</label>
	</div>
</template>

<script>
export default {
	name: 'XRadio',
	compontents: 'XRadio',
	props: {
		name: {
			type: String,
			default: ''
		},
		value: {
			type: [String,Boolean,Number],
			default: ''
		},
		options: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	data() {
		return {
			checkIndex: -1,
			checkVal: '',
		};
	},
	computed: {
    
	},
	watch: {
		checkVal: {
			handler(val) {
				this.checkVal = val;
				this.$emit('validate',event.target.value);
			}
		}
	},
	methods: {
		handleChange(index) {
			this.checkIndex = index;
			this.checkVal = this.options[index].value;
			this.$emit('change',this.checkVal);
		}
	}
};
</script>

<style lang="scss" scoped>
  .st-radio {
    color: #606266;
    font-weight: 500;
    line-height: 1;
    position: relative;
    cursor: pointer;
    display: inline-block;
    white-space: nowrap;
    outline: none;
    font-size: 14px;
    margin-right: 30px;

    &-input {
      white-space: nowrap;
      cursor: pointer;
      outline: none;
      display: inline-block;
      line-height: 1;
      position: relative;
      vertical-align: middle;
    }

    &-label {
      font-size: 14px;
      padding-left: 10px;
    }

    &-inner {
      border: 1px solid #dcdfe6;
      border-radius: 100%;
      width: 14px;
      height: 14px;
      background-color: #fff;
      position: relative;
      cursor: pointer;
      display: inline-block;
      box-sizing: border-box;
    }
		&-inner::after {
			width: 4px;
			height: 4px;
			border-radius: 100%;
			background-color: #fff;
			content: "";
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%,-50%) scale(0);
			transition: transform .15s ease-in;
		}

    &-original {
      opacity: 0;
      outline: none;
      position: absolute;
      z-index: -1;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: 0;
    }
  }
  .st-radio-input.is-checked .st-radio-inner {
    border-color: #409eff;
    background: #409eff;
  }
  .st-radio-input.is-checked .st-radio-inner:after {
    transform: translate(-50%,-50%) scale(1);
  }
  .st-radio-input.is-checked+.st-radio-label {
    color: #409eff;
  }
</style>
