<template>
	<div v-if="visible" class="st-toolbar">
		<el-button v-if="addUrl" type="primary" size="small" icon="fa fa-plus" @click="add">{{locale.add}}</el-button>
		<el-button v-if="(downloadable===true||downloadable=='single') && isPC" type="primary" size="small" icon="fa fa-download" @click="download">{{locale.toolbar.exportBtnText}}</el-button>
		<el-button v-if="(downloadable===true||downloadable=='all') && isPC" type="primary" size="small" icon="fa fa-download" @click="downloadAll">{{locale.toolbar.exportAllBtnText}}</el-button>
		<el-button
			v-for="(btn,idx) in toolbar"
			:key="idx"
			:icon="btn.icon"
			:type="btn.type"
			@click="btnClick(btn, $event)"
			size="small">{{btn.text}}</el-button>
	</div>
</template>
<script>
	import Dialog from '../com/Dialog.js';
	import XForm from './Form.vue';
	import {ajax} from '../ajax';
	import {loadScript, isPC} from '../util';

	let html = `
		<x-form id="st_add_form" size="medium" label-position="right" :field-list="fields" :default-values="params" label-width="100px" :action-methods="actionMethods" @submit="create">
		</x-form>`;
	export default {
		inject: {
			title: {
				default: ''
			},
			store: {
				default: {}
			},
			toolbar: {
				default: []
			}, 
			addUrl: {
				default: ''
			},
			addConf: {
				default: []
			},
			batDeleteUrl: {
				default: ''
			},
			downloadable: {
				default: ''
			},
			actionMethods: {
				default: {}
			},
			listeners: {
				default: {}
			},
			locale: 'locale'
		},
		data(){
			return {
				visible: this.toolbar.length>0||this.addUrl||this.batDeleteUrl||this.downloadable,
				toolbar: this.toolbar.map(btn=>{
					if(btn.icon) {
						if(!btn.icon.startsWith('el-icon-')){
							btn.icon = 'el-icon-_fa fa fa-'+btn.icon;
						}
					}
					if(!btn.type)
						btn.type = 'default';
					return btn;
				}),
				isPC: isPC()
			}
		},
		mounted(){
			if(this.downloadable){
				loadScript('https://unpkg.com/xlsx@0.14.0/dist/xlsx.full.min.js');
			}
		},
		methods: {
			add(){
				let toolbar = this;
				Dialog.create({
					title: this.locale.add,
					width: 600,
					height: '62%',
					html,
					provide: {
						locale: this.locale
					},
					buttons: [
						{
							text: this.locale.add,
							nativeType: 'submit',
							form: 'st_add_form',
							type: 'success'
						},{
							text: this.locale.cancel,
							click(){
								this.close();
							}
						}
					],
					components:{
						XForm
					},
					data: {
						fields: this.addConf,
						params: {},
						actionMethods: this.actionMethods
					},
					autoShow: true,
					methods: {
						create(data){
							let ret = true;
							if(toolbar.listeners.beforeadd)
								ret = toolbar.listeners.beforeadd.call(toolbar.$parent, data, this);
							if(ret===false)
								return;
							let addUrl = toolbar.addUrl;
							if(ret) {
								if(ret.url)
									addUrl = ret.url;
								if(ret.data)
									data = ret.data;
							}
							ajax({url: addUrl, data, type:toolbar.actionMethods.create}).then(res=>{
								res = res[0];
								if(res.errno==0){
									this.$message({
										message: toolbar.locale.toolbar.addSuccessMsg,
										type: 'success'
									});
									this.close();
									if(toolbar.listeners.add)
										ret = toolbar.listeners.add.call(toolbar.$parent, res, data);
								} else {
									this.$message({
										message: res.errmsg,
										type: 'error'
									});
								}
							});
						}
					}
				});
			},
			download(){
				let list = this.store.getCurrentPage();
				if(this.listeners.beforeexport){
					let ret = this.listeners.beforeexport(list);
					if(Array.isArray(ret)){
						list = ret;
					}
				}
				this.export(list);
			},
			downloadAll(){
				this.store.getAllPages().then(list=>{
					if(this.listeners.beforeexport){
						let ret = this.listeners.beforeexport(list);
						if(Array.isArray(ret)){
							list = ret;
						}
					}
					this.export(list);
				});
			},
			export(data){
				let columns = this.store.columns.filter(col=>col.visible);
		
				let ws_data = [],
					headers = [],
					colsConf = [],
					validColumns = [],
					validType = ['text', 'render', 'tag'];
				columns.forEach(col=>{
					if(!validType.includes(col.type))
						return;
					headers.push(col.text);
					validColumns.push(col);
					colsConf.push({
						wpx: col._width
					});
				});
				ws_data.push(headers);
				
				let list = data.map(item=>{
					let row = [];
					for(let colConf of validColumns){
						let idx = colConf.dataIndex;
						let val = item[idx];

						if(colConf.type=='render'){
							val = item['_'+colConf.dataIndex+'_render_val'];
							if(typeof val=='string')
								val = val.replace(/(<([^>]+)>)/ig,"").trim();
						}
						if(typeof val!='number' && colConf.exportType=='number'){
							if(typeof val=='string'){
								val = val.replace(/,/g, '');
							}
							val = Number(val);
						}
						row.push(val);
					}
					return row;
				});
				ws_data = ws_data.concat(list);
				
				let wb = XLSX.utils.book_new();
				this.$prompt(null, this.locale.toolbar.confirmFileName,{inputValue:this.title||'wandougongzhu'}).then(res=>{
					let name = res.value;
					let ws = XLSX.utils.aoa_to_sheet(ws_data);
					if(colsConf)
						ws['!cols'] = colsConf;

					/* Add the worksheet to the workbook */
					XLSX.utils.book_append_sheet(wb, ws, name);
					XLSX.writeFile(wb, name+'.xlsx');
				}).catch(()=>{});
			},
			btnClick(btn, evt){
				if(btn.click)
					btn.click.call(this.$parent, btn, evt);
			}
		}
	}
</script>
<style scoped>
	.st-toolbar{
		border-bottom: 1px solid #d0d0d0;
		padding: 6px 0 0 8px;
	}
	.st-toolbar>button{
		margin-bottom: 10px;
	}
</style>