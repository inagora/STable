<template>
	<div>search</div>
</template>

<script>
export default {
	mounted(){
		console.log('search mounted');
		if(this.searchFilter) {
			this.store.searchParams = this.getParams();
		}
	}
}
</script>

<style>

</style>
