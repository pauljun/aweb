import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form, Input, message } from 'antd';
import Submit from './submit';
import { withRouter } from 'react-router-dom';
import FormUpload from 'src/components/FormUpload';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import * as _ from 'lodash';

import '../style/baseInfo.scss';

const FormItem = Form.Item;

@withRouter
@BusinessProvider('VillageListStore', 'TabStore', 'OrgStore')
@observer
class EditForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			isDisabled: {},
			btnLoad:false
		};
	}
	villageImgUrl=null
	// 保存操作
	handleSave = () => {
		let { form,mapData, initData,handleCancel, VillageListStore } = this.props;
		form.validateFieldsAndScroll((err, values) => {
			if (err) {
				return;
			}
			console.log('values',values)
			console.log('mapData',mapData)
			this.setState({
				btnLoad: true
			});
			if (this.isAdd) {
				let Info = {
					...values,
					picUrl:this.villageImgUrl,
					rangeCoordinates: JSON.stringify(mapData)
				};
				VillageListStore.addVillage(Info)
					.then(() => {
						message.success('新建小区成功');
						this.setState({
							btnLoad: false
						});

						handleCancel();
					})
					.catch(() => {
						this.setState({
							btnLoad: false
						});
					});
			}
			if (!this.isAdd) {
				let Info = {
					id: initData.id,
					...values,
					picUrl: this.villageImgUrl || initData.picUrl,
					rangeCoordinates:mapData.length > 0 ? JSON.stringify(mapData) : initData.rangeCoordinates
				};
				VillageListStore.updateVillage(Info)
					.then(() => {
						message.success('编辑小区成功');
						this.setState({
							btnLoad: false
						});
						handleCancel();
					})
					.catch(() => {
						this.setState({
							btnLoad: false
						});
					});
			}
		});
	};
	  /**记录当前页面对应的上传图片的url */
		onUploadChange = (value) => {
			this.villageImgUrl = value
		}
	render() {
		let { key, loading } = this.state;
		let { form, isView, initData, handleCancel } = this.props;
		let { getFieldDecorator } = form;
		const formItemLayout = {
			labelCol: { span: 3 },
			wrapperCol: { span: 9 },
			colon: true
		};
		return (
			<React.Fragment>
				<div className="village-Edit-Form">
					{isView ? (
						<React.Fragment>
							<div>
								<i>小区名称:</i>
								<span>{initData.villageName}</span>
							</div>
							<div>
								<i>小区地址:</i>
								<span>{initData.address}</span>
							</div>
							<div>
								<i>小区形象图:</i>
								<span className="villageImg">
									<img src={initData.picUrl} alt="小区形象图" />
								</span>
							</div>
						</React.Fragment>
					) : (
						<Form onSubmit={this.handleSave.bind(this)} autoComplete="off" className="roleForm" key={key}>
							<FormItem className="villageName" label="小区名称：" {...formItemLayout} autoComplete="off">
								{getFieldDecorator('villageName', {
									rules: [
										{ required: true, message: '小区名称必须填写' },
										{
											max: 20,
											message: '最大长度为20'
										}
									],
									initialValue: this.isAdd ? '' : initData.villageName
								})(<Input placeholder="请填写小区名称" />)}
							</FormItem>
							<FormItem label="小区地址：" className="address" {...formItemLayout}>
								{getFieldDecorator('address', {
									rules: [
										{
											required: true,
											message: '小区地址必须填写'
										},
										{
											max: 150,
											message: '最大长度是150'
										}
									],
									initialValue: this.isAdd ? '' : initData.address
								})(<Input placeholder="请填写小区地址" />)}
							</FormItem>
							<FormItem
								{...formItemLayout}
								className="uploadForm"
								label="小区形象图:"
								// ref={view => this.formUpload = view}
							>
								{getFieldDecorator('picUrl', {
									initialValue: this.isAdd ? '' : initData.picUrl
								})(
									<FormUpload name="userAvatar" onChange={this.onUploadChange}/>
								)}
							</FormItem>
						</Form>
					)}
				</div>
				{!isView && <Submit handleSave={this.handleSave} handleCancel={handleCancel} />}
			</React.Fragment>
		);
	}
}

export default Form.create()(EditForm);
