<template>
  <div>
    <!-- tree组件 -->
    <div class="st-form-box">
      <x-cascader v-model="value" :options="treeData" @change="handleChange"></x-cascader>
    </div>
    <!-- 级联选择组件 -->
    <div >
      <span class="dropTreeLists">
        <span class="benchmark">基准&nbsp;:</span>
        <multi-cascader 
                      v-on:CheckedsIndexCodes="FromTreeCheckeds"
                      :options="configOptions"
                      @on-selected="getSelected"
                      :inputValue="configTips"></multi-cascader>
      </span>
    </div>
  </div>
</template>

<script>
import XCascader from './form/cascader.vue';
import multiCascader from "./form/MulCheckCascader.vue";

export default {
	components: {XCascader,multiCascader},
	data(){
    return {
      treeData: [{
        value: 'zhinan',
        label: '指南',
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          children: [{
            value: 'yizhi',
            label: '一致'
          }, {
            value: 'fankui',
            label: '反馈'
          }, {
            value: 'xiaolv',
            label: '效率'
          }, {
            value: 'kekong',
            label: '可控'
          }]
        }, {
          value: 'daohang',
          label: '导航',
          children: [{
            value: 'cexiangdaohang',
            label: '侧向导航'
          }, {
            value: 'dingbudaohang',
            label: '顶部导航'
          }]
        }]
      }, {
        value: 'zujian',
        label: '组件',
        children: [{
          value: 'basic',
          label: 'Basic',
          children: [{
            value: 'layout',
            label: 'Layout 布局'
          }, {
            value: 'color',
            label: 'Color 色彩'
          }, {
            value: 'typography',
            label: 'Typography 字体'
          }, {
            value: 'icon',
            label: 'Icon 图标'
          }, {
            value: 'button',
            label: 'Button 按钮'
          }]
        }, {
          value: 'form',
          label: 'Form',
          children: [{
            value: 'radio',
            label: 'Radio 单选框'
          }, {
            value: 'checkbox',
            label: 'Checkbox 多选框'
          }, {
            value: 'input',
            label: 'Input 输入框'
          }, {
            value: 'input-number',
            label: 'InputNumber 计数器'
          }, {
            value: 'select',
            label: 'Select 选择器'
          }, {
            value: 'cascader',
            label: 'Cascader 级联选择器'
          }, {
            value: 'switch',
            label: 'Switch 开关'
          }, {
            value: 'slider',
            label: 'Slider 滑块'
          }, {
            value: 'time-picker',
            label: 'TimePicker 时间选择器'
          }, {
            value: 'date-picker',
            label: 'DatePicker 日期选择器'
          }, {
            value: 'datetime-picker',
            label: 'DateTimePicker 日期时间选择器'
          }, {
            value: 'upload',
            label: 'Upload 上传'
          }, {
            value: 'rate',
            label: 'Rate 评分'
          }, {
            value: 'form',
            label: 'Form 表单'
          }]
        }, {
          value: 'data',
          label: 'Data',
          children: [{
            value: 'table',
            label: 'Table 表格'
          }, {
            value: 'tag',
            label: 'Tag 标签'
          }, {
            value: 'progress',
            label: 'Progress 进度条'
          }, {
            value: 'tree',
            label: 'Tree 树形控件'
          }, {
            value: 'pagination',
            label: 'Pagination 分页'
          }, {
            value: 'badge',
            label: 'Badge 标记'
          }]
        }, {
          value: 'notice',
          label: 'Notice',
          children: [{
            value: 'alert',
            label: 'Alert 警告'
          }, {
            value: 'loading',
            label: 'Loading 加载'
          }, {
            value: 'message',
            label: 'Message 消息提示'
          }, {
            value: 'message-box',
            label: 'MessageBox 弹框'
          }, {
            value: 'notification',
            label: 'Notification 通知'
          }]
        }, {
          value: 'navigation',
          label: 'Navigation',
          children: [{
            value: 'menu',
            label: 'NavMenu 导航菜单'
          }, {
            value: 'tabs',
            label: 'Tabs 标签页'
          }, {
            value: 'breadcrumb',
            label: 'Breadcrumb 面包屑'
          }, {
            value: 'dropdown',
            label: 'Dropdown 下拉菜单'
          }, {
            value: 'steps',
            label: 'Steps 步骤条'
          }]
        }, {
          value: 'others',
          label: 'Others',
          children: [{
            value: 'dialog',
            label: 'Dialog 对话框'
          }, {
            value: 'tooltip',
            label: 'Tooltip 文字提示'
          }, {
            value: 'popover',
            label: 'Popover 弹出框'
          }, {
            value: 'card',
            label: 'Card 卡片'
          }, {
            value: 'carousel',
            label: 'Carousel 走马灯'
          }, {
            value: 'collapse',
            label: 'Collapse 折叠面板'
          }]
        }]
      }, {
        value: 'ziyuan',
        label: '资源',
        children: [{
          value: 'axure',
          label: 'Axure Components'
        }, {
          value: 'sketch',
          label: 'Sketch Templates'
        }, {
          value: 'jiaohu',
          label: '组件交互文档'
        }]
      }],
      value: [],
      //////////
      configTips: "请选择基准",
      configOptions: [
        {
          value: "1",
          label: "一级菜单",
          checked: false,  //控制是否默认选中
          multiple: false,   //是否多选   false为该一级菜单不多选，true表示多选
          children: [
            {
              value: 11,
              checked: false,
              multiple: false,
              disabled:true,    //是否禁用
               label: "二级菜单",
              children: [
                {
                  value: "21",
                  checked: false,
                  multiple: false,   //是否多选   false为该一级菜单不多选，true表示多选
                  disabled :true,    //是否禁用
                  label: "三级菜单1"
                },
                {
                  value: "22",
                  checked: false,
                  label: "三级菜单2"
                }
              ]
            },
            {
              value: "12",
              checked: false,
              multiple: false,
              label: "二级菜单",
              children: [
                {
                  value: "399300",
                  checked: true,
                  label: "三级菜单复制"
                },
                {
                  value: "399300",
                  checked: false,
                  label: "三级菜单"
                }
              ]
            }
          ]
        },{
          value: "1",
          label: "一级菜单no",
          checked: false,  //控制是否默认选中
          multiple: false,
        }
      ],
      commonLength: "",
      SaveCascadeIndexCodes: [],
      SaveJiZhunParams: [], //保存业绩表现需要的参数
    }
  },
  mounted() {
    this.MulitGetlistBenchmark(); //多选
  },
  methods: {
    handleChange(value) {
      console.log(value);
    },
    ///////////
    // 点击每一个item的时候的操作   在这个方法内灵活判断多选的状态以及禁用状态
    getSelected(val) {
      let strnum = val.length;
      
      // 当选中的指数大于1并且小于10的时候让所有的指数都可以选择（没有禁用状态）
      if (val.length > 1 && val.length < 10) {
        this.LessThanThen(this.configOptions);
      }
      // 必须保留一个选中的
      if (val.length == 1) {
        let moreOne = val[0];
        this.LessThanMoreOne(this.configOptions, moreOne);
      }
      // 当选中的指数大于10的时候让除选中的之外的指数都变为禁用状态
      if (val.length >= 10) {
        let moreOne = val;
        this.LessThanMoreTen(this.configOptions, moreOne);
      }
      if (strnum !== this.commonLength) {
        //将选中后的数组暴漏出去，在需要的页面使用
        this.$emit("CheckedsIndexCodes", val);
      }
      this.commonLength = val.length;
      // 勿删后期需求改变会用
      // this.selectGroups = val;
      // this.configTips = `已选择${val.length}个分组`;
    },
    // 此递归为当选中的指数大于10的时候让除选中的之外的指数都变为禁用状态
    LessThanMoreTen(datas, moreOne) {
      for (var i in datas) {
        if (datas[i].multiple !== false) {
          // console.log(datas[i]);
          datas[i].disabled = true;
          for (let d = 0; d < moreOne.length; d++) {
            if (datas[i].value == moreOne[d]) {
              datas[i].disabled = false;
            }
          }
        } else {
          this.LessThanMoreTen(datas[i].children, moreOne);
        }
      }
    },
    // 此递归为当选中的为选中的只剩下一个的时候禁止取消，也就是必须保留一个选中的
    LessThanMoreOne(datas, moreOne) {
      for (var i in datas) {
        if (datas[i].multiple !== false) {
          // console.log(datas[i]);
          if (datas[i].value == moreOne) {
            datas[i].disabled = true;
          }
        } else {
          this.LessThanMoreOne(datas[i].children, moreOne);
        }
      }
    },
    // 此递归为当选中的为  满足该条件时(val.length > 1 && val.length < 10)  所有的item的都可以选则
    LessThanThen(datas) {
      for (var i in datas) {
        if (datas[i].multiple !== false) {
          // console.log(datas[i]);
          datas[i].disabled = false;
        } else {
          this.LessThanThen(datas[i].children);
        }
      }
    },
    // 此递归为初始化时默认选中沪深300，由于只有一个所以禁用沪深300
    getArrayList(datas) {
      for (var i in datas) {
        if (datas[i].multiple !== false) {
          // console.log(datas[i]);
          datas[i].disabled = false;
          if (datas[i].value === "399300") {
            datas[i].disabled = true;
            datas[i].checked = true;
          }
        } else {
          // console.log(datas[i]);
          //每次在传入父节点的childreg去查找，自己调用自己的方法
          this.getArrayList(datas[i].children);
        }
      }
    },
    MulitGetlistBenchmark() {
      // //此接口为我们项目中的接口，上边有数据模板，可根据数据模板来写数据。
      // getlistBenchmark({}).then(response => {
      //   this.configOptions = response.data.data;
      //   this.getArrayList(this.configOptions);
      // });
      console.log(this.configOptions)
    },
    //多选选择基准时的code
    FromTreeCheckeds(IndexCodes) {
      //IndexCodes就是选中的item的数组，操作他就好了
      // console.log(IndexCodes);
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
