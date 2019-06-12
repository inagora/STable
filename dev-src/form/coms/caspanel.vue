<template>
<!-- -->
  <div class="st-table-cascader-panel"
    :style="indent">
    <template>
      <input v-if="label == 'root'" 
        class="st-table-cascader-input" 
        :value="checkedValue" 
        readonly 
        type="text" 
        @click.stop="toggleChildren"/>
      <div v-else class="st-table-cascader-panel-item">
        <div :class="{'active': showChildren}"
          @click="toggleChildren(label)">
          {{label}}
        </div>
        <i v-if="children && children.length > 0" class="st-iconfont st-icon-caret-down item-more"></i>
      </div>
      <caspanel
        v-show="showChildren"
        v-for="(item,index) in children"
        :children="item.children"
        :label="item.label"
        :key="index"
        :depth="depth + 1" >
      </caspanel>
    </template>
  </div>
</template>
<script>
export default {
  props:['label','children','depth','checkedvalue'],
  name: 'caspanel',
  data() {
    return {
      showChildren: false,
    }
  }, 
  computed: {
    indent() {
      // return { transform: `translate(${this.depth * 100}px)` }
      return { transform: `translate(${50}px)` }
    }
  },
  methods:{
    toggleChildren(val) {
      this.showChildren = !this.showChildren;
      // this.checkedValue.push(val);
      // console.log(this.checkedValue)
    }
  }
}
</script>
