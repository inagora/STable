import {loadJs, $type} from '../util/util';
import Ajax from '../util/Ajax.js';
import qtip from '../com/qtip.js';
export default {
	mounted(){
		document.documentElement.addEventListener('click', ()=>{
			if(this.field.type=='combobox'){
				if(this.selIdx>=0) {
					this.text = this.options[this.selIdx].text;
				} else {
					this.text = '';
				}
			}
			this.$nextTick(()=>{
				this.$refs.ddm && this.$refs.ddm.hide();
			});
		}, false);

		let dataType = $type(this.field.options);
		if(dataType=='string'){
			this.loading = true;
			Ajax.request({
				url: this.field.options
			}).then(res=>{
				this.loading = false;
				if(res.errno==0 || res.code==0) {
					this.formatList(res.data.options);
				} else {
					qtip.error(res.errmsg||res.msg);
				}
			});
		} else if(dataType=='function') {
			this.loading = true;
			this.field.options(this.field).then(list=>{
				this.loading = false;
				this.formatList(list);
			});
		} else {
			this.formatList();
		}
	},
	methods: {
		formatList(_list){
			let field = this.field;
			let list = _list || field.options;
			let options = [];

			if(!Array.isArray(list)) {
				options = Object.keys(list).map(key=>({
					text: list[key],
					value: key,
					visible: true,
					lowerText: list[key].toLocaleLowerCase()
				}));
			} else {
				options = list.map(item=>{
					if($type(item)=='string') {
						return {
							text: item,
							value: item,
							visible: true,
							lowerText: item.toLocaleLowerCase()
						};
					}
					return item;
				});
			}

			let selected = [];
			if($type(field.value)=='undefined'){
				selected = [];
			} else{
				let val = [];
				if(!Array.isArray(field.value)) {
					val = [field.value];
				}

				let len = options.length;
				for(let v of val) {
					for(let i=0;i<len;i++) {
						if(options[i].value === v) {
							selected.push[i];
							break;
						}
					}
				}
			}
			this.options = options;

			if(this.field.supportPinyinSearch){
				loadJs('https://cdn.jsdelivr.net/gh/inagora/STable/dist/pinyin.min.js').then(()=>{
					let py = window.STable.Pinyin;
					let joinText = function(arr){
						return arr.map(item=>item[0]).join('');
					};
					options.forEach(item=>{
						let text = item.text.toLocaleLowerCase();
						item._s = [
							text,
							joinText(py(text, {style:py.STYLE_FIRST_LETTER})),
							joinText(py(text, {style:py.STYLE_INITIALS})),
							joinText(py(text, {style:py.STYLE_NORMAL}))
						];
					});
				});
			}
		},
		hlNext(){
			this.$refs.ddm&&this.$refs.ddm.hlNext();
		},
		hlPre(){
			this.$refs.ddm&&this.$refs.ddm.hlPre();
		}
	}
};