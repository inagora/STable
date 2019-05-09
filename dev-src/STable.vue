<template>
	<div class="stable">
		<ts></ts>
		<div v-text="f"></div>
	</div>
</template>
<script>
import Ts from "./ts.vue";
export default {
	components:{Ts},
	data(){
		return {
			f:Math.random()
		}
	}
}
</script>
<style>
.stable{
	font-size: 12px;
}
</style>
