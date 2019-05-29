export default {
	data(){
		return {
			menuLeft: -10000,
			menuTop: -10000,
			menuVisible: false
		};
	},
	methods: {
		showMenu(data){
			this.menuVisible = true;
			this.menuLeft = 0;
			this.menuTop = 0;
			this.$nextTick(()=>{
				this.menuAdjust(data.evt);
			});
		},
		menuAdjust(evt){

		}
	}
};