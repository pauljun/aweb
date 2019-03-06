import React from 'react';
import { Button, Input, Form, message, Popover } from 'antd';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import FormUpload from 'src/components/FormUpload';
import { withRouter } from 'react-router-dom';
import Socket from '../../../../libs/Socket';
import MapCenter from '../../components/MapZoomAndLevel';
import { searchFormat } from 'src/utils/index.js';
import IconFont from 'src/components/IconFont';
import LingMou from 'src/assets/img/LingMou_64.svg';
import Logo_CloudEye from 'src/assets/img/login/Logo_CloudEye.svg';
import './index.scss';
const FormItem = Form.Item;

const formItemLayout = {
	labelCol: {
		span: 2
	},
	wrapperCol: {
		span: 8
	}
};

const noticeLogo = (
	<div className='notice-item'>
		<p>1、尺寸: 长宽比为1:1,最好为64*64px</p>
		<p>2、配色: Logo主色调为亮色,背景模糊,保证在深色背景上的识别度</p>
		<p>3、格式: SVG, PNG</p>
	</div>
)

const noticeCologo = (
	<div className='notice-item'>
		<p>1、尺寸: 高度为40像素,宽度不限</p>
		<p>2、配色: 请上传颜色为冰蓝色(#B2BFD9), 背景透明图片</p>
		<p>3、格式: SVG, PNG</p>
	</div>
)

@withRouter
@BusinessProvider('OperationCenterStore', 'TabStore', 'UserManagementStore')
@Form.create()
class view extends React.Component {
	constructor() {
		super();
		this.systemInfo = {}
		this.userInfo = {}
	}
	state = {
		coLogoValue: ''
	}
	baseUrl = `${window.location.origin}/login/`
	/**提交 */
	submit() {
		const { form, OperationCenterStore, TabStore } = this.props;
		form.validateFields((err, values) => {
			if (err) {
				return false;
			}
			values.isCheckPhoneNumber = 1//values.isCheckPhoneNumber ? 1 : 0;
			values.userInfo = {
				loginName: values.loginName,
				phoneNum: values.phoneNum
			};
			values.zoomLevelCenter = this.zoom
			values.centerPoint = this.centerPoint
			values.coLogoDefault = undefined
			if (this.ocId) {
				values.id = this.ocId;
				values.userInfo.id = this.userInfo.id
				OperationCenterStore.update(values).then(() => {
					message.success('操作成功！');
					Socket.emit('OperationCenterChange');
					// TabStore.closeCurrentTab({ history: window.ReactHistory });
					this.props.changeModel()
				});
			} else {
				OperationCenterStore.add(values).then(() => {
					message.success('添加成功！');
					Socket.emit('OperationCenterChange');
					TabStore.closeCurrentTab({ history: window.ReactHistory });
					// this.props.changeModel()
				});
			}
		});
	}
	onOk(info) {
		this.zoom = info.zoom
		this.centerPoint = `${info.center.lng},${info.center.lat}`
	}

	Pointparse = (point) => {
		let arr = point.split(',');
		return [arr[0] * 1, arr[1] * 1]
	}

	async componentDidMount() {
		const { history, OperationCenterStore, form } = this.props;
		if (history.location.search) {
			const params = searchFormat(history.location.search)
			this.ocId = params.id;
			const res = await OperationCenterStore.getDetail(this.ocId)
			this.centerPoint = res.centerPoint
			this.zoom = res.zoomLevelCenter
			this.systemInfo = res
			form.setFieldsValue({
				centerName: res.centerName,
				contactPerson: res.contactPerson,
				contactPhone: res.contactPhone || '',
				loginName: res.userInfo && res.userInfo.loginName,
				systemName: res.systemName,
				systemLogo: res.systemLogo,
				loginKeyUrl: res.loginKeyUrl,
				coLogo: res.coLogo,
				coLogoDefault: `${this.baseUrl}${res.loginKeyUrl}`,
				isCheckPhoneNumber: res.isCheckPhoneNumber ? true : false,
				phoneNum: res.userInfo && res.userInfo.phoneNum,
			})
		}
	}

	/**图片上传 */
	Upload(url) {
		console.log(url);
	}

	/**复制url */
	async copy() {
		let coLogo = await this.props.form.getFieldValue('loginKeyUrl');
		this.props.form.setFieldsValue({
			coLogoDefault: `${this.baseUrl}${coLogo || ''}`,
		}, () => {
			var Url2 = document.getElementById("coLogoDefault");
			Url2.select();
			document.execCommand("Copy");
			message.success("复制成功!");
		})
	}

	/**上传组件内容 */
	uploadComonent(type) {
		return <div className='upload-content'>
			<IconFont type='icon-AddImg_Light' />
		</div>
	}

  /**重置密码 */
  resetPsw = () => {
    const { UserManagementStore } = this.props
    this.setState({ resetLoading: true })
    UserManagementStore.resetPsw(this.systemInfo.userInfo.id).then(() => {
      message.success('重置密码成功')
      this.setState({ resetLoading: false })
    })
  }

	/**取消 */
	cancelBack = () => {
		const { changeModel, TabStore } = this.props
		if(changeModel){
			changeModel()
		}else{
			TabStore.closeCurrentTab({ history: window.ReactHistory });
		}
	};
	render() {
		const { getFieldDecorator } = this.props.form;
		const zoomLevelCenter = {
			zoom: this.zoom,
			center: this.centerPoint ? this.Pointparse(this.centerPoint) : null
		}
		return (
			<React.Fragment>
				<div className='optCenter-content'>
					<div className="optCenter-add-contianer">
						<div className="optCenter-container-main">
							{/* <Title className="optCenter-title" key="title" name={''}>
							{this.ocId && (
								<Button type="primary" className="orange-btn">
									重置密码
								</Button>
							)}
						</Title> */}
							<div className="setting-operation-center-eidt" style={{ paddingTop: '20px' }}>
								<Form>
									<h3>
										基本信息
										{this.ocId && (
											<Button 
												type="primary" 
												className="orange-btn"
												loading={this.state.resetLoading}
												onClick={this.resetPsw}
											>
												重置密码
											</Button>
										)}
									</h3>
									<FormItem label="运营中心名称 :" {...formItemLayout}>
										{getFieldDecorator('centerName', {
											rules: [{ required: true, message: '运营中心名称必须填写' }]
										})(<Input maxLength="30" placeholder="请填写运营中心名称" />)}
									</FormItem>
									<FormItem label="联系人姓名 :" {...formItemLayout}>
										{getFieldDecorator('contactPerson')(
											<Input autoComplete="off" maxLength="50" type="text" placeholder="请输入联系人姓名" />
										)}
									</FormItem>
									<FormItem label="联系人电话 :" {...formItemLayout}>
										{getFieldDecorator('contactPhone', {
											rules: [
												{
													validator(rule, value, callback, source, options) {
														var errors = [];
														if (!/^(1)\d{10}$/.test(value) && value) {
															errors[0] = '请输入正确的手机号码';
														}
														callback(errors);
													}
												}
											]
										})(<Input type="text" autoComplete="off" placeholder="请输入联系人电话" />)}
									</FormItem>
									<h3>登录页设置</h3>
									<FormItem label="登录账号 :" {...formItemLayout}>
										{getFieldDecorator('loginName', {
											rules: [
												{
													required: true,
													message: '请输入运营中心超级管理员登录账号'
												}
											]
										})(<Input type="text" disabled={!this.ocId ? false : true} placeholder="请填写登录账号" />)}
									</FormItem>
									<FormItem label="登录手机号 :" {...formItemLayout} type="phone">
										{getFieldDecorator('phoneNum', {
											rules: [
												{ required: true, message: '请输入手机号码' },
												{
													validator(rule, value, callback, source, options) {
														var errors = [];
														if (!/^(1)\d{10}$/.test(value) && value) {
															errors[0] = '请输入正确的手机号码';
														}
														callback(errors);
													}
												}
											]
										})(<Input maxLength="11" placeholder="请输入手机号码" />)}
									</FormItem>
									<FormItem label="地图初始状态 :" {...formItemLayout}>
										<div className='map-init-wrapper map-dia-disable'>
											<MapCenter
												mapChange={this.onOk.bind(this)}
												zoomLevelCenter={zoomLevelCenter}
											/>
										</div>
									</FormItem>
									<h3>登录页</h3>
									<FormItem label="系统名称 :" {...formItemLayout}>
										{getFieldDecorator('systemName', {
											rules: [{ required: true, message: '请输入运营中心系统名称' }]
										})(<Input maxLength="15" placeholder="请填写系统名称" />)}
									</FormItem>
									<FormItem label="系统logo" {...formItemLayout} style={{ marginBottom: '10px' }}>
										<div className='system-logo-wrapper system-logo-item'>
											<Popover
												placement="right"
												trigger="hover"
												content={noticeLogo}
												overlayClassName='system-popover'
											>
												<div className='system-logo-form'>
													{getFieldDecorator('systemLogo', {
														rules: [{ required: true, message: '请上传系统logo' }],
													})(<FormUpload name="systemLogo" childView={this.uploadComonent} support='svg' />)}
												</div>
											</Popover>
											<div className='notice-example'>
												<label>图例 :</label>
												<span>
													<img src={LingMou} />
												</span>
											</div>
										</div>
									</FormItem>
									{/* <FormItem label="开启手机验证 :" {...formItemLayout}>
									{getFieldDecorator('isCheckPhoneNumber', {
										valuePropName: 'checked',
										initialValue: false
									})(<Checkbox />)}
								</FormItem> */}
									<FormItem label="合作单位logo" {...formItemLayout}>
										<div className='system-cologo-wrapper system-logo-wrapper'>
											<Popover
												placement='right'
												trigger='hover'
												content={noticeCologo}
												overlayClassName='system-popover'
											>
												<div className='system-logo-form'>
													{getFieldDecorator('coLogo')(<FormUpload name="coLogo" childView={this.uploadComonent} support='svg' />)}
												</div>
											</Popover>
											<div className='notice-example'>
												<label>图例 :</label>
												<span className='co'>
													<img src={Logo_CloudEye} />
												</span>
											</div>
										</div>
									</FormItem>
									<FormItem label="运营中心URL :" {...formItemLayout}>
										<div className='opt-edit-teil' name='loginKeyUrl'>
											<span>{this.baseUrl}</span>
											{getFieldDecorator('loginKeyUrl', {
												rules: [
													{
														validator(rule, value, callback) {
															var errors = [];
															if (/[^a-zA-Z0-9]/g.test(value) && value) {
																errors[0] = '请输入10个字符以内的字母或数字';
															}
															callback(errors);
														}
													}
												]
											})(
												<Input maxLength="10" placeholder="请输入字母或数字" />
											)}
											<Button
												onClick={this.copy.bind(this)}
												className='login-url-copy'
											>
												<IconFont type='icon-Version_Main' />
												复制链接
						  			</Button>
											<span className='notice'>请记录此URL, URL设置成功后该运营中心用户需由此地址登录!</span>
										</div>
									</FormItem>
									<FormItem label="运营中心URL :" {...formItemLayout} className='cologo-hidden'>
										{getFieldDecorator('coLogoDefault')(
											<Input
												type='text'
												id='coLogoDefault'
											/>
										)}
									</FormItem>
								</Form>
							</div>
							<div className='opt-center-group'>
								<Button className="opt-action-btn" onClick={this.cancelBack}>
									取消
							</Button>
								<Button type="primary" className="orange-btn opt-action-btn" onClick={this.submit.bind(this)}>
									保存
							</Button>
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default view;
