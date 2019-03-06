import React from 'react';
import { observer } from 'mobx-react';
import { Form, Input, Button, Select, TreeSelect } from 'antd';
import { BusinessProvider } from '../../../../../utils/Decorator/BusinessProvider';
import DateRangePicker from 'src/components/RangePicker';
import moment from 'moment';
import { toJS } from 'mobx';
import IconFont from 'src/components/IconFont';
import _ from 'lodash';
const FormItem = Form.Item;
const Option = Select.Option;
@BusinessProvider('TabStore', 'LogManagementStore', 'OrgStore', 'UserStore')
@observer
class SearchForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			actionModelTypeCopy:[],
			actionFeaturnTypeCopy: [],
			userInfo: {},
			dateBegin: null,
			dateEnd: moment(),
		};
	}
	componentDidMount(){    
		this.setEndTime()
	}
	setEndTime = () => {
		let currentDayLastTime = new Date();
		currentDayLastTime.setHours(23);
		currentDayLastTime.setMinutes(59);
		currentDayLastTime.setSeconds(59);
		const endTime = moment(currentDayLastTime).format('YYYY-MM-DD HH:mm:ss');
		let { LogManagementStore } = this.props;
		LogManagementStore.editSearchData({endTime});
	  this.setState({ dateEnd: moment(currentDayLastTime)*1 });
	}
	 /**
   * 重置表单
   */
  reset = () => {
		let { LogManagementStore,form } = this.props;
		LogManagementStore.initData();
		let options = {
			description: '',
		}
		let resetData = Object.assign({},options,LogManagementStore.searchData)
		form.setFieldsValue({ ...resetData});
		this.setState({
			dateBegin: null,
			// dateEnd: moment()*1,
		})
		this.setEndTime()
    this.props.search()
  };
	handleSubmit = (e) => {
		let { UserStore } = this.props;
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);
			}
			console.log(values,'value')
			let options = {
				userName: values.userName,
        module: values.module,
        function: values.function,
        description: values.description,
				organizationCode: values.organizationCode,
				pageNum: 1,
				centerId: UserStore.userInfo.optCenterId,
			};
			this.props.search(options);
		});
	};
	actionPlatTypeChange = (options) => {
		const { form,appList,actionModelType,logInfoDict} = this.props;
		var actionFeaturnTypeCopy =[]
		var actionModelTypeCopy =[]
		if(options===undefined){
			form.setFieldsValue({
				"module": undefined,
				"function":undefined
			});
			actionModelTypeCopy= []
			actionFeaturnTypeCopy= []
		}else{
			form.setFieldsValue({
				"module": null,
				"function":undefined
			});
			if(options){
						if(options==1101){
							appList.map(v => {
								if(v.parent) {
									actionFeaturnTypeCopy.push(v);
								} else {
									actionModelTypeCopy.push(v);
								}
							})
						}else{
							logInfoDict.map(v => {
								if(v.parent) {
									actionFeaturnTypeCopy.push(v);
								} else {
									actionModelTypeCopy.push(v);
								}
							})
						}
					}else{
							actionModelTypeCopy= _.cloneDeep(actionModelType)
							actionFeaturnTypeCopy= []
					}
			actionModelTypeCopy.unshift({ code: null, text: '全部'})
			actionFeaturnTypeCopy.unshift({ code: null, text: '全部'})
		}
		this.setState({
			actionModelTypeCopy,
			actionFeaturnTypeCopy
		})
	}
	menuTypeChange = (options) => {
		const { form, actionFeaturnType } = this.props;
		var actionFeaturnTypeCopy =[]
		if(options===undefined){
			form.setFieldsValue({
				actionFeaturnTypeCopy: null,
				"function":undefined
			});
			actionFeaturnTypeCopy=[]
		}else{
			form.setFieldsValue({
				actionFeaturnTypeCopy: null,
				"function":null
			 });
			if(options){
				actionFeaturnTypeCopy=actionFeaturnType.filter(v => v.parent === options)
				actionFeaturnTypeCopy.unshift({code:null,text:'全部'}) 
			}else{
				actionFeaturnTypeCopy=actionFeaturnType
			}
		}
	
		
		this.setState({
			actionFeaturnTypeCopy,
		});
	};
	getTreeData = (data) => {
		let list = [];
		data.map((v) => {
			let childrenList = [];
			if (v.children && v.children.length > 0) {
				childrenList = this.getTreeData(v.children);
			}
			list.push({
				title: v.name,
				value: v.id + '',
				key: v.id,
				children: childrenList
			});
			return list;
		});
		return list;
	};
	timeChange = (type, value) => {
		const { LogManagementStore } = this.props
    let {dateBegin, dateEnd} = this.state;
	  let startTime = moment(new Date(dateBegin)), endTime = moment(new Date(dateEnd));
	  if(type === 'startTime'){
      startTime = moment(new Date(value));
      this.setState({dateBegin: value});
	  } else{
      endTime = moment(new Date(value));
      this.setState({dateEnd: value});
		}
		startTime = startTime.format('YYYY-MM-DD HH:mm:ss');
	  endTime = endTime.format('YYYY-MM-DD HH:mm:ss');
		let timeOptions = {startTime, endTime}
		LogManagementStore.editSearchData(timeOptions)
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const {actionPlatType } = this.props
    const { actionFeaturnTypeCopy, dateBegin, dateEnd ,actionModelTypeCopy} = this.state;
		let treeData = this.getTreeData(toJS(this.props.OrgStore.orgAllList));
		return (
			<div className="logger-search-form">
				<Form layout="vertical" >
          <FormItem label="操作人:">
						{getFieldDecorator('userName', {
							rules: [
								{ max: 20, message: '名称长度最大不能超过20' },
								{ whitespace: true, message: '名称不能为空白'}
							]
						})(<Input type="text" placeholder="请输入姓名" maxLength="20" />)}
					</FormItem>
					<FormItem label="操作端:">
						{
							getFieldDecorator('platform')(
								<Select allowClear={true} onChange={this.actionPlatTypeChange} placeholder="请选择" >
									{actionPlatType.map((v) => (
										<Option key={v.code} value={v.code} title={v.text}>
											{v.text}
										</Option>
									))}
              	</Select>
							)
						}
					</FormItem>
          <FormItem label="操作模块:">
            {getFieldDecorator('module')(
              <Select allowClear={true} onChange={this.menuTypeChange} placeholder="请选择">
                {actionModelTypeCopy.map((v) => (
                  <Option key={v.code} value={v.code} title={v.text}>
                    {v.text}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
					<FormItem label="操作功能:" >
            {getFieldDecorator('function')(
              <Select allowClear={true} placeholder="请选择">
                {actionFeaturnTypeCopy.map((v) => (
                  <Option key={v.code} value={v.code} title={v.text}>
                    {v.text}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="所属组织:">
            {getFieldDecorator('organizationCode')(
              <TreeSelect
                dropdownClassName='log-org-select-tree'
                allowClear
								showSearch
                treeNodeFilterProp="title"
                treeData={treeData}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="请选择:"
                treeDefaultExpandedKeys={[treeData[0] ? treeData[0].key : '']}
              />
            )}
          </FormItem>
          <FormItem label="时间段:" className="rangeTime">
            {getFieldDecorator('rangeTime')(
							<DateRangePicker
								allowClear={false}
								startTime={dateBegin}
								endTime={dateEnd}
								onChange={this.timeChange}
					  	/>
					  )}
          </FormItem>
          <FormItem label="描述:" className="log-describe">
            {getFieldDecorator('description', {
              rules: [
                { max: 100, message: '描述长度最大不能超过100' },
                { whitespace: true , message: '描述不能为空白'}
              ]
            })(<Input type="text" placeholder="请输入描述" maxLength="20"/>)}
          </FormItem>
          <div className="log-search">
					  <Button onClick={this.reset} style={{width:'82px'}}>重置</Button>
						<Button type="primary" onClick={this.handleSubmit}>
							<IconFont type="icon-Search_Main" />查询
						</Button>
          </div>
				</Form>
			</div>
		);
	}
}

export default (SearchForm = Form.create({})(SearchForm));
