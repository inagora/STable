export default {
	methods: {
		download(){
			let records = this.store.getCurrentPage();
			let ret = this.store.emit('beforeexport', records);
			if(ret===false)
				return;
			if(Array.isArray(ret)) {
				records = ret;
			}
			this.export(records);
		},
		downloadAll(){
			this.store.getAllPages().then(records=>{
				let ret = this.store.emit('beforeexport', records);
				if(ret===false)
					return;
				if(Array.isArray(ret)) {
					records = ret;
				}
				this.export(records);
			});
		},
		export(records){
			let table = this.$parent.$refs.table[0];
			let columns = [].concat(table.leftColumns).concat(table.freeColumns).concat(table.rightColumns);
			columns = columns.filter(col=>['text','render'].includes(col.type));

			let headers = [];
			let colsConf = [];
			let sheetData = [];
			columns.forEach(col=>{
				headers.push(col.text);
				colsConf.push({
					wpx: col._st_width
				});
			});
			sheetData.push(headers);

			for(let record of records) {
				let row = [];
				for(let col of columns){
					let idx = col.dataIndex;
					let val = record[idx];

					if(col.type=='render'){
						val = record._st_aux.render[idx];
						if(typeof val=='string')
							val = val.replace(/(<([^>]+)>)/ig,"").trim();
					}
					if(typeof val!='number' && col.exportType=='number'){
						if(typeof val=='string'){
							val = val.replace(/,/g, '');
						}
						val = Number(val);
					}
					row.push(val);
				}
				sheetData.push(row);
			}

			let wb = XLSX.utils.book_new();
			let name = prompt(this.locale.toolbar.confirmFileName,this.title||'data');
			name = (name||'stable').trim();
			if(!name.includes('.')) {
				name += '.xlsx';
			}
			let ws = XLSX.utils.aoa_to_sheet(sheetData);
			ws['!cols'] = colsConf;
			XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
			XLSX.writeFile(wb, name);
		}
	}
};