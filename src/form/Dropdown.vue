<template>
	<div class="st-ddm">
		<label
			tabindex="0"
			v-for="(item,idx) of field.list"
			:key="idx"
			class="st-ddm-item"
		>
			<input
				v-model="val"
				class="st-ddm-input"
				:type="field.type=='multiple'?'checkbox':'radio'"
				:value="item.value"
			/>
			<span v-text="item.text"></span>
		</label>
	</div>
</template>

<script>
export default {
	inject: ['field'],
	data(){
		return {
			val: ''
		};
	},
	mounted(){

	},
	methods: {
		hlNext(){},
		hlPre(){}
	}
};
</script>

<style lang="scss">
.st-ddm{
	position: absolute;
	
	&-item{
		display: block;
	}
}
</style>