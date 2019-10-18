<template>
	<div class="st-calendar">
		<div class="st-calendar-head">
			<a v-show="showYears" class="st-calendar-prev-decade-btn" @click="year-=10">«</a>
			<a v-show="!showYears" class="st-calendar-prev-year-btn" @click="year--">«</a>
			<a v-show="!showYears&&!showMonths" class="st-calendar-prev-month-btn" @click="pm">‹</a>
			<a v-show="showYears" class="st-calendar-year-select">{{ ys+'-'+ye }}</a>
			<template v-if="local.yearSuffix">
				<a v-show="!showYears" class="st-calendar-year-select" @click="showYears=!showYears">{{ year }}{{ local.yearSuffix }}</a>
				<a v-show="!showYears&&!showMonths" class="st-calendar-month-select" @click="showMonths=!showMonths">{{ local.monthsHead[month] }}</a>
			</template>
			<template v-else>
				<a v-show="!showYears&&!showMonths" class="st-calendar-month-select" @click="showMonths=!showMonths">{{ local.monthsHead[month] }}</a>
				<a v-show="!showYears" class="st-calendar-year-select" @click="showYears=!showYears">{{ year }}</a>
			</template>
			<a v-show="!showYears&&!showMonths" class="st-calendar-next-month-btn" @click="nm">›</a>
			<a v-show="!showYears" class="st-calendar-next-year-btn" @click="year++">»</a>
			<a v-show="showYears" class="st-calendar-next-decade-btn" @click="year+=10">»</a>
		</div>
		<div class="st-calendar-body">
			<div class="st-calendar-days">
				<a v-for="i in local.weeks" :key="i" class="st-calendar-week">{{ i }}</a>
				<a
					v-for="(j,i) in days"
					:key="i"
					:class="[(j.p||j.n)? 'st-calendar-date-out' :'',status(j.y,j.m,j.i,hour,minute,second,'YYYYMMDD')]"
					@click="is($event)&&(day=j.i,ok(j))"
				>{{ j.i }}</a>
			</div>
			<div v-show="showMonths" class="st-calendar-months">
				<a
					v-for="(i,j) in local.months"
					:key="j"
					:class="[status(year,j,day,hour,minute,second,'YYYYMM')]"
					@click="is($event)&&(showMonths=(m==='M'),month=j,(m==='M'&&ok('m')))"
				>{{ i }}</a>
			</div>
			<div v-show="showYears" class="st-calendar-years">
				<a
					v-for="(i,j) in years"
					:key="j"
					:class="[(j===0||j===11)? 'st-calendar-date-out':'',status(i,month,day,hour,minute,second,'YYYY')]"
					@click="is($event)&&(showYears=(m==='Y'),year=i,(m==='Y'&&ok('y')))"
				>{{ i }}</a>
			</div>
			<div v-show="showHours" class="st-calendar-hours">
				<div class="st-calendar-title">
					{{ local.hourTip }}
				</div>
				<a
					v-for="(j,i) in 24"
					:key="i"
					:class="[status(year,month,day,i,minute,second,'YYYYMMDDHH')]"
					@click="is($event)&&(showHours=false,hour=i,ok('h'))"
				>{{ i }}</a>
			</div>
			<div v-show="showMinutes" class="st-calendar-minutes">
				<div class="st-calendar-title">
					{{ local.minuteTip }}
				</div>
				<a
					v-for="(j,i) in 60"
					:key="i"
					:class="[status(year,month,day,hour,i,second,'YYYYMMDDHHmm')]"
					@click="is($event)&&(showMinutes=false,minute=i,ok('h'))"
				>{{ i }}</a>
			</div>
			<div v-show="showSeconds" class="st-calendar-seconds">
				<div class="st-calendar-title">
					{{ local.secondTip }}
				</div>
				<a
					v-for="(j,i) in 60"
					:key="i"
					:class="[status(year,month,day,hour,minute,i,'YYYYMMDDHHmmss')]"
					@click="is($event)&&(showSeconds=false,second=i,ok('h'))"
				>{{ i }}</a>
			</div>
		</div>
		<div v-if="m==='H'" class="st-calendar-foot">
			<div class="st-calendar-hour">
				<a :title="local.hourTip" :class="{'st-calendar-on':showHours}" @click="showHours=!showHours,showMinutes=showSeconds=false">{{ hour|dd }}</a>
				<span>:</span>
				<a :title="local.minuteTip" :class="{'st-calendar-on':showMinutes}" @click="showMinutes=!showMinutes,showHours=showSeconds=false">{{ minute|dd }}</a>
				<span>:</span>
				<a :title="local.secondTip" :class="{'st-calendar-on':showSeconds}" @click="showSeconds=!showSeconds,showHours=showMinutes=false">{{ second|dd }}</a>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'XCalendar',
	filters: {
		dd: val => ('0' + val).slice(-2)
	},
	props: {
		value: {
			type: [Date,Object,String],
			default() {
				return new Date();
			}
		},
		left: {
			type: Boolean,
			default: false,
		},
		right: {
			type: Boolean,
			default: false,
		}
	},
	data () {
		const time = this.get(this.value);
		return {
			m: 'D',
			showYears: false,
			showMonths: false,
			showHours: false,
			showMinutes: false,
			showSeconds: false,
			year: time.year,
			month: time.month,
			day: time.day,
			hour: time.hour,
			minute: time.minute,
			second: time.second
		};
	},
	computed: {
		local () {
			return this.$parent.local;
		},
		format () {
			return this.$parent.format;
		},
		start () {
			return this.parse(this.$parent.dates[0]);
		},
		end () {
			return this.parse(this.$parent.dates[1]);
		},
		ys () {
			return parseInt(this.year / 10) * 10;
		},
		ye () {
			return this.ys + 10;
		},
		years () {
			const arr = [];
			let start = this.ys - 1;
			while (arr.length < 12) {
				arr.push(start++);
			}
			return arr;
		},
		days () {
			const days = [];
			const $this = this;
			const year = $this.year;
			const month = $this.month;
			const time = new Date(year, month, 1);
			const dow = $this.local.dow || 7;
			time.setDate(0); // switch to the last day of last month
			let lastDay = time.getDate();
			const week = time.getDay() || 7;
			let count = dow <= week ? (week - dow + 1) : (week + (7 - dow + 1));
			while (count > 0) {
				days.push({
					i: lastDay - count + 1,
					y: month > 0 ? year : year - 1,
					m: month > 0 ? month - 1 : 11,
					p: true
				});
				count--;
			}
			time.setMonth(time.getMonth() + 2, 0); // switch to the last day of the current month
			lastDay = time.getDate();
			let i = 1;
			for (i = 1; i <= lastDay; i++) {
				days.push({
					i: i,
					y: year,
					m: month
				});
			}
			for (i = 1; days.length < 42; i++) {
				days.push({
					i: i,
					y: month < 11 ? year : year + 1,
					m: month < 11 ? month + 1 : 0,
					n: true
				});
			}
			return days;
		}
	},
	watch: {
		value: {
			handler(val) {
				const $this = this;
				const time = $this.get(val);
				$this.year = time.year;
				$this.month = time.month;
				$this.day = time.day;
				$this.hour = time.hour;
				$this.minute = time.minute;
				$this.second = time.second;
			}
		}
	},
	mounted () {
		const $this = this;
		const is = c => $this.format.indexOf(c) !== -1;
		if (is('s') && is('m') && (is('h') || is('H'))) {
			$this.m = 'H';
		} else if (is('D')) {
			$this.m = 'D';
		} else if (is('M')) {
			$this.m = 'M';
			$this.showMonths = true;
		} else if (is('Y')) {
			$this.m = 'Y';
			$this.showYears = true;
		}
	},
	methods: {
		get (time) {
			return {
				year: time.getFullYear(),
				month: time.getMonth(),
				day: time.getDate(),
				hour: time.getHours(),
				minute: time.getMinutes(),
				second: time.getSeconds()
			};
		},
		parse (num) {
			return parseInt(num / 1000);
		},
		status (year, month, day, hour, minute, second, format) {
			const $this = this;
			const maxDay = new Date(year, month + 1, 0).getDate();
			const time = new Date(year, month, day > maxDay ? maxDay : day, hour, minute, second);
			const t = $this.parse(time);
			const f = $this.$parent.tf;
			const classObj = {};
			let flag = false;
			if (format === 'YYYY') {
				flag = year === $this.year;
			} else if (format === 'YYYYMM') {
				flag = month === $this.month;
			} else {
				flag = f($this.value, format) === f(time, format);
			}
			classObj['st-calendar-date'] = true;
			classObj['st-calendar-date-disabled'] = ($this.right && t < $this.start) || $this.$parent.disabledDate(time, format);
			classObj['st-calendar-date-on'] = ($this.left && t > $this.start) || ($this.right && t < $this.end);
			classObj['st-calendar-date-selected'] = flag;
			return classObj;
		},
		nm () {
			if (this.month < 11) {
				this.month++;
			} else {
				this.month = 0;
				this.year++;
			}
		},
		pm () {
			if (this.month > 0) {
				this.month--;
			} else {
				this.month = 11;
				this.year--;
			}
		},
		is (e) {
			return e.target.className.indexOf('st-calendar-date-disabled') === -1;
		},
		ok (info) {
			const $this = this;
			let year = '';
			let month = '';
			let day = '';
			info && info.n && $this.nm();
			info && info.p && $this.pm();
			if (info === 'h') {
				const time = $this.get(this.value);
				year = time.year;
				month = time.month;
			} else if (info === 'm' || info === 'y') {
				day = 1;
			}
			const _time = new Date(year || $this.year, month || $this.month, day || $this.day, $this.hour, $this.minute, $this.second);
			if ($this.left && parseInt(_time.getTime() / 1000) > $this.end) {
				this.$parent.dates[1] = _time;
			}
			$this.$emit('input', _time);
			$this.$parent.ok(info === 'h');
		}
	}
};
</script>

