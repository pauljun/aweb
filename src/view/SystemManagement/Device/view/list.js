import React from 'react';
import { observer } from 'mobx-react';
import Container from '../../components/Container';
import Table from '../components/Table';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import GetOrgAndDevice from '../../../../utils/GetOrgAndDevice'
import Breadcrumb from '../../components/Breadcrumb';
import { Form, Input, Select, Radio, Button, message } from 'antd';
import IconFont from '../../../../components/IconFont';
import ModalOrgSelect from '../../../BusinessComponent/ModalOrgSelect';
import ModalMapPointLabel from '../../../BusinessComponent/MapPointLabel/ModalMapPointLabel';
import LogsComponent from 'src/components/LogsComponent';

import {
  DeviceState,
  DeviceAndMjType,
  DeviceLocation
} from '../../../../libs/DeviceLib';
import AuthComponent from '../../../BusinessComponent/AuthComponent';
import Socket from '../../../../libs/Socket';
import { cloneDeep } from 'lodash';

import '../style/list.scss';

const DeviceType = DeviceAndMjType;

const Option = Select.Option;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

@LogsComponent()
@BusinessProvider(
  'OrgStore',
  'DeviceManagementStore',
  'UserStore',
  'DeviceStore'
)
@observer
@Form.create({
  onFieldsChange: (props, files) => {
    const { DeviceManagementStore } = props;
    let data = {};
    Object.keys(files).map(key => {
      data[key] = files[key].value;
    });
    DeviceManagementStore.mergeSearchData(data);
  }
})
export default class DeviceListView extends React.Component {
  state = {
    list: [],
    loading: false,
    deviceGroup: [],
    selectedRowKeys: [],
    showOrgModal: false,
    showMapModal: false,
    changeDevices: [],
    autoExpandParent:true,
    expandedKeys:[],
  };

  componentWillMount() {
    const { DeviceManagementStore } = this.props;
    Socket.on('deviceEdit', this.subDeviceEdit);
    /**获取羚羊云设备分组 */
    DeviceManagementStore.getLingyangOrgs().then(res => {
      this.setState({
        deviceGroup: res
      });
    });
    this.expandKeys()
  }
  componentWillUnmount() {
    Socket.off('deviceEdit', this.subDeviceEdit);
  }

  subDeviceEdit = () => {
    this.getDeviceList();
  };

  /**
   * 选中树操作
   */
  leafClk(key) {
    const { DeviceManagementStore } = this.props;
    DeviceManagementStore.setData({
      activeKey: key
    });
    this.getDeviceList();
  }

  /**
   * 打开分配modal 设置分配的设备id
   */
  showOrgAction = ids => {
    this.setState({
      changeDevices: ids,
      showOrgModal: true
    });
  };

  /**
   * 关闭分配modal 清空分配的设备id
   */
  closeOrgAction = () => {
    this.setState({
      changeDevices: [],
      showOrgModal: false
    });
  };

  /**
   * 打开点位设置
   */
  showMapAction = points => {
    this.setState({
      changeDevices: cloneDeep(points),
      showMapModal: true
    });
  };

  /**
   * 关闭分配modal 清空分配的设备id
   */
  closeMapAction = () => {
    this.setState({
      changeDevices: [],
      showMapModal: false
    });
  };

  /**
   * 确认提交设备修改组织
   */
  submitChangeOrg = orgId => {
    const {
      DeviceManagementStore,
      UserStore,
      OrgStore,
      DeviceStore
    } = this.props;
    let { changeDevices } = this.state;
    let options = {
      deviceIds: changeDevices,
      toOrgId: orgId,
      ocId: UserStore.userInfo.optCenterId
    };
    if (changeDevices.length === 1) {
      let deviceItem = DeviceStore.queryCameraById(changeDevices[0]);
      let orgItem = OrgStore.orgList.filter(
        v => deviceItem.organizationIds.indexOf(v.id) > -1
      )[0];
      options.fromOrgId = orgItem.id;
      if (orgItem.id === orgId) {
        return message.warn('设备已经在当前组织下！');
      }
    }
    return DeviceManagementStore.updateDeviceOrg(options).then(() => {
      message.success('操作成功！');
      this.closeOrgAction()
      this.setState({ selectedRowKeys: [] });
      this.getDeviceList();
      GetOrgAndDevice()
    });
  };

  submitDevicePoint = info => {
    const { DeviceManagementStore } = this.props;
    DeviceManagementStore.updateDeviceGeo({
      address: info.address,
      name: info.name,
      deviceId: info.point.id,
      latitude: info.position[1],
      longitude: info.position[0]
    }).then(() => {
      this.getDeviceList();
      message.success('操作成功！');
    });
  };

  /**
   * 查询设备列表
   */
  getDeviceList = (options = { }) => {
    this.setState({ loading: true });
    const { DeviceManagementStore, OrgStore } = this.props;
    DeviceManagementStore.mergeSearchData(options);
    let searchData = DeviceManagementStore.searchData;
    let orgIds = [DeviceManagementStore.activeKey[0]];
    if (searchData.isHadChild) {
      orgIds = OrgStore.queryOrgIdsForParentOrgId(
        DeviceManagementStore.activeKey[0]
      );
    }
    DeviceManagementStore.getList(orgIds).then(res => {
      this.setState({
        list: res.result.resultList,
        total: res.result.resultSize,
        loading: false
      });
    });
  };

