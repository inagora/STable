<template>
  <div class="st-select"
       @click.stop="showMenu">
    <div class="st-select-tags"
        v-if="multiple"
        @keydown.down.prevent="navigateOptions('next')"
        @keydown.up.prevent="navigateOptions('prev')"
        ref="tags">
      <span v-if="selected.length">
        <x-tag
          type="info"
          v-for="(item,index) in selected"
          :key="index"
          class="st-select-tags-item"
          :closable="true"
          @close="deleteTag($event, item)">
          <span class="st-select-tags-text">{{multiple ? item : item.label}}</span>
        </x-tag>
      </span>
      <!-- 搜索框 -->
      <input
        type="text"
        class="st-select-input"
        v-if="filterable"
        @input="handleQueryChange"
        @keydown.delete="deletePrevTag"
				@keydown.enter.prevent="handleOption"
        :value="query">
    </div>
    <template v-else>
        <!-- @keydown.enter.prevent="createOption" -->
      <input 
        type="text"
        class="st-select-input"
        v-model="selected.label"/>
    </template>
    
    <div class="st-select-menu" v-show="visible" v-clickoutside="handleClose">
			<template v-if="filterOptions.length == 0">
				<ul v-show="options.length > 0 && visible">
					<li 
						v-for="(item,index) in options"
						:key="getValueKey(item)"
						class="st-select-menu-item"
						:class="[{'st-select-menu-item-hover': index == hoverIndex}]"
						@click.stop="setSelected(index,item)">
						{{item.label}}
					</li>
				</ul>
			</template>
			<template v-if="filterOptions.length > 0">
				<ul v-show="visible">
					<li 
						v-for="(item,index) in filterOptions"
						:key="getValueKey(item)"
						class="st-select-menu-item"
						:class="[{'st-select-menu-item-hover': index == hoverIndex}]"
						@click.stop="setSelected(index,item)"
						@keydown.enter.prevent="setSelected(index,item)">
						{{item.label}}
					</li>
				</ul>
			</template>
      
    </div>
  </div>
</template>

<script>
import XTag from './tag.vue'
import Tool from './tool';
import {loadJs} from '../util';

const regExpString = (value = '') => String(value).replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');

