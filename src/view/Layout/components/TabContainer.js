import React from 'react';
import { inject, observer } from 'mobx-react';
import { Tabs } from 'antd';
import IconFont from '../../../components/IconFont';
import { withRouter } from 'react-router-dom';
import { errorBoundary } from '../../../utils/Decorator';
import TabComponent from './TabComponent';

const TabPane = Tabs.TabPane;

@errorBoundary
@withRouter
@inject('TabStore', 'MenuStore')
@observer
class TabContainer extends React.Component {
	goTab = (activeKey) => {
		const { TabStore, history } = this.props;
		TabStore.changeTab(activeKey, history);
	};
	closeTab = (activeKey) => {
		const { TabStore, history } = this.props;
		TabStore.deleteTab(activeKey, history);
	};
	render() {
		const { TabStore, MenuStore } = this.props;
		const { activeTab, tabList } = TabStore;
		return (
			<Tabs
				className={`menu-tab ${tabList.length === 1 ? 'hide-menu-tab' : ''}`}
				key="tabs"
				type={'editable-card'}
				hideAdd={true}
				animated={true}
				activeKey={activeTab}
				onChange={this.goTab}
				onEdit={this.closeTab}
			>
				{tabList.map((pane, idx) => {
          const module = MenuStore.getMenuForName(pane.moduleName);
          const { id, title, index, icon, location } = pane;
					return (
						<TabPane
							tab={
								<span title={title}>
									{icon && <IconFont type={icon} />}
									{title}
								</span>
							}
							key={id}
						>
							<TabComponent
								key={`${index}-${id}`}
								//key={`${id}_${location.pathname}_${location.search}`}
								module={module}
								tabIndex={index}
								storeId={id}
							/>
						</TabPane>
					);
				})}
			</Tabs>
		);
	}
}

export default TabContainer;
