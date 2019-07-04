<template>
  <div>
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
      <span class="benchmark">textarea输入框:</span>
      <x-input :placeholder="'这是一个input组件-textarea'" type="textarea" v-model="textareaData" maxlength="5" :showWordLimit="true"></x-input>
    </div>
    <!-- tag标签 -->
    <div>
      <span class="benchmark">tag标签:</span>
      <x-tag v-for="(tag,index) in tags" :key="index" :type="tag.type" :closable="true" :size="index == 0 ? 'small' : ''" @close="closeTag(index)">{{tag.name}}</x-tag>
    </div>
    <!-- form 表单 -->
    <div>
      <span class="benchmark">form表单:</span>
      <x-form ref="form" :formConfig="formConfig">
      </x-form>
    </div>
  </div>
</template>

<script>
import XCascader from "./form/cascader.vue";
import XInput from "./form/input.vue";
import XTag from "./form/tag.vue";
import XForm from "./form/form.vue";
// import XSelect from "./form/select.vue";
// import XCheckbox from "./form/checkbox.vue";
// import XRadio from "./form/radio.vue";
// import XSwitch from "./form/switch.vue";

export default {
	components: {XCascader,XInput,XTag,XForm},
	data(){
    return {
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
      inputData: '',
      textareaData: '',
      tags: [
        { name: '标签一', type: '' },
        { name: '标签二', type: 'success' },
        { name: '标签三', type: 'info' },
        { name: '标签四', type: 'warning' },
        { name: '标签五', type: 'danger' }
      ],
      selectOptions: [{
        value: 'java',
        label: 'java'
      }, {
        value: 'php',
        label: 'php'
      }, {
        value: 'javascript',
        label: 'javascript'
      }, {
        value: 'nodejs',
        label: 'nodejs'
      }, {
        value: 'python',
        label: 'python'
      }, {
        value: 'golang',
        label: 'golang'
      }],
      selectValue: [],
      formConfig:[
        {
          type: 'input',
          label: '活动名称',
          placeholder: '请填写活动名称',
          name: 'activity_name',
        },
        {
          type: 'textarea',
          label: '活动形式',
          placeholder: '请填写活动形式',
          name: 'activity_textarea',
        },
        {
          type: 'select',
          label: '活动区域',
          placeholder: '请选择活动区域',
          name: 'activity_region',
          options:[
            {
              label: '上海',
              value: '0'
            },
            {
              label: '北京',
              value: '1'
            },
            {
              label: '杭州',
              value: '2'
            }
          ]
        },
        {
          type: 'checkbox',
          label: '活动性质',
          options: [
            {label: '美食/餐厅线上活动',value:'001'},
            {label: '地推活动',value:'002'},
            {label: '线下主题活动',value:'003'},
            {label: '单纯品牌曝光',value:'004'},
          ],
          name: 'activity_kind',
        },
        {
          type: 'radio',
          label: '是否收费',
          options: [
            {label: '收费',value: 1},
            {label: '免费',value: 0},
          ],
          name: 'activity_fee',
				},
				{
          type: 'switch',
					label: '不接收广告',
					value: false,
          name: 'activity_ad',
				},
				{
          type: 'button',
					options: [
						{
							text: '取消',
							theme: 'default',
							handle: 'cancel',
						},
						{
							text: '提交',
							theme: 'primary',	
							handle: 'submit',
						}
					]
        },
      ]
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
    closeTag(index) {
      this.tags.splice(index,1)
    }
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