export default {
  mixins: [Tool],
  name: 'XSelect',
  componentName: 'XSelect',
  provide() {
    return {
      'XSelect': this
    };
  },
  components:{XTag},
  props:{
    filterable: Boolean,
    allowCreate: Boolean,
    multiple: {
      type: Boolean,
      default: false,
    },
    options: Array,
    valueKey: {
      type: String,
      default: 'value'
    },
  },
  data(){
    return {
      options: [],
      selected: this.multiple ? [] : {},
      visible: false,
      hoverIndex: -1,
      query: '',
      targetArr: '',
			filterOptions: [],
    }
  },
  directives: {'clickoutside': Tool._clickOutside},
  computed: {
    
  },
  watch: {
    selected: {
      handler(val) {
        this.selected = val
				this.$emit('selectchange', this.selected.toString());
      }
    },
    visible: {
      handler(val) {
        this.visible = val
      }
		},
		filterOptions: {
			deep: true,
			handler(val) {
				this.filterOptions = val
      }
		},
		query: {
			handler(val) {
				this.query = val;
				if (val == '') {
					this.filterOptions = [];
				}
			}
		}
  },
  methods: {
		handleOption() {
			if (!this.visible) {
				this.showMenu();
			} else {
				if (this.filterOptions.length == 0 && this.options[this.hoverIndex]) {
					this.setSelected(this.hoverIndex, this.options[this.hoverIndex]);
				}
				if (this.filterOptions.length > 0 && this.filterOptions[this.hoverIndex]) {
					this.setSelected(this.hoverIndex, this.filterOptions[this.hoverIndex]);
				}
			}
		},
    showMenu() {
      if(!this.visible)
      this.visible = true;
    },
    deleteTag(event, tag) {
      let index = this.selected.indexOf(tag);
      if (index > -1) {
        const value = this.selected.slice();
        value.splice(index, 1);
        this.selected = value;
      }
      event.stopPropagation();
    },
    setSelected(index,option) {
      if(!this.multiple) {
        this.selected = option;
        this.visible = false;
      } else {
        const arr = (this.selected || []).slice();
        const optionIndex = this.getValueIndex(arr, option.label);
        // 赋值
        if (optionIndex > -1) {
          //值已选中则删除
          arr.splice(optionIndex, 1);
        } else {
          //未选中 push
          arr.push(option.label);
        }
        this.selected = arr
        this.visible = true
        this.query = ''
        // document.querySelector('.st-select-input').focus();
			}
    },
    getValueKey(item) {
      if (Object.prototype.toString.call(item.label).toLowerCase() !== '[object object]') {
        return item.value;
      } else {
        return Tool._getValueByPath(item.label, this.valueKey);
      }
    },
    getValueIndex(arr = [], value) {
      if (Tool._typeOf(value) != 'object') {
        return arr.indexOf(value);
      } else {
        const valueKey = this.valueKey;
        let index = -1;
        arr.some((item, i) => {
          if (Tool._getValueByPath(item, valueKey) === Tool._getValueByPath(value, valueKey)) {
            index = i;
            return true;
          }
          return false;
        });
        return index;
      }
    },
    handleQueryChange(event) {
      this.query = event.target.value
			this.searchQuery(this.options,this.query);
		},
		searchQuery(options, query) {
			let self = this;
			function joinText(arr){
				return arr.map(item=>item[0]).join('');
			}
			loadJs('https://cdn.jsdelivr.net/gh/inagora/STable/dist/pinyin.min.js').then(()=>{
				let py = window.pinyin;
				let _options = options;
				_options.forEach(item=>{
					let text = item.label.toLocaleLowerCase();
					item._s = [
						text,
						joinText(py(text, {style:py.STYLE_FIRST_LETTER})),
						joinText(py(text, {style:py.STYLE_INITIALS})),
						joinText(py(text, {style:py.STYLE_NORMAL}))
					];
				});
				let q = this.query.toLocaleLowerCase();
				let newOptions = _options.filter(item=>{
					let opt = item._s;
					return opt.includes(q) || item.label.includes(q)
				});
				this.filterOptions = newOptions
			});
		},
    testRegExp(targetOpt) {
      // 正则匹配决定是否显示当前option
      if (this.filterable)
      return this.query!='' ? new RegExp(regExpString(this.query), 'i').test(targetOpt) : true;
    },
    createOption(event) {
      let query = event.target.value;
      if(query && query!= '' && this.selected.indexOf(query) == '-1') {
        if (this.multiple) {
          this.selected.push(query)
          this.query = '';
        } else {
          this.selected.label = query
          this.query = '';
        }
      } else if(query == '') {
        this.setSelected(this.hoverIndex,this.options[this.hoverIndex])
      }
    },
    navigateOptions(direction) {
      if (this.options.length === 0) return;
      if (direction === 'next') {
        this.hoverIndex++;
        if (this.hoverIndex === this.options.length) {
          this.hoverIndex = 0;
        }
      } else if (direction === 'prev') {
        this.hoverIndex--;
        if (this.hoverIndex < 0) {
          this.hoverIndex = this.options.length - 1;
        }
      }
      // document.querySelector('.st-select-input').focus();
    },
    setHoverIndex(index,item) {
      this.hoverIndex = index;
      this.setSelected(index,item)
    },
    deletePrevTag() {
      if((this.multiple && this.selected.length == 0) || (!this.multiple && this.selected.label == '') || this.query != '') return
      this.selected.pop();
    },
    handleClose(e) {
      this.visible = false;
    },
  },
  created() {
    let targetArr = [];
    this.options.map(item=>{
      targetArr.push(item.label)
    })
    this.targetArr = targetArr;
  },
  mounted() {
    // document.querySelector('.st-select-input').focus();
  },
  beforeDestroy() {

  }
}
</script>

<style lang="scss" scoped>
.st-input {
  position: relative;
  font-size: 14px;
  width: 100%;
}
.st-select {
  width: 100%;
  min-height: 40px;
  display: inline-block;
  position: relative;
  border: 1px solid #dcdfe6;

  &-input {
    // border-color: #409eff;
    border: none;
  }
  &-input:focus {
    outline: none;
  }
  &-tags {
    line-height: normal;
    white-space: normal;
    z-index: 1;
    text-align: center;
    flex-wrap: wrap;
    display: flex;
    align-items: center;
    min-height: 40px;
    
    &-item {
      height: 24px;
      line-height: 22px;
      padding: 0 8px;
      box-sizing: border-box;
      margin: 2px 0 2px 6px;
    }
  }

  &-menu {
    min-width: 240px;
    position: absolute;
    border: 1px solid #e4e7ed; 
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    box-sizing: border-box;
    margin: 5px 0;   
    padding: 6px 0; 
    z-index: 9;
    
    &-item {
      font-size: 14px;
      padding: 0 20px;
      position: relative;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #606266;
      height: 34px;
      line-height: 34px;
      box-sizing: border-box;
      cursor: pointer;

      &-hover {
        background: #f5f7fa;
      }
    }
  }
}
</style>

