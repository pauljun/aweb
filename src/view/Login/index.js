import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Form, Button, Input, message } from 'antd';
import { setCacheItem } from '../../utils';
import { Base64 } from 'js-base64';
import IconFont from 'src/components/IconFont';
import ChangePwdMarkView from 'src/view/Layout/components/changePwd';
import CodeView from './components/code';
import { USER } from '../../service/RequestUrl';
import cookie from 'js-cookie';
import moment from 'moment';
import Logo_LINGYANG from '../../assets/img/login/Logo_Antelope.svg'
import LoginGonGan from '../../assets/img/login/Logo_gongan.svg';
import Logo_CloudEye from '../../assets/img/login/Logo_CloudEye.svg';
import GElIN_DeepCloud from '../../assets/img/login/Logo_DeepCloud.svg';
import GELIN_GLINT from '../../assets/img/login/Logo_DEEPGLINT.svg'
import './index.scss';

const FormItem = Form.Item;

@withRouter
@inject('UserStore', 'LoggerStore')
@observer
class LoginView extends Component {
	state = {
		changePwdVisible:false,
		//登录方式,: 默认账号密码登录, false:手机验证码登录
		activeTab: '1',
		loginLoading: false,
		videoKey: Math.random(),
		systemInfo: {}
	};
	com
	componentWillMount() {
		let { 
			UserStore, 
			history,
		} = this.props;
		// UserStore.setLoginState(false);
		let ocLogoId = history.location.pathname.split('login/')[1];
		// if(ocLogoId) {
			cookie.set('loginType', ocLogoId);
		// }
		// let loginType = cookie.get('loginType') || '';
		// 	if(loginType && loginType !== 'undefined') {
		// 		window.location.replace(`/login/${loginType}`);
		// 	} else {
		// 		window.location.replace('/login');
		// 	}
		// const isLogin = UserStore.isLogin;
		// let loginType = cookie.get('loginType') || '';
		// if (isLogin) {
		// 	if(loginType) {
		// 		window.location.replace(`/login/${loginType}`);
		// 	} else {
		// 		window.location.replace('/login');
		// 	}
		// }
		// UserStore.queryWebConfig().then(res => {
		// 	this.setState({
		// 		icp: res.icp
		// 	})
		// })
		ocLogoId && UserStore.getOptByLoginKeyUrl({
			loginKeyUrl: ocLogoId,
			loginKey: Base64.encode(ocLogoId)
		}).then(res => {
			if(res.code === 200){
				this.setState({
					systemInfo: res.result
				})
			}
		})
	}

  /**获取验证码 */
  getLoginCode = () => {
    const { form } = this.props;
    return new Promise((resolve, reject) => {
      form.validateFields(['loginName', 'userPwd'], (err, value) => {
        if (err) {
          console.error('表单错误', err);
          reject(err);
        }
        let option = {
          loginStep: 1,
          loginName: value.loginName,
          userPwd: Base64.encode(value.userPwd)
        };
        resolve(option);
      });
    });
  };

  // 登录
  submitEvent = e => {
    e.preventDefault();
		const { UserStore, history, LoggerStore } = this.props;
		const isGL=Boolean(window.webConfig.loginType==2);
    this.props.form.validateFields((err, values) => {
      if (err) {
        console.error('表单错误', err);
        return;
      }
      this.setState({
        loginLoading: true
      });
      let params = {
        loginName: values.loginName,
        userPwd: Base64.encode(values.userPwd),
        identifyCode:isGL?9528:values.identifyCode,//深瞳云默认验证码9528
        loginStep: 2
      };
      // if (values.phoneNum) {
      // 	params.phoneNum = values.phoneNum;
      // 	params.identifyCode = values.identifyCode;
      // }
      const name = params.loginName;
      UserStore.getLoginCode(params)
        .then(res => {
          setCacheItem('token', res.result.token, 'cookie');
          LoggerStore.save({
            ...USER.USER_LOGIN.logInfo[0],
            description: `【${name}】登录系统`
          });
          if (!res.result.isModifyPassWord) {
            this.setState({
              changePwdVisible: true,
              loginLoading: false
            });
            return;
          }
          UserStore.setLoginState(true);
          setTimeout(() => {
            history.replace('/');
          }, 10);
        })
        .catch(res => {
          if (res.code === 50100) {
            this.setState({
              phoneNum: res.result.phoneNum,
              activeTab: '2',
              loginLoading: false
            });
            message.warning('管理已开启手机验证功能,请进行手机验证!');
          } else {
            this.setState({
              loginLoading: false
            });
          }
        });
    });
  };