  /**分页切换查询 */
  onChange = (page, pageSize) => {
    this.getDeviceList({ page: page ? page : 1, pageSize });
  };

  /**
   * 重置表单
   */
  reset = () => {
    const { form, DeviceManagementStore } = this.props;
    DeviceManagementStore.initSearchForm();
    form.setFieldsValue({ ...DeviceManagementStore.searchData });
    this.getDeviceList();
  };

  /**
   * table 多选
   */
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  expandKeys = () => {
    const {OrgStore}=this.props
    const orgAll=OrgStore.orgAllList
    var expandkeys=[]
    orgAll.map(v => {
      if(v.children){
        expandkeys.push(v.id)
      }
    })
    this.setState({
      expandedKeys:expandkeys,
      autoExpandParent: false,
    })
  }
  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  render() {
    const { menuInfo, OrgStore, DeviceManagementStore, form } = this.props;
    let {
      list,
      total,
      loading,
      deviceGroup,
      selectedRowKeys,
      showOrgModal,
      showMapModal,
      changeDevices
    } = this.state;
    const { searchData } = DeviceManagementStore;
    const rowSelection = {
      columnWidth: 24,
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    return (
      <Container
        title={menuInfo.title}
        treeActiveKey={DeviceManagementStore.activeKey}
        leafClk={this.leafClk.bind(this)}
      >
        <Breadcrumb
          list={OrgStore.getParentOrgListByOrgId(
            DeviceManagementStore.activeKey[0]
          ).reverse()}
        />
        <div className="device-table-content">
          <div className="serach-form">
            <FormGroupLayout
              form={form}
              deviceGroup={deviceGroup}
              searchData={searchData}
            />
            <div className="form-btn-group">
              <Button onClick={this.reset}>重置</Button>
              <Button type="primary" onClick={() => this.getDeviceList({page:1})}>
                <IconFont type="icon-Search_Main" />
                查询
              </Button>
            </div>
          </div>
          <div className="action-group">
            <AuthComponent actionName="DeviceAssigned">
              <Button
                onClick={() => this.showOrgAction(selectedRowKeys)}
                disabled={selectedRowKeys.length === 0}
                className="orange-btn"
              >
                <IconFont type="icon-Export_Main" />
                批量分配
              </Button>
            </AuthComponent>
          </div>
          <Table
            rowSelection={rowSelection}
            key="device"
            total={total}
            searchData={searchData}
            dataSource={list}
            loading={loading}
            onChange={this.onChange}
            changeOrg={this.showOrgAction}
            changePoint={this.showMapAction}
            rowKey={'id'}
            scroll={{ y: '100%' }}
          />
        </div>
        <ModalOrgSelect
          title="设备分配"
          visible={showOrgModal}
          treeProps={{ treeData: OrgStore.orgAllList, onExpand:this.onExpand ,defaultExpandedKeys:this.state.expandedKeys,autoExpandParent:this.state.autoExpandParent}}
          expandKeys={this.expandKeys}
          onCancel={this.closeOrgAction}
          onOk={this.submitChangeOrg}
          className='modal-org-select-tl'
        />
        <ModalMapPointLabel
          title="点位设置"
          visible={showMapModal}
          point={changeDevices[0]}
          onCancel={this.closeMapAction}
          onOk={this.submitDevicePoint}
        />
      </Container>
    );
  }
}

class FormGroupLayout extends React.Component {
  componentDidMount() {
    const { form, searchData } = this.props;
    form.setFieldsValue({ ...searchData });
  }
  render() {
    const { form, deviceGroup } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="inline">
        <FormItem label="分组">
          {getFieldDecorator('lygroupId')(
            <Select placeholder="请选择分组">
              {deviceGroup.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="经纬度">
          {getFieldDecorator('hadLocation')(
            <Select placeholder="请选择是否设置经纬度">
              {DeviceLocation.map(item => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="状态">
          {getFieldDecorator('deviceData')(
            <Select placeholder="请选择状态">
              {DeviceState.map(item => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="类型">
          {getFieldDecorator('deviceTypes')(
            <Select placeholder="请选择类型">
              {DeviceType.map(item => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="名称">
          {getFieldDecorator('deviceName')(
            <Input placeholder="请输入设备名称" />
          )}
        </FormItem>
        <FormItem label="SN">
          {getFieldDecorator('sn')(<Input placeholder="请输入SN码" />)}
        </FormItem>
        <FormItem label="CID">
          {getFieldDecorator('manufacturerDeviceId')(
            <Input placeholder="请输入CID" />
          )}
        </FormItem>
        <FormItem label="包含子组织">
          {getFieldDecorator('isHadChild')(
            <RadioGroup>
              <Radio value={true}>包含</Radio>
              <Radio value={false}>不包含</Radio>
            </RadioGroup>
          )}
        </FormItem>
      </Form>
    );
  }
}
