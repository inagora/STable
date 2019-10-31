<template>
	<div class="st-datepicker st-icon st-icon-calendar" :class="{'st-datepicker-range':range,'st-datepicker-clearable':clearable&&text&&!disabled}">
		<input
			v-if="type!=='inline'"
			readonly
			:value="text"
			:class="[show ? 'st-datepicker-input-focus' : '', inputClass]"
			:disabled="disabled"
			:placeholder="placeholder"
			:name="name"
		/>
		<a class="st-datepicker-close st-icon st-icon-close" @click.stop="cls" />
		<transition name="st-datepicker-anim">
			<div
				v-if="show||type==='inline'"
				class="st-datepicker-popup"
				:class="[popupClass,{'st-datepicker-inline':type==='inline'}]"
				tabindex="-1"
			>
				<template v-if="range">
					<x-calendar v-model="dates[0]" :left="true" />
					<x-calendar v-model="dates[1]" :right="true" />
				</template>
				<template v-else>
					<x-calendar v-model="dates[0]" />
				</template>
				<div v-if="showButtons" class="st-datepicker-buttons">
					<button class="st-datepicker-button-select" @click.prevent.stop="cancel">
						{{ local.cancelTip }}
					</button>
					<button class="st-datepicker-button-select" @click.prevent.stop="submit">
						{{ local.submitTip }}
					</button>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
import XCalendar from './coms/calendar.vue';

export default {
	name: 'XDatetimePicker',
	components: { XCalendar },
	props: {
		name: {
			type: [String],
			required: true,
			default: ''
		},
		inputClass: {
			type: [String],
			default: ''
		},
		popupClass: {
			type: [String],
			default: ''
		},
		value: {
			type: [Date, Array, String, Object],
			default() {
				return new Date();
			},
		},
		disabled: {
			type: [Boolean],
			default: false
		},
		type: {
			type: String,
			default: 'normal'
		},
		rangeSeparator: {
			type: String,
			default: '~'
		},
		clearable: {
			type: Boolean,
			default: false
		},
		placeholder: {
			type: [String],
			default: ''
		},
		disabledDate: {
			type: Function,
			default: () => {
				return false;
			}
		},
		format: {
			type: String,
			default: 'YYYY-MM-DD'
		},
		local: {
			type: Object,
			default () {
				return {
					dow: 1, // Monday is the first day of the week
					hourTip: '选择小时', // tip of select hour
					minuteTip: '选择分钟', // tip of select minute
					secondTip: '选择秒数', // tip of select second
					yearSuffix: '年', // format of head
					monthsHead: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'), // months of head
					months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'), // months of panel
					weeks: '一_二_三_四_五_六_日'.split('_'), // weeks
					cancelTip: '取消', // default text for cancel button
					submitTip: '确定' // default text for submit button
				};
			}
		},
		showButtons: {
			type: Boolean,
			default: false
		},
		dateRangeSelect: {
			type: [Function],
			default: () => {
				return true;
			}
		}
	},
	data () {
		return {
			show: false,
			dates: this.vi(this.value)
		};
	},
	computed: {
		range () {
			return this.dates.length === 2;
		},
		text () {
			const val = this.value;
			const txt = this.dates.map(date => this.tf(date)).join(` ${this.rangeSeparator} `);
			if (Array.isArray(val)) {
				return val.length > 1 ? txt : '';
			} else {
				return val ? txt : '';
			}
		}
	},
	watch: {
		value () {
			this.dates = this.vi(this.value);
		}
	},
	mounted () {
		document.querySelector('body').addEventListener('click', this.dc, true);
	},
	beforeDestroy () {
		document.querySelector('body').removeEventListener('click', this.dc, true);
	},
	methods: {
		get () {
			return Array.isArray(this.value) ? this.dates : this.dates[0];
		},
		cls () {
			this.$emit('clear');
			this.$emit('input', this.range ? [] : '');
		},
		vi (val) {
			if (Array.isArray(val)) {
				return val.length > 1 ? val.map(item => new Date(item)) : [new Date(), new Date()];
			} else {
				return val ? new Array(new Date(val)) : [new Date()];
			}
		},
		ok (leaveOpened) {
			const $this = this;
			$this.$emit('input', $this.get());
			!leaveOpened && !$this.showButtons && setTimeout(() => {
				$this.show = $this.range;
			});
		},
		tf (time, format) {
			const year = time.getFullYear();
			const month = time.getMonth();
			const day = time.getDate();
			const hours24 = time.getHours();
			const hours = hours24 % 12 === 0 ? 12 : hours24 % 12;
			const minutes = time.getMinutes();
			const seconds = time.getSeconds();
			const milliseconds = time.getMilliseconds();
			const dd = t => ('0' + t).slice(-2);
			const map = {
				YYYY: year,
				MM: dd(month + 1),
				MMM: this.local.months[month],
				MMMM: this.local.monthsHead[month],
				M: month + 1,
				DD: dd(day),
				D: day,
				HH: dd(hours24),
				H: hours24,
				hh: dd(hours),
				h: hours,
				mm: dd(minutes),
				m: minutes,
				ss: dd(seconds),
				s: seconds,
				S: milliseconds
			};
			return (format || this.format).replace(/Y+|M+|D+|H+|h+|m+|s+|S+/g, str => map[str]);
		},
		dc (e) {
			this.show = this.$el.contains(e.target) && !this.disabled;
		},
		submit () {
			this.$emit('confirm', this.get());
			this.show = false;
		},
		cancel () {
			this.$emit('cancel');
			this.show = false;
		}
	}
};
</script>