  closeChangePwdMark = () => {
    this.setState({
      changePwdVisible: false
    });
  };

	tabChange = (value) => {
		this.setState({
			activeTab: value
		});
	};
	render() {
		let { activeTab, loginLoading, systemInfo } = this.state;
		let realGL=window.webConfig.loginType;
		const { getFieldDecorator } = this.props.form;
		return (
			<div className='user_login_view' >
				<div className="top-part">
					<div className="line-top" />
					<video muted width="100%" height="auto" src="/video.mp4" autoPlay loop />
				</div>
				<div className="user_login_content">
          <div className="login_content_title">
						<i className="title_icon">
							{realGL==1?<img src={systemInfo.systemLogo || LoginGonGan } />:''}
						</i>
					{realGL==1?<span className="title_text">{systemInfo.systemName || '智慧云眼'}</span>:''}
					</div>
					<div className={`login_content_info ${realGL==2?'gelin-height':''}`}>
							<Form size="large" onSubmit={this.submitEvent}>
								<FormItem label="用户名">
									{getFieldDecorator('loginName', {
										rules: [
											{
												required: true,
												message: `请输入用户名`
											}
										]
									})(
										<div>
											<Input
												prefix={
													<IconFont
														type={'icon-TreeIcon_People_Main2'}
														style={{ fontSize: '24px', color: '#8899bb' }}
														theme="outlined"
													/>
												}
												autoComplete="off"
												name="user"
												placeholder={'请输入用户名'}
											/>
										</div>
									)}
								</FormItem>
								<FormItem label="密码">
									{getFieldDecorator('userPwd', {
										rules: [
											{
												required: true,
												message: `密码是必填项`
											}
										]
									})(
										<div>
											<Input
												prefix={
													<IconFont
														type={'icon-PassWord_Light'}
														style={{ fontSize: '24px', color: '#8899bb' }}
														theme="outlined"
													/>
												}
												autoComplete="new-password"
												name="password"
												type="password"
												placeholder={'请输入密码'}
											/>
										</div>
									)}
								</FormItem>
								  {realGL==1&&<FormItem label="验证码">
									{getFieldDecorator('identifyCode', {
										rules: [
                      {
                        required: true,
                        message: `请输入验证码`
                      },{
                        max:6,
                        message:'请输入正确的验证码'
                      }
                    ]
									})(
										<div className="login_info_message">
											<Input
												prefix={
													<IconFont
														style={{ fontSize: '24px', color: '#8899bb' }}
														type={'icon-PhoneNum_Light'}
														theme="outlined"
													/>
												}
												autoComplete="new-password"
												name="identifyCode"
												type="text"
												placeholder={'请输入验证码'}
											/>
											<CodeView UserStore={this.props.UserStore} getLoginCode={this.getLoginCode} />
										</div>
									)}
								</FormItem>}
								<Form.Item className="login-btn-con">
									<Button
										loading={loginLoading}
										size="large"
										type="primary"
										htmlType="submit"
										className="login-btn mt10"
									>
										{'登录'}
									</Button>
								</Form.Item>
							</Form>
					</div>
				</div>
				<div className="user_login_footer">
					<div className={`login_footer_box ${realGL==2?'another':''}`}>
						<div className="img_box">
							<span className="footer_img" style={{backgroundImage: `url(${realGL==2?GELIN_GLINT:Logo_LINGYANG})`}} />
							<span className="footer_img" style={{backgroundImage: `url(${realGL==2?GElIN_DeepCloud:systemInfo.coLogo || Logo_CloudEye})`}} />
						</div>
						<p className="footer_text">
							为获得最佳使用体验，建议使用谷歌浏览器最新版，并在分辨率为1920×1080的显示器上显示
							<a
								className="footer-logo-google-link"
								target="_blank"
								href="https://www.google.cn/chrome/"
								rel="noopener noreferrer"
							>
								下载Chrome浏览器
							</a>
							<br />
							{/* Copyright 2016 深圳羚羊极速科技有限公司 版权所有 粤ICP备16124741号-1 */}
							{realGL==2?'':window.webConfig.icp}
						</p>
					</div>
				</div>
				<ChangePwdMarkView
					changePwdVisible={this.state.changePwdVisible}
					maskClosable={false}
					closable={false}
					closeChangePwdMark={this.closeChangePwdMark}
				/>
			</div>
		);
	}
}

export default Form.create({})(LoginView);
