<template>
  <div class="st-table-cascader">
    <div class="st-table-cascader-panel-box">
      <treepanel :children="root.children" :label="root.label" :depth="0" @click="checkedValue(root.label)"></treepanel>
    </div>
  </div>
</template>

<script>
import treepanel from './coms/treepanel.vue';

export default {
	props: {
    options: Array,
  },
  components: {treepanel},
	data(){
		return {
      checkedValue: [],
      root: {
        label: 'root',
        children: this.options
      }
		};
  },
  computed: {

  },
  watch: {
    options: {
      handler: ()=>{
      },
      deep: true
    }
  },
	mounted(){
	},
	methods: {
    checkedValue(val) {
      this.checkedValue.push(val)
    }
	}
}
</script>

<style lang="scss">
.st-table-cascader{
  display: inline-block;
  position: relative;
  font-size: 14px;
  line-height: 40px;

  &-input {
    -webkit-appearance: none;
    background: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    outline: none;
    padding: 0 15px;
    width: 100%;
  }

  &-panel-box {
    display: flex;
    position: relative;
  }

  &-panel{
    width: 100%;
    min-width: 100px;
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: center;
    border-radius: 4px;
    font-size: 14px;
  }
  
  &-panel-item {
    font-family: 'FontAwesome';
    width: 100%;
    text-align: center;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  &-panel-item .item-more {
    opacity: 0.8;
	  transform: rotate(-90deg);
  }

  &-panel-item .active {
    color:#409eff;
    font-weight: 700;
  }
}
</style>
