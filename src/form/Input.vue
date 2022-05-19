<template>
	<div :class="{ 'st-cbb': field.clearable && clearable }">
		<input
			ref="formInput"
			v-model="val"
			:type="field.nativeType || 'text'"
			:name="field.name"
			:placeholder="field.placeholder"
			class="st-form-input"
			@focus="$emit('fieldfocus')"
			@blur="
				$emit('fieldblur');
				validate();
			"
			@input="validate(true)"
			@change="handleChange(field, $event)"
		/>
		<div
			v-if="field.clearable && clearable"
			class="st-cbb-clear st-icon st-icon-close"
			@click="cls"
		></div>
	</div>
</template>

<script>
import { loadJs, loadCss, $type } from '../util/util';
import validate from './validate.mixin.js';
export default {
	mixins: [validate],
	props: {
		field: {
			type: Object,
			default() {
				return {};
			}
		},
		value: {
			type: [String, Number],
			default: ''
		}
	},
	data() {
		return {
			val: this.value,
			clearable: false
		};
	},
	watch: {
		val(v) {
			this.$emit('input', v);
			let type = this.field.type;
			if (type == 'datetime' || type == 'date') {
				this.clearable = v;
			}
		}
	},
	mounted() {
		let type = this.field.type;
		if (type == 'datetime' || type == 'date') {
			Promise.all([
				loadCss(
					'https://oss.wandougongzhu.cn/lib/flatpickr/4.6.3/dist/flatpickr.min.css'
				),
				loadJs(
					'https://oss.wandougongzhu.cn/lib/flatpickr/4.6.3/dist/flatpickr.min.js'
				)
			]).then(() => {
				let options = {
					dateFormat: type == 'datetime' ? 'Y-m-d H:i:S' : 'Y-m-d',
					wrap: false
				};
				if (type == 'datetime') {
					options = Object.assign(options, {
						enableTime: true,
						time_24hr: true,
						enableSeconds: true
					});
				}
				if (this.field.dateConfig) {
					if ($type(this.field.dateConfig) == 'object') {
						options = Object.assign(options, this.field.dateConfig);
					} else if ($type(this.field.dateConfig) == 'function') {
						options = Object.assign(options, this.field.dateConfig(this.field));
					}
				}
				window.flatpickr(this.$refs.formInput, options);
			});
		}
		this.formatRule();
	},
	methods: {
		handleChange(field, evt) {
			field.change && field.change(field, evt);
		},
		cls() {
			this.val = '';
		}
	}
};
</script>
