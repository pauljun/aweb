import React from 'react';
import { observer } from 'mobx-react';
import TabRoute from '../../../components/TabRoute';
import { withRouter } from 'react-router-dom';
import { BusinessProvider } from '../../../utils/Decorator/BusinessProvider';

import './index.scss';

@withRouter
@BusinessProvider('TabStore', 'MenuStore')
@observer
export default class LoggerView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeMenu: 'mail'
		};
	}
	handleMenuClick = (e) => {
		this.setState({
			activeMenu: e.key
		})
	}
	getMenuInfo() {
    const { MenuStore } = this.props;
    return MenuStore.getMenuForName(MenuStore.activeMenu);
  }
	render() {
		let {activeMenu} = this.state;
		return (
			<div className="setting-logger">
				<section className="logger-content">
					{/* <Menu mode="horizontal" selectedKeys={[activeMenu]} onClick={this.handleMenuClick}>
						<Menu.Item key="mail">平台应用日志</Menu.Item> */}
						{/* <Menu.Item key="aad">App应用日志</Menu.Item> */}
					{/* </Menu> */}
					<TabRoute moduleLevel={3} defaultModule={'PlatformLogger'} menuInfo={this.getMenuInfo()} {...this.props} />
				</section>
			</div>
		);
	}
}
