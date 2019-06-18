<template lang='html'>
  <div class='multil-cascader'>
    <div class="multi-cascader-popover st-iconfont" @click="toggleShowChildren">
      <input class="slect-panel" v-if="activeItem[0] && activeItem[0].level === 0"  v-model="inputValue" readonly/>
      <caspanel
          :height="height"
          :width="width"
          :option="options"
          @handleOutPut="whenOutPut"
          :selectedValues="selectedValues"
          :outputType="outputType">
      </caspanel>
    </div>
  </div>
</template>

<script>
import caspanel from "./coms/caspanel.vue";

export default {
  name: "multiCascader",
  props: {
    options: {
      type: Array,
      default() {
        return [];
      }
    },
    width: {
      type: String,
      default: ""
    },
    height: {
      type: String,
      default: ""
    },
    inputValue: {
      type: String,
      default() {
        return "";
      }
    },
    outputType: {
      type: String,
      default() {
        return "value";
      }
    }
  },
  data() {
    return {
      // 被选中的值
      selectedValues: [],
      showChildren: true,
      activeItem: [],
      outputValue: [],
      optionDicts: [],
      inputArrow: "el-icon-arrow-down",
      popoverWidth: "",
      flatOptions: []
    };
  },
  watch: {
    options: function() {
      this.initData();
    }
  },
  components: {
    caspanel
  },
  created() {
    this.initData();
    this.setOptionDicts(this.options);
    this.toFlatOption(this.options);
  },
  methods: {
    toggleShowChildren() {
      this.showChildren= !this.showChildren;
    },
    // 初始化数据 对于每一项 options 添加相关字段并且获取到当前被点击到的元素
    initData() {
      this.setLevel();
      const { width, height } = this;
      const checkedValues = [];
      let childrenValues = [];
      const getChecked = item => {
        const { checked, value, children, level, siblingValues } = item;
        if (siblingValues) {
          const tempValues = [...siblingValues];
          item.siblingValues = tempValues;
        }
        childrenValues.push(value);
        if (children && children.length > 0) {
          children.forEach(child => {
            getChecked(child);
          });
        } else {
          if (checked && item[this.outputType])
            checkedValues.push(item[this.outputType]);
            
        }
      };
      this.activeItem = this.options;
      this.options.forEach(child => {
        getChecked(child);
        child.childrenValues = [...childrenValues];
        childrenValues = [];
      });
      this.selectedValues = checkedValues;
      
      this.whenOutPut(this.selectedValues);
    },
    getTypeOptions(values, outputType) {
      const outputValues = [...values];
      const finalOutputArr = [];
      return this.flatOptions.reduce((pev, cur) => {
        const { value: curVal } = cur;
        if (outputType === "item") {
          if (outputValues.includes(curVal)) pev.push(cur);
        } else {
          if (outputValues.includes(curVal) && cur[outputType])
            pev.push(cur[outputType]);
        }
        return pev;
      }, []);
    },
    // 展开配置中的各项， [{}], 排除 children 属性
    toFlatOption(option) {
      const getItems = (arr, cur) => {
        const keys = Object.keys(cur);
        const newObj = {};
        const curChild = cur.children;
        const hasChild = curChild && curChild.length > 0;
        keys.forEach(key => key !== "children" && (newObj[key] = cur[key]));
        arr.push(newObj);
        return hasChild ? curChild.reduce(getItems, arr) : arr;
      };
      this.flatOptions = option.reduce(getItems, []);
    },
    // 设置配置的字典
    setOptionDicts(options) {
      if (!Array.isArray(options)) {
        const { label, value } = options;
        this.optionDicts.push({ value, label });
        const children = options.children;
        if (children) {
          this.setOptionDicts(children);
        }
      } else {
        options.forEach(opt => {
          this.setOptionDicts(opt);
        });
      }
    },
    // 触发 on-selected 事件
    whenOutPut(value) {
      // 根据选中的值数组 value 输出特定 outputType 类型
      if (this.outputType !== "value") {
        this.outputValue = this.getTypeOptions(value, this.outputType);
      } else {
        this.outputValue = value;
      }
      this.$emit("on-selected", this.outputValue);
    },
    // 设定层级
    setLevel() {
      const siblingValues = [];
      let tempLevel = 0;
      if (this.options.length) {
        const addLevel = option => {
          const optChild = option.children;
          if (option.level === tempLevel) {
            siblingValues.push(option.value);
          }
          if (optChild) {
            optChild.forEach(opt => {
              opt.level = option.level + 1;
              addLevel(opt);
            });
          }
        };
        this.options.forEach(option => {
          if (!option.level) {
            option.level = 0;
            tempLevel = option.level;
          }
          addLevel(option);
          option.siblingValues = siblingValues;
        });
      }
    },
    showSecondLevel(item) {
      this.activeItem = item;
    }
  }
};
</script>
<style lang='scss' scoped>
.multi-cascader-popover{
  background: #fff;
  min-width: 150px;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  padding: 12px;
  z-index: 2000;
  color: #606266;
  line-height: 1.4;
  text-align: justify;
  font-size: 14px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  word-break: break-all;
}
.vk-menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style-type: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  outline: none;
  padding: 8px 20px;
  font-size: 14px;
  width: 100%;
  &:hover {
    background-color: rgba(125, 139, 169, 0.1);
  }
}
.multil-cascader {
  // width: 155px;
  display: flex;
}
.multil-cascader:hover {
  cursor: pointer;
}
</style>