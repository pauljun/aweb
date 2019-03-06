import React from 'react';
import { observer, inject } from 'mobx-react';
@inject('MenuStore')
@observer
class AuthComponent extends React.Component {
	render() {
		let { MenuStore, actionName, noAuthContent } = this.props;
		let action = MenuStore.getAuthAction(actionName); //获取按钮权限
		if (!action) {
			return noAuthContent ? noAuthContent : null;
		} else {
			return React.cloneElement(this.props.children);
		}
	}
}

@inject('MenuStore')
@observer
class AuthMultipleComponent extends React.Component {
	render() {
		let { MenuStore, actionNames, noAuthContent } = this.props;
		let action = false;
		actionNames.map((actionName) => {
			let isAuth = MenuStore.getAuthAction(actionName);
			if (!!isAuth) {
				action = true;
			}
		});
		if (!action) {
			return noAuthContent ? noAuthContent : null;
		} else {
			return React.cloneElement(this.props.children);
		}
	}
}

AuthComponent.AuthMultipleComponent = AuthMultipleComponent

export default AuthComponent;
