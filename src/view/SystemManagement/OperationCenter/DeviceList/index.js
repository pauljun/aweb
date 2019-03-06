import React from 'react';
import { observer } from 'mobx-react';
import Title from '../../components/Title';
//import Search from './components/Search';
import SearchInput from 'src/components/SearchInput';
import Table from './components/Table';
import { Modal, message, Button } from 'antd';
import IconFont from 'src/components/IconFont';
import { withRouter } from 'react-router-dom';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import { searchFormat } from '../../../../utils';
import OptCenterMap from '../../../BusinessComponent/CommunityMap';
import './index.scss';
import { CommunityDeviceType } from 'src/libs/DeviceLib';
import _ from 'lodash';
const deviceTypes = _.flattenDeep(
  CommunityDeviceType.filter(v => v.value && v.value !== '-1').map(v =>
    v.value.split(',')
  )
);
@withRouter
@BusinessProvider('OperationCenterDeviceListStore', 'TabStore', 'DeviceManagementStore','OperationCenterDeviceSollotStore','OperationCenterStore')
@observer
export default class RoleView extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      list: [],
      points:[],//所有已分配设备
      total: 10,
      loading: false,
      deviceGroup: [], // 设备分组(全部分组)
      type:1,
      data: {
        userInfo: {}
      }
    };
    this.communityRef = React.createRef();
    this.getDeviceList();
  }
  /*获取所有已分配设备展示在地图模式上 */
  getDeviceList() {
    const { OperationCenterDeviceSollotStore , ocId } = this.props;
    OperationCenterDeviceSollotStore.getList({
      operationCenterIds: [ocId],
      deviceTypes,
      pageSize: 100000,
      page: 1
    }).then(res => {
      this.setState({
        points: res.result.resultList,
      });
    });
	}
  componentWillMount() {
    const { location,OperationCenterStore,ocId } = this.props;
    let params = searchFormat(location.search);
    this.ocId = params.id;
    this.search();
    const { DeviceManagementStore } = this.props;

    OperationCenterStore.getDetail(ocId).then(data => {
      this.setState({ data });
    });
    /**获取羚羊云设备分组 */
    DeviceManagementStore.getLingyangOrgs().then(res => {
      this.setState({
        deviceGroup: res
      });
    });
  }

  /**跳转 */
  goPage(moduleName, childModuleName) {
    const { TabStore, history } = this.props;
    TabStore.goPage({
      moduleName,
      childModuleName,
      history,
      data: {
        id: this.ocId
      }
    });
  }

  /**搜索 */
  search = () => {
    const { OperationCenterDeviceListStore } = this.props;
    this.setState({
      loading: true
    });
    OperationCenterDeviceListStore.getList(this.ocId).then(res => {
      this.setState({
        total: res.result.resultSize,
        loading: false,
        list: res.result.resultList
      });
    });
  };

  /**修改查询条件 */
  editSearchData = options => {
    const { OperationCenterDeviceListStore } = this.props;
    OperationCenterDeviceListStore.mergeSearchData(options);
    this.search();
  };
  /**分页切换查询 */
  onChange = (page, pageSize) => {
    this.editSearchData({ page, pageSize });
  };

  updateDeviceOcId = id => {
    let self = this;
    Modal.confirm({
      title: '确定取消分配当前设备？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        const { OperationCenterDeviceListStore } = self.props;
        OperationCenterDeviceListStore.updateDeviceOcId({
          deviceIds: [id],
          fromOcId: self.ocId
        }).then(() => {
          self.search();
          message.success('操作成功！');
        });
      }
    });
  };
  changeType = type => {
    if (this.state.type !== type) {
      this.setState({ type });
    }
  };

  render() {
    const { OperationCenterDeviceListStore, changeModel } = this.props;
    const { searchData } = OperationCenterDeviceListStore;
    const { list, total, loading, deviceGroup ,type,points,data} = this.state;
    return (
      <React.Fragment>
        <div className="optCenter-add-contianer map-expand">
        <div className="change_type">
          <Button
            className={`btn ${type === 1 && 'active'}`}
            onClick={this.changeType.bind(this, 1)}
          >
          <IconFont type="icon-List_Tree_Main" />
            列表模式
          </Button>
          <Button
            className={`btn ${type === 2 && 'active'}`}
            onClick={this.changeType.bind(this, 2)}
          >
          <IconFont type="icon-List_Map_Main" />
            地图模式
          </Button>
          <Button
            onClick={changeModel}
            className="opt-edit"
          >
            <IconFont type='icon-Edit_Main'/>
          </Button>
        </div>
        {
          type==1?(
            <div className="optCenter-wrapper">
              <Title key="title" name={''} className="optCenter-title">
                <div className='operation-center-nav'>
                  {/* <Search
                    searchData={searchData}
                    onChange={this.editSearchData}
                    goPage={this.goPage.bind(this)}
                  /> */}
                  <SearchInput 
                    placeholder="请输入您想搜索的设备名称"
                    onSearch={value =>
                      this.editSearchData({
                        deviceName: value,
                        page:1
                      })
                    }
                  />
                </div>
              </Title>
               <Table
                key="has-device-list"
                total={total}
                goPage={this.goPage.bind(this)}
                searchData={searchData}
                dataSource={list}
                loading={loading}
                onChange={this.onChange}
                updateDeviceOcId={this.updateDeviceOcId}
                scroll={{ y: 400 }}
                deviceGroup={deviceGroup}
              />
            </div>
           ):(
             <OptCenterMap points={points} showVideoView={false} ref={this.communityRef} changeZoom={true} zoomNum={data.zoomLevelCenter} className='optCenter-map'/>
            )
        }
        </div>
      </React.Fragment>
    );
  }
}

