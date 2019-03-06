import React from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Tabs, Spin } from 'antd';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import childConfigs from './child_config';
import { searchFormat } from 'src/utils/index.js';
import './index.scss';

const TabPane = Tabs.TabPane;

@withRouter
@BusinessProvider('TabStore')
@observer
export default class CenterVillageListEdit extends React.Component {
  constructor(props) {
    super(props);
    const params = searchFormat(this.props.location.search)
    let status = [false, false, false]
    status[params.type - 1] = params.isEdit ? true : false
    this.state = {
      loading: false,
      params,
      status: status
    }
  }
  /**切換 */
  changeModel(type, index){
    let { status } = this.state
    status[index] = type
    this.setState({ status })
  }
  render() {
    let {
      loading,
      params,
      status
    } = this.state;
    let disabled = false
    if(status.filter(v => v).length){
      disabled = true
    }
    return (
      <React.Fragment>
        <div className="center-detail-wrapper edit-village-waper">
          <Spin spinning={loading} style={{ position: 'fixed', top: '40%', left: '50%' }} />
          <div className="villageTitle">{unescape(params.name)}</div>
          <Tabs
            defaultActiveKey={params.type}
          >
            {
              childConfigs.map((v, i) => (
                <TabPane
                  key={v.id}
                  disabled={disabled}
                  tab={v.title}
                >
                  {status[i] ?
                    <v.editComponent
                      ocId={params.id}
                      type={i}
                      changeModel={this.changeModel.bind(this, false, i)}
                    />
                    : <v.component
                      ocId={params.id}
                      changeModel={this.changeModel.bind(this, true, i)}
                    />
                  }
                </TabPane>
              ))
            }
          </Tabs>
        </div>
      </React.Fragment>
    );
  }
}
