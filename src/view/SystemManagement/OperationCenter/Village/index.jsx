import React from 'react';
import { observer } from 'mobx-react';
import Table from './components/Table';
import IconFont from 'src/components/IconFont';
import { withRouter } from 'react-router-dom';
import { Button } from 'antd';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import { searchFormat } from '../../../../utils';
import './index.scss';

@withRouter
@BusinessProvider('OperationCenterDeviceVillageStore')
@observer
export default class RoleView extends React.Component {
  state = {
    loading: false,
    list: []
  };

  componentWillMount() {
    const { location } = this.props;
    let params = searchFormat(location.search);
    this.ocId = params.id;
    this.search();
  }

  /**搜索 */
  search = () => {
    const { OperationCenterDeviceVillageStore } = this.props;
    this.setState({
      loading: true
    });
    OperationCenterDeviceVillageStore.getList(this.ocId).then(res => {
      this.setState({
        list: res.result.assigned,
        loading: false
      })
    });
  };

  render() {
    const { changeModel } = this.props;

    const { list, loading } = this.state;
    return (
      <React.Fragment>
        <div className="optCenter-add-contianer">
          <div className='operation-center-nav'>
            <Button
              onClick={changeModel}
            >
              <IconFont type='icon-Edit_Main' />
              编辑
            </Button>
					</div>
          <div className="optCenter-wrapper">
            <Table
              key="has-device-list"
              dataSource={list}
              loading={loading}
              onChange={this.onChange}
              updateDeviceOcId={this.updateDeviceOcId}
              scroll={{ y: '100%' }}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}
