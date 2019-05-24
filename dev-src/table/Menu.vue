<template>
	<div class="st-table-menu">
		<div class="st-table-menu-item">
			<div class="st-table-menu-title"></div>
			<label class="st-table-menu-checkbox">
				<input type="checkbox" />
			</label>
			<label class="st-table-menu-radio">
				<input type="radio" />
			</label>
			<label class="st-table-menu-radio">
				<input type="radio" />
			</label>
		</div>
	</div>
</template>

<script>
export default {
	props: ['columns'],
	data(){
		return {
			list: []
		};
	},
	methods: {
		show(){
			this.list = this.columns.map(item=>{
				return {
					
				};
			});
		}
	}
}
</script>

<style lang="scss">
.st-table-menu{
	position: absolute;
	left: -10000px;
	top: 0;
	box-shadow: rgb(136,136,136) 0 0 6px;
	border: 1px solid #d0d0d0;

	max-height: 200px;
	overflow-x: hidden;
	overflow-y: auto;
}
</style>
