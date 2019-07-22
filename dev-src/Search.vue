<template>
	<div>search</div>
</template>

<script>
export default {
	mounted(){
		if(this.searchFilter) {
			this.store.searchParams = this.getParams();
		}
	}
};
</script>

<style>

</style>
