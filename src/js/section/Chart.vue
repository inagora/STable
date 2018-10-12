<template>
	<div v-show="visible" class="st-chart-box">
		<div class="st-chart"></div>
		<div @click="closeChart" class="st-chart-close el-icon-error"></div>
	</div>
</template>
<script>
import { loadScript } from '../util.js';
export default {
	inject: ['store', 'chart'],
	data(){
		return {
			visible: false
		}
	},
	mounted(){
		loadScript('//cdn.jsdelivr.net/npm/echarts@4.1.0/dist/echarts.common.min.js');

		this.store.$on('chartshow', (evt)=>{
			this.btn = evt.target;
			let rect = evt.target.getBoundingClientRect(),
				boxRect = this.$root.$refs.stable.$el.getBoundingClientRect();
			this.$el.style.left = (rect.left - boxRect.left)+'px';
			this.$el.style.top = (rect.top - boxRect.top)+'px';
			this.$el.style.width = rect.width+'px';
			this.$el.style.height = rect.height+'px';

			this.visible = true;
			setTimeout(()=>{
				this.$el.style.left = '0';
				this.$el.style.top = '0';
				this.$el.style.width = boxRect.width+'px';
				this.$el.style.height = boxRect.height+'px';
				setTimeout(()=>{
					this.initChart();
				}, 200);
			},0);
		})
	},
	methods: {
		initChart(){
			let echart = echarts.init(this.$el.querySelector('.st-chart'));
			let records = this.store.getCurrentPage();
			let option = {};
			if(typeof this.chart=='function') {
				option = this.chart.call(this.$root, records);
			} else {
				Object.assign(option, this.chart);
				if(typeof option.title=='string') {
					option.title = {
						text: option.title
					};
				}
				if(Array.isArray(option.legend)) {
					option.legend = {data: option.legend};
				}
				if(typeof option.xAxis == 'string') {
					let dataIndex = option.xAxis;
					let data = records.map(item=>item[dataIndex]||'');
					option.xAxis = {data, type:'category'};
				}
				if(typeof option.yAxis == 'string') {
					let dataIndex = option.yAxis;
					let data = records.map(item=>item[dataIndex]||0);
					option.yAxis = {data, type: 'value'};
				}
				if(typeof option.series=='string') {
					let dataIndex = option.series;
					option.series = [{dataIndex: option.series}];
				}
				if(!Array.isArray(option.series)) {
					option.series = [option.series];
				}
				option.series = option.series.map(item=>{
					if(typeof item == 'string') {
						item = {dataIndex: item};
					}
					if(item.dataIndex) {
						let column;
						for(let col of this.store.columns) {
							if(col.dataIndex == item.dataIndex) {
								column = col;
								break;
							}
						}
						if(column) {
							if(!item.name) {
								item.name = column.text;
							}
						}
						item.data = records.map(r=>r[item.dataIndex]||0);
					}
					if(!item.type)
						item.type = 'line';
					return item;
				});
				if(!option.legend) {
					option.legend = {
						data: option.series.map(s=>s.name)
					}
				}
			}
			if(!option.yAxis)
				option.yAxis = {};
			
			echart.setOption(option);
			this.echart = echart;
		},
		closeChart(){
			this.echart.dispose();
			let rect = this.btn.getBoundingClientRect();
			this.$el.style.left = rect.left+'px';
			this.$el.style.top = rect.top+'px';
			this.$el.style.width = rect.width+'px';
			this.$el.style.height = rect.height+'px';
			setTimeout(()=>{
				this.visible = false;
			}, 200);
		}
	}
}
</script>
<style scoped>
.st-chart-box{
	position: absolute;
	left: 0;
	top: 0;
	width: 0;
	height: 0;
	background-color: rgba(0,0,0,0.3);
	-webkit-backdrop-filter: blur(5px);
	backdrop-filter: blur(5px);
	z-index: 99;
	transition: left 0.2s ease, top 0.2s ease, width 0.2s ease, height 0.2s ease;
}
.st-chart{
	position: absolute;
	left: 10px;
	top: 10px;
	right: 10px;
	bottom: 10px;
	background-color: #f3f3f3;
}
.st-chart-close{
	position: absolute;
	top: 5px;
	right: 5px;
	font-size: 24px;
	opacity: 0.6;
	cursor: pointer;
}
.st-chart-close:hover{
	opacity: 1;
}
</style>