<style lang='scss' scoped>
.st-datepicker {
  display: inline-block;
	position: relative;
	font-size: inherit !important;

	&-close {
		display: none;
		position: absolute;
		width: 3em;
		height: 100%;
		top: 0;
		right: 0;
		cursor: pointer;
	}
	&-close:before {
		display: block;
		content: '';
		position: absolute;
		width: 16px;
		height: 16px;
		left: 50%;
		top: 50%;
		margin-left: -8px;
		margin-top: -8px;
		text-align: center;
		background: #ccc;
		color: #fff;
		border-radius: 50%;
	}
	&-clearable:hover:before {
		display: none;
	}
	&-clearable:hover &-close{
		display: block;
	}
	&-close:hover:before{
		background-color: #afafaf;
	}
	&-input-focus {
		border-color: #409eff;
		-webkit-box-shadow: 0 0 5px rgba(59, 180, 242, .3);
		box-shadow: 0 0 5px rgba(59, 180, 242, .3);
	}
	>input {
		color: #666;
		transition: all 200ms ease;
		border: 1px solid #e5e5e5;
		height: 32px;
		box-sizing: border-box;
		outline: none;
		padding: 0 3em 0 1em;
		font-size: 1em;
		width: 100%;
		border-radius: 4px;
		user-select: none;
	}
	>input:disabled {
		cursor: not-allowed;
		background-color: #ebebe4;
		border-color: #e5e5e5;
		-webkit-box-shadow: none;
		box-shadow: none;
	}
	&-popup {
		position: absolute;
		transition: all 200ms ease;
		opacity: 1;
		transform: scaleY(1);
		transform-origin: center top;
		font-size: 12px;
		background: #fff;
		border: 1px solid #d9d9d9;
		box-shadow: 0 1px 6px rgba(99, 99, 99, 0.2);
		margin-top: 2px;
		outline: 0;
		padding: 5px;
		overflow: hidden;
		z-index: 999
	}
	&-inline{
		position: relative;
		margin-top: 0;
	}
	&-range {
		min-width: 355px
	}
	&-range &-popup{
		width: auto;
		display: flex;
	}
	&-bottom {
		float: left;
		width: 100%;
		text-align: right;
	}
	&-btn {
		padding: 5px 10px;
		background: #1284e7;
		color: #fff;
		border-radius: 2px;
		display: inline-block;
		cursor: pointer;
	}
	&-anim-enter-active {
		transform-origin: 0 0;
		animation: datepicker-anim-in .2s cubic-bezier(.23, 1, .32, 1)
	}
	&-anim-leave-active {
		transform-origin: 0 0;
		animation: datepicker-anim-out .2s cubic-bezier(.755, .05, .855, .06)
	}
	&-buttons {
		display: block;
		text-align: right;
	}
	&-buttons button {
		display: inline-block;
		font-size: 13px;
		border: none;
		cursor: pointer;
		margin: 10px 0 0 5px;
		padding: 5px 15px;
		color: #ffffff;
	}
	&-button-select {
		background: #1284e7;
	}
}
.st-datepicker:before {
  content: '';
  display: block;
  position: absolute;
  width: 3em;
  height: 100%;
  top: 0;
  right: 0;
}
.st-datepicker-button-select {
  background: #666;
}
@keyframes datepicker-anim-in {
    0% {
        opacity: 0;
        transform: scaleY(.8)
    }
    to {
        opacity: 1;
        transform: scaleY(1)
    }
}
@keyframes datepicker-anim-out {
    0% {
        opacity: 1;
        transform: scaleY(1)
    }
    to {
        opacity: 0;
        transform: scaleY(.8)
    }
}
</style>