<template>
	<div
		v-if="searchFilter"
		class="st-search"
		:class="{
			'st-search-label-invisible':!labelVisible
		}"
	>
		<x-form
			ref="form"
			inline
			:field-list="searchFilter"
			size="small"
			:label-visible="labelVisible"
			@submit="search"
		>
			<x-button
				:conf="{
					nativeType: 'submit',
					type: 'primary',
					icon: 'st-icon st-icon-search',
					text: locale.search
				}"
			/>
			<x-button
				v-if="searchResetable"
				:conf="{
					cls: 'st-search-reset-btn',
					text: locale.reset
				}"
				@click.prevent="reset"
			/>
			<template
				v-if="searchAreaBtns && searchAreaBtns.length > 0"
			>
				<div class="st-search-separator">
					&nbsp;
				</div>
				<x-button 
					v-for="(btn, index) in searchAreaBtns"
					:key="'btn_' + index"
					class="st-search-customize-btn"
					:conf="btn"
					@click="triggerClick(btn, $event)"
				/>
			</template>
		</x-form>
	</div>
</template>

<script>
import XButton from './com/Button.vue';
import XForm from './form/index.vue';
import {loadJs} from './util/util.js';
import downloadMixin from './mixins/download.mixin.js';

export default {
	components:{ XButton, XForm },
	mixins: [downloadMixin],
	inject: [
		'searchFilter',
		'searchResetable',
		'labelVisible',
		'listeners',
		'actionMethods',
		'urlSearchParams',
		'params',
		'store',
		'ignoreEmptySearchParam',
		'locale',
		'searchAreaBtns'
	],
	mounted() {
		let downloadable = false;
		if(this.searchAreaBtns && this.searchAreaBtns.length > 0) {
			for (let i = 0; i < this.searchAreaBtns.length; i++) {
				if(this.searchAreaBtns[i].downloadable) {
					downloadable = true;
					break;
				}
			}
		}
		if(downloadable) {
			loadJs('https://cdn.jsdelivr.net/npm/xlsx@0.15.0/dist/xlsx.full.min.js');
		}
	},
	methods: {
		search(evt) {
			let searchParams = Object.assign({}, this.urlSearchParams, evt);
			if(this.ignoreEmptySearchParam) {
				searchParams = this.trimParam(searchParams);
				
			}
			let ret = this.store.emit('search', searchParams);
			if(ret===false)
				return;
			this.store.searchParams = searchParams;
			this.store.$emit('load', {reset: true});
		},
		reset() {
			this.$refs.form.reset();
		},
		trimParam(data){
			let params = {};
			for(let key in data) {
				if(typeof data[key]=='string') {
					if(data[key])
						params[key] = data[key];
				} else if(typeof data[key] != 'undefined') {
					params[key] = data[key];
				}
			}

			return params;
		},
		triggerClick(btn, evt){
			if(btn.downloadable === 'single') { // 下载
				this.download();
			} else if(btn.downloadable === 'all') {
				this.downloadAll();
			} else {
				btn.click&&btn.click.call(this.$parent, btn, evt);
			}
		}
	}
};
</script>

<style lang="scss">
.st-search{
	border-bottom: 1px solid #d0d0d0;
	padding: 10px 0 0 10px;

	&-separator{
		display: inline-block;
		width: 1px;
		overflow: hidden;
		margin-left: 8px;
		margin-bottom: 10px;
		background-color: #d0d0d0;
	}
	&-reset-btn{
		margin-left: 10px;
	}
	&-customize-btn {
		margin-left: 10px;
	}
}
</style>