<style>
.st-calendar {
  float: left;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.st-calendar+.st-calendar{
  border-left: solid 1px #eaeaea;
  margin-left: 5px;
  padding-left: 5px;
}
.st-calendar-head {
  line-height: 34px;
  height: 34px;
  text-align: center;
  position: relative;
}
.st-calendar-head a {
  color: #666;
  font-weight: bold;
  cursor: pointer;
  display: inline-block;
  text-align: center;
  position: absolute;
  padding: 0 5px;
  font-size: 16px;
}
.st-calendar-head a:hover {
  color: #1284e7;
}
.st-calendar-head .st-calendar-year-select,
.st-calendar-head .st-calendar-month-select {
  font-size: 12px;
  padding: 0 2px;
  position: relative;
}
.st-calendar-prev-decade-btn,
.st-calendar-prev-year-btn {
  left: 6px;
}
.st-calendar-prev-month-btn {
  left: 24px;
}
.st-calendar-next-decade-btn,
.st-calendar-next-year-btn {
  right: 6px;
}
.st-calendar-next-month-btn {
  right: 24px;
}
.st-calendar-body {
  position: relative;
  width: 196px;
  height: 196px;
}
.st-calendar-days {
  width: 100%;
  height: 100%;
}
.st-calendar-week,
.st-calendar-date {
  font-weight: normal;
  width: 14.28%;
  height: 14.28%;
  text-align: center;
  box-sizing: border-box;
  overflow: hidden;
  float: left;
}
.st-calendar-week:before,
.st-calendar-date:before {
  content: "";
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}
.st-calendar-date {
  cursor: pointer;
}
.st-calendar-date-out {
  color: #ccc;
}
.st-calendar-date:hover,
.st-calendar-date-on {
  background: #eaf8fe;
}
.st-calendar-date-selected,
.st-calendar-date-selected:hover {
  color: #fff;
  font-weight: bold;
  background: #1284e7;
}
.st-calendar-date-disabled {
  cursor: not-allowed !important;
  color: #bcbcbc !important;
  background: #f3f3f3 !important;
}
.st-calendar-foot {
  margin-top: 5px;
}
.st-calendar-hour {
  display: inline-block;
  border: 1px solid #e6e5e5;
  color: #9e9e9e;
}
.st-calendar-hour a {
  display: inline-block;
  padding: 2px 4px;
  cursor: pointer;
}
.st-calendar-hour a:hover,
.st-calendar-hour a.st-calendar-on {
  color: #1284e7;
}
.st-calendar-years,
.st-calendar-months,
.st-calendar-hours,
.st-calendar-minutes,
.st-calendar-seconds {
  width: 100%;
  height: 100%;
  position: absolute;
  background: #fff;
  left: 0;
  top: 0;
}
.st-calendar-months a {
  width: 33.33%;
  height: 25%;
}
.st-calendar-years a {
  width: 33.33%;
  height: 25%;
}
.st-calendar-hours a {
  width: 20%;
  height: 20%;
}
.st-calendar-minutes a,
.st-calendar-seconds a {
  width: 16.66%;
  height: 10%;
}
.st-calendar-title {
  margin-top: -30px;
  height: 30px;
  line-height: 30px;
  background: #fff;
  text-align: center;
  font-weight: bold;
}
</style>