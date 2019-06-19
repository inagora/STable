<template>
  <div>
    <!-- tree组件 -->
    <div class="st-form-box">
      <span class="benchmark">树型菜单:</span>
      <x-tree v-model="value" :options="configOptions" @change="handleChange"></x-tree>
    </div>
    <!-- 级联选择组件 -->
    <div >
      <span class="dropTreeLists">
        <span class="benchmark">多选级联选择器:</span>
        <x-cascader 
                      v-on:CheckedsIndexCodes="fromTreeCheckeds"
                      :options="configOptions"
                      @on-selected="getSelected"
                      :inputValue="configTips"></x-cascader>
      </span>
    </div>
    <!-- input组件 -->
    <div>
      <span class="benchmark">input输入框:</span>
      <x-input :placeholder="'这是一个input组件'" type="text" v-model="inputData" :clearable="true"></x-input>
    </div>
  </div>
</template>

<script>
import XTree from './form/tree.vue';
import XCascader from "./form/cascader.vue";
import XInput from "./form/input.vue";

export default {
	components: {XTree,XCascader,XInput},
	data(){
    return {
      value: [],
      configTips: "请选择",
      configOptions: [
        {
          value: "1",
          label: "一级菜单1",
          checked: false,  //控制是否默认选中
          multiple: false,   //是否多选   false为该一级菜单不多选，true表示多选
          children: [
            {
              value: 11,
              checked: false,
              multiple: false,
              disabled: false,    //是否禁用
              label: "二级菜单1",
              children: [
                {
                  value: "111",
                  checked: false,
                  multiple: false,   //是否多选   false为该一级菜单不多选，true表示多选
                  disabled: false,    //是否禁用
                  label: "三级菜单1"
                },
                {
                  value: "112",
                  multiple: false,
                  checked: false,
                  label: "三级菜单2"
                },
                {
                  value: "113",
                  multiple: false,
                  checked: false,
                  label: "三级菜单3"
                }
              ]
            },
            {
              value: "12",
              checked: false,
              multiple: false,
              label: "二级菜单2",
              disabled: false,
              children: [
                {
                  value: "121",
                  checked: false,
                  multiple: true,
                  disabled: false,
                  label: "三级菜单121"
                },
                {
                  value: "122",
                  checked: false,
                  multiple: true,
                  label: "三级菜单122"
                },
                {
                  value: "123",
                  checked: false,
                  multiple: true,
                  label: "三级菜单123"
                }
              ]
            }
          ]
        },{
          value: "2",
          label: "一级菜单2",
          checked: false,  //控制是否默认选中
          multiple: false,
        }
      ],
      commonLength: 0,
      SaveCascadeIndexCodes: [],
      inputData: ''
    }
  },
  mounted() {
    this.getData(); //多选
  },
  methods: {
    handleChange(value) {
      // console.log(value);
    },
    // 点击每一个item的时候的操作，在这个方法判断多选的状态
    getSelected(val) {
      let strnum = val.length;
      if (strnum !== this.commonLength) {
        //选中的数组，可在需要的页面使用
        this.$emit("CheckedsIndexCodes", val);
      }
      this.commonLength = val.length;
      this.configTips = val;
    },
    singleSelected(datas, moreOne) {
      for (var i in datas) {
        if (datas[i].multiple == false) {
          datas[i].checked = true;
          for (let d = 0; d < moreOne.length; d++) {
            if (datas[i].value == moreOne[d]) {
              datas[i].checked = false;
            }
          }
        }
      }
    },
    getData() {
      //此接口用于获取数据
      // console.log(this.configOptions)
    },
    fromTreeCheckeds(IndexCodes) {
      //IndexCodes就是选中的item的数组，操作他就好了
      this.SaveCascadeIndexCodes = IndexCodes;
    },
  }
}
</script>

<style lang="scss">
.st-toolbar {
  border-bottom: 1px solid #d0d0d0;
  padding: 10px 0 0 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  &-separator {
    display: inline-block;
    width: 1px;
    overflow: hidden;
    margin-right: 8px;
    margin-bottom: 10px;
    background-color: #d0d0d0;
  }

  .st-btn {
    margin-right: 8px;
    margin-bottom: 10px;
  }
}
</style>
