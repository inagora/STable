<template>
	<div>
		<!-- 级联选择组件 -->
		<!-- <div>
			<span class="dropTreeLists">
				<span class="benchmark">多选级联选择器:</span>
				<x-cascader 
					:options="configOptions"
					:input-value="configTips"
					@CheckedsIndexCodes="fromTreeCheckeds"
					@on-selected="getSelected"
				/>
			</span>
		</div> -->
		<!-- input组件 -->
		<!-- <div>
			<span class="benchmark">input输入框:</span>
			<x-input
				v-model="inputData"
				:placeholder="'这是一个input组件'"
				type="text"
				:clearable="true"
			/>
			<span class="benchmark">textarea输入框:</span>
			<x-input
				v-model="textareaData"
				:placeholder="'这是一个input组件-textarea'"
				type="textarea"
				maxlength="5"
				:show-word-limit="true"
			/>
		</div> -->
		<!-- tag标签 -->
		<!-- <div>
			<span class="benchmark">tag标签:</span>
			<x-tag
				v-for="(tag,index) in tags"
				:key="index"
				:type="tag.type"
				:closable="true"
				:size="index == 0 ? 'small' : ''"
				@close="closeTag(index)"
			>
				{{ tag.name }}
			</x-tag>
		</div> -->
		<!-- XDatetimePicker -->
		<!-- <div>
			<span class="benchmark">DatetimePicker:</span>
			<x-datetime-picker v-model="time" format="YYYY-MM-DD HH:mm:ss" />
		</div> -->
		<!-- XDatetimePicker range -->
		<!-- <div>
			<span class="benchmark">DatetimePicker range:</span>
			<x-datetime-picker v-model="range" range-separator="至" format="YYYY-MM-DD HH:mm:ss" />
		</div> -->
		<!-- form 表单 -->
		<div>
			<span class="benchmark">form表单:</span>
			<x-form 
				ref="form" 
				:form-config="formConfig" 
				:rules="rules" 
			/>
		</div>
	</div>
</template>

<script>
// import XCascader from "./form/cascader.vue";
// import XInput from "./form/input.vue";
// import XTag from "./form/tag.vue";
// import XDatetimePicker from "./form/datetimepicker.vue";
import XForm from "./form/form.vue";
// import {ajax} from './ajax';

var range_start = new Date();
var tmp = new Date();
var range_end = new Date(tmp.setMonth(tmp.getMonth() + 1));
export default {
	// ,XCascader,XInput,XTag,XDatetimePicker
	components: {XForm},
	data(){
		return {
			// configTips: "请选择",
			// configOptions: [
			// 	{
			// 		value: "1",
			// 		label: "一级菜单1",
			// 		checked: false,  //控制是否默认选中
			// 		multiple: false,   //是否多选   false为该一级菜单不多选，true表示多选
			// 		children: [
			// 			{
			// 				value: 11,
			// 				checked: false,
			// 				multiple: false,
			// 				disabled: false,    //是否禁用
			// 				label: "二级菜单1",
			// 				children: [
			// 					{
			// 						value: "111",
			// 						checked: false,
			// 						multiple: false,   //是否多选   false为该一级菜单不多选，true表示多选
			// 						disabled: false,    //是否禁用
			// 						label: "三级菜单1"
			// 					},
			// 					{
			// 						value: "112",
			// 						multiple: false,
			// 						checked: false,
			// 						label: "三级菜单2"
			// 					},
			// 					{
			// 						value: "113",
			// 						multiple: false,
			// 						checked: false,
			// 						label: "三级菜单3"
			// 					}
			// 				]
			// 			},
			// 			{
			// 				value: "12",
			// 				checked: false,
			// 				multiple: false,
			// 				label: "二级菜单2",
			// 				disabled: false,
			// 				children: [
			// 					{
			// 						value: "121",
			// 						checked: false,
			// 						multiple: true,
			// 						disabled: false,
			// 						label: "三级菜单121"
			// 					},
			// 					{
			// 						value: "122",
			// 						checked: false,
			// 						multiple: true,
			// 						label: "三级菜单122"
			// 					},
			// 					{
			// 						value: "123",
			// 						checked: false,
			// 						multiple: true,
			// 						label: "三级菜单123"
			// 					}
			// 				]
			// 			}
			// 		]
			// 	},{
			// 		value: "2",
			// 		label: "一级菜单2",
			// 		checked: false,  //控制是否默认选中
			// 		multiple: false,
			// 	}
			// ],
			// commonLength: 0,
			// SaveCascadeIndexCodes: [],
			// inputData: '',
			// textareaData: '',
			// tags: [
			// 	{ name: '标签一', type: '' },
			// 	{ name: '标签二', type: 'success' },
			// 	{ name: '标签三', type: 'info' },
			// 	{ name: '标签四', type: 'warning' },
			// 	{ name: '标签五', type: 'danger' }
			// ],
			// selectOptions: [{
			// 	value: 'java',
			// 	label: 'java'
			// }, {
			// 	value: 'php',
			// 	label: 'php'
			// }, {
			// 	value: 'javascript',
			// 	label: 'javascript'
			// }, {
			// 	value: 'nodejs',
			// 	label: 'nodejs'
			// }, {
			// 	value: 'python',
			// 	label: 'python'
			// }, {
			// 	value: 'golang',
			// 	label: 'golang'
			// }],
			// selectValue: [],
			
			formConfig:{
				getMethods: {
					url: '/ajaxFormList',
					method: 'GET',
					data: {}
				},
				postMethods: '/ajaxPostForm',
				formList: [],
			},
			rules: {
				activity_kind: {validator: this.validateKind},
				activity_fee: {validator: this.validateFee},
				activity_textarea: {validator: this.validateTextarea},
				activity_name: {validator: this.validateName},
				activity_region: {validator: this.validateRegion},
			},
			time: new Date(),
			range: [range_start,range_end],
		};
	},
	mounted() {
		this.getData(); //多选
	},
	methods: {
		// 验证方法
		validateKind(rule,val,callback) {
			let arr = val.split(',');
			if (arr.length < 2) {
				callback('最少选择两项');
			}
		},
		validateFee(rule,val,callback) {
			if (val == '') {
				callback('请选择');
			}
		},
		validateTextarea(rule,val,callback) {
			if (val.length < 10) {
				callback('最少10个字 略略略');
			}
		},
		validateName(rule,val,callback) {
			if (val.length > 5) {
				callback('最多不超过5个字 哈哈哈');
			}
		},
		validateRegion(rule,val) {
			if (val == '') {
				console.log('请至少选择一个地区');
			}
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
			this.tags.splice(index,1);
		}
	}
};
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
