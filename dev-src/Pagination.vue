<template>
	<div class="st-pb">
		<div class="st-pb-waterfall"></div>
	</div>
</template>

<script>
import XButton from './com/Button.vue';
export default {
	inject: ['store', 'pageMode', 'pagebar', 'params', 'locale'],
	components: {XButton}
}
</script>

<style>

</style>