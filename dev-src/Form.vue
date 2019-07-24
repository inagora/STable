<template>
	<div>
	
		<div>
			<span class="benchmark">form表单:</span>
			<x-form 
				ref="form" 
				:form-config="formConfig"
				:rules="rules" 
			/>
			<!--  -->
			<!-- :action-methods="actionMethods"
			:field-list="fieldList" -->
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
			actionMethods: {
				read: 'GET',
			},
			fieldList: [],
			formConfig:{
				getMethods: {
					url: '/ajaxFormList',
					read: 'GET',
					data: {}
				},
				postMethods: '',
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
