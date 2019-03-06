import React, { Component } from 'react';
import { observer } from 'mobx-react';
import ItemComponentCopy from './ItemComponentCopy';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import { errorBoundary } from 'src/utils/Decorator';

@errorBoundary
@BusinessProvider('JurisdictionOverviewStore')
@observer
class Storage extends Component {
    state = {
		resourcesStatis: {}
	};

	componentDidMount() {
		this.props.JurisdictionOverviewStore.getStorage().then((res) => {
			this.setState({ resourcesStatis: res.result || {} });
		});
	}
    render() {
        let {resourcesStatis} = this.state
        return (
            <div className='chart table'>
                <div className='flow-item-wrapper'>
                    <ItemComponentCopy
                        label='对象存储'
                        subLabel1='存储总量'
                        subLabel2='昨日新增'
                        icon='icon-Data___Dark'
                        value1={resourcesStatis.ObjTotalStorage || 0}
                        value2={resourcesStatis.ObjNewAddStorage || 0}
                    />
                    <ItemComponentCopy
                        label='流媒体存储'
                        subLabel1='存储总量'
                        subLabel2='昨日新增'
                        icon='icon-Data___Dark1'
                        value1={resourcesStatis.StreamTotalStorage || 0}
                        value2={resourcesStatis.StreamTotalStorage || 0}
                    />
                </div>
            </div>
        )
    }
}
export default Storage;