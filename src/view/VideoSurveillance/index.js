import React from 'react';
import MapView from './view/map';
import { Button, message } from 'antd';
import { withRouter } from 'react-router-dom';
import IconFont from '../../components/IconFont';
import ListView from './view/list';
import ResourceTreeView from './components/ResouceTree';
import MapMarkerVideo from '../BusinessComponent/MapMarkerVideo';
import { observer } from 'mobx-react';
import { BusinessProvider } from '../../utils/Decorator/BusinessProvider';
import VideoLoopSetting from './components/VideoLoopSetting';
import videoScreen from '../../libs/Dictionary/videoScreen';
import GroupModal from './components/GroupModal';
import { exitFullscreen } from '../../utils/FullScreen';
import LogsComponent from '../../components/LogsComponent';
import { Provider } from './moduleContext';
import './style/index.scss';

@withRouter
@BusinessProvider(
  'OrgStore',
  'DeviceStore',
  'VideoSurveillanceStore',
  'UserGroupStore',
  'TabStore'
)
@LogsComponent()
@observer
export default class VideoSurveillance extends React.Component {
  constructor(props) {
    super(props);
    const { location } = this.props;
    this.videoLayoutDom = React.createRef()
    this.mapViewRef = React.createRef();
    this.listViewRef = React.createRef();
    this.slideDom = React.createRef();
    this.playerDatas = []; //当前播放的视频列表

    //TODO 轮巡相关
    this.loopList = []; //轮巡设备列表
    this.loopInterval = 1000; //轮巡间隔时间
    this.loopVideoBox = null; //可轮巡的播放容器配置
    this.loopListNumber = 1; //轮巡设备的页数
    this.loopTimer = null; //轮巡定时器
    this.loopOneListSize = 0; //每次轮巡的数量

    //TODO 获取页面参数
    let mapMode = true;
    if (location.state && location.state.pageState) {
      const { pageState = {} } = location.state;
      const { selectIds = [] } = pageState;
      let currentVideoScreen = videoScreen[1];
      if (selectIds.length > 4) {
        currentVideoScreen = videoScreen[2];
      }
      if (selectIds.length > 9) {
        currentVideoScreen = videoScreen[3];
      }
      if (currentVideoScreen !== videoScreen[1]) {
        this.selectSrceen(currentVideoScreen);
      }
      mapMode = !(pageState.mapMode === false);
    }

    this.state = {
      mapMode,
      isSlide: true,
      selectDevice: [],
      isLoop: false,
      showLoopSetting: false,
      loopOrgInfo: {},
      loopGroupName: null,
      showGroup: false,
      currentGroup: null,
      groupModalKey: Math.random(),
      loopModalKey: Math.random()
    };
  }

  componentDidMount() {
    const { DeviceStore, location } = this.props;
    if (location.state && location.state.pageState) {
      const { pageState = {} } = location.state;
      const { selectIds = [] } = pageState;
      const list = DeviceStore.queryCameraListByIds(selectIds);
      if (list.length > 0) {
        this.setState({ selectDevice: list }, () => {
          this.listViewRef.current.selectDevice(list);
        });
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.loopTime);
    setTimeout(() => {
      this.mapViewRef = null;
      this.listViewRef = null;
      this.slideDom = null;
      this.playerDatas = null;
      this.loopList = null;
      this.loopInterval = null;
      this.loopVideoBox = null;
      this.loopListNumber = null;
      this.loopTimer = null;
      this.loopOneListSize = null;
    }, 60);
  }

  /**
   * @desc Provider value
   */
  getModuleContext() {
    return {
      isMapMode: this.state.mapMode, //是否地图模式
      selectDevice: this.state.selectDevice, //选中的设备集合
      onSelectDevice: this.onSelectDevice, //选中设备后执行的逻辑
      setDeviceListForCurrentPlayerBox: this.setDeviceListForCurrentPlayerBox, //对比播放中的设备，匹配当前选中设备列表，去除无效的设备选中状态
      startVideoLoop: this.startVideoLoop, //
      endVideoLoop: this.endVideoLoop, //
      showLoopSettingLayout: this.showLoopSettingLayout, //
      closeLoopSettingLayout: this.closeLoopSettingLayout, //
      playBoxConfig: [], //对于轮巡的窗口配置
      isLoop: this.state.isLoop, //轮巡的状态
      loopOrgInfo: this.state.loopOrgInfo,
      loopGroupName: this.state.loopGroupName,
      deleteGroupDevice: this.deleteGroupDevice,
      addGroupDevice: this.addGroupDevice,
      showGroupModal: this.showGroupModal,
      goPage: this.goPage,
      deleteGroup: this.deleteGroup,
      videoLayoutDom:this.videoLayoutDom.current
    };
  }

  /**
   * 隐藏左侧树形控件
   */
  slideAction = () => {
    const { isSlide } = this.state;
    this.setState({ isSlide: !isSlide });
  };

  /**
   * @desc 显示轮巡的配置Modal 获取轮巡的摄像机列表
   * @param {object} item 组织信息
   * @param {boolean} isGroup 是否从分组过来
   */
  showLoopSettingLayout = (item, isGroup) => {
    const { isLoop } = this.state;
    if (isLoop) {
      return message.warn('当前正在执行轮巡任务！');
    }
    if (isGroup) {
      this.loopList = item.deviceList;
      this.setState({
        showLoopSetting: true,
        loopGroupName: item.groupName,
        loopModalKey: Math.random()
      });
    } else {
      const { DeviceStore } = this.props;
      this.loopList = DeviceStore.queryCameraByIncludeOrgId(item.id);
      this.setState({
        showLoopSetting: true,
        loopOrgInfo: item,
        loopModalKey: Math.random()
      });
    }
  };

  /**
   * @desc 关闭轮巡配置窗口
   */
  closeLoopSettingLayout = () => {
    this.setState(
      {
        showLoopSetting: false,
        loopOrgInfo: {},
        loopGroupName: null
      },
      () => {
        setTimeout(() => this.setState({ loopModalKey: Math.random() }), 500);
      }
    );
  };

  /**
   * @desc 开始轮巡
   */
  startVideoLoop = ({ loopInterval, loopScreen, loopVideoBox }) => {
    this.setState({ showLoopSetting: false });
    this.selectSrceen(loopScreen);
    this.loopInterval = loopInterval;
    this.loopVideoBox = loopVideoBox;
    this.loopListNumber = 1;
    this.loopOneListSize = this.loopVideoBox.filter(v => v.isLoop).length;
    this.listViewRef.current.setLoopVideBox(this.loopVideoBox);
    this.setState({ isLoop: true });
    this.setCurrentLoopList();
    this.loopTimer = setInterval(() => {
      this.loopListNumber++;
      Array.isArray(this.loopList) && this.setCurrentLoopList();
    }, this.loopInterval + 1000);
  };

  /**
   * @desc 设置当前需要轮巡的设备
   */
  setCurrentLoopList() {
    const { selectDevice } = this.state;
    let startIndex = (this.loopListNumber - 1) * this.loopOneListSize;
    if (this.loopList.length <= this.loopOneListSize) {
      this.loopListNumber = 0;
    } else {
      if (startIndex + this.loopOneListSize >= this.loopList.length) {
        startIndex = this.loopList.length - this.loopOneListSize;
        this.loopListNumber = 0;
      }
    }
    let list = this.loopList.slice(
      startIndex,
      startIndex + this.loopOneListSize
    );
    this.listViewRef.current.playMethodForLoopDevice(list);
    this.setState({ selectDevice: selectDevice.concat(list) });
  }

  /**
   * @desc 结束轮巡
   */
  endVideoLoop = () => {
    this.loopList = [];
    this.loopListNumber = 1;
    this.loopVideoBox.forEach(item => {
      item.isLoop = false;
    });
    this.listViewRef.current.setLoopVideBox(this.loopVideoBox);
    clearInterval(this.loopTimer);
    this.setState({
      isLoop: false,
      loopOrgInfo: {},
      loopGroupName: null
    });
    message.success('结束轮巡！');
  };

  /**
   * @desc 选中设备后，执行的逻辑
   * @param {Object<CameraDevice>} item
   */
  onSelectDevice = item => {
    const { mapMode } = this.state;
    if (mapMode) {
      //TODO 地图模式只能选中一个设备
      this.setState({ selectDevice: [item] });
      this.mapViewRef.current.wrappedInstance.markerClick(item);
    } else {
      //TODO 列表模式可选中多个设备
      const { selectDevice } = this.state;

      //TODO 当前设备已经在播放视频，不做任何操作
      const isPlaying = selectDevice.findIndex(v => v.id === item.id) > -1;
      if (isPlaying) {
        return false;
      }
      selectDevice.push(item);
      this.setState({ selectDevice });
      this.listViewRef.current.selectDevice([item]);
    }
  };

  /**
   * @desc 切换模式清空已选中的设备
   */
  changeModeBtn = () => {
    const { mapMode, isLoop } = this.state;
    exitFullscreen();
    if (isLoop) {
      this.endVideoLoop();
    }
    this.playerDatas = [];
    this.setState({
      mapMode: !mapMode,
      selectDevice: []
    });
  };

  /**
   * @desc 方法成功后，play容器返回，播放信息集合对比选中设备，删除无效选中的设备
   * @param {Object<CameraDevice & file | historyList>} playerDatas
   */
  setDeviceListForCurrentPlayerBox = playerDatas => {
    const { selectDevice } = this.state;
    this.playerDatas = playerDatas;

    //TODO 子组件反馈播放容器数据后，核对选中的设备
    let list = selectDevice
      .map(item => {
        const isHas =
          this.playerDatas
            .filter(v => !!v)
            .findIndex(
              v => v.id === item.manufacturerDeviceId || v.id === item.id
            ) > -1;
        return isHas ? item : null;
      })
      .filter(v => !!v);
    this.setState({ selectDevice: list, loopModalKey: Math.random() });
  };

  /**
   * @desc 切换屏幕数量
   * @param {Object<>} item
   */
  selectSrceen = item => {
    const { VideoSurveillanceStore } = this.props;
    VideoSurveillanceStore.setVideoScreen(item);
  };

  /**
   * @desc 关闭按钮后，清空选中的设备
   */
  clearSelectDevice = () => {
    this.playerDatas = [];
    this.setState({ selectDevice: [], loopModalKey: Math.random() });
  };

  /**
   * @desc 删除收藏下的设备
   * @param {Object} item
   */
  deleteGroupDevice = item => {
    const { UserGroupStore } = this.props;
    return UserGroupStore.edit(item);
  };

  /**
   * @desc 提供子组件新开页签的方法
   * @param {Object} options
   */
  goPage = options => {
    const { history, TabStore } = this.props;
    TabStore.goPage({
      history,
      ...options
    });
  };

  /**
   * @desc 新增收藏下的设备
   * @param {Object} item
   */
  addGroupDevice = items => {
    const { UserGroupStore } = this.props;
    return UserGroupStore.editDevice(items, true);
  };

  /**
   * @desc 打开分组弹窗
   * @param {boolean} isEdit
   * @param {Object} group
   */
  showGroupModal = (isEdit, group) => {
    this.setState({
      showGroup: true,
      currentGroup: isEdit ? group : null,
      groupModalKey: Math.random()
    });
  };

  /**
   * @desc 关闭分组弹窗
   */
  hideGroupModal = () => {
    this.setState({ showGroup: false });
  };

  /**
   * @desc 新增分组
   */
  addOrEditGroup = (isEdit, name, list, group) => {
    const { UserGroupStore } = this.props;
    let deviceIds = list.map(v => `${v.manufacturerDeviceId}/${v.deviceName}`);
    if (isEdit) {
      return UserGroupStore.editGroup(
        { groupName: group.groupName },
        { groupName: name, deviceIds }
      ).then(() => {
        this.hideGroupModal();
        message.success('操作成功！');
      });
    } else {
      return UserGroupStore.add({
        groupName: name,
        deviceIds
      }).then(() => {
        this.hideGroupModal();
        message.success('操作成功！');
      });
    }
  };
  cancelAddGroup = () => {
    this.setState({ showGroup: false });
  };

  /**
   * @desc 新增收藏下的设备
   * @param {String} name
   */
  deleteGroup = name => {
    const { UserGroupStore } = this.props;
    return UserGroupStore.delete({ groupName: name });
  };
  render() {
    const {
      VideoSurveillanceStore,
      DeviceStore,
      UserGroupStore,
      OrgStore
    } = this.props;
    const {
      isSlide,
      mapMode,
      showLoopSetting,
      showGroup,
      currentGroup,
      groupModalKey,
      loopModalKey
    } = this.state;
    return (
      <Provider value={this.getModuleContext()}>
        <div className="video-surveillance" ref={this.videoLayoutDom}>
          <div
            className={`left-tree ${isSlide ? 'left-tree-slide' : ''}`}
            ref={this.slideDom}
          >
            <div className="slide-layout-left-tree">
              <ResourceTreeView
                deviceList={DeviceStore.cameraArray}
                collectionList={UserGroupStore.list}
                orgList={OrgStore.orgArray}
              />
            </div>
            <span className="slider-btn" onClick={this.slideAction}>
              <IconFont
                type={
                  isSlide
                    ? 'icon-Arrow_Small_Left_Mai'
                    : 'icon-Arrow_Small_Right_Ma'
                }
                theme="outlined"
              />
            </span>
          </div>
          <div className="right-content">
            <Button
              type="primary"
              className="change-mode-btn orange-btn"
              onClick={this.changeModeBtn}
            >
              <IconFont
                type={mapMode ? 'icon-List_Map_Main' : 'icon-Map_Main'}
              />
              {mapMode ? '分屏模式' : '地图模式'}
            </Button>
            {mapMode ? (
              <MapMarkerVideo
                points={DeviceStore.cameraArray}
                ref={this.mapViewRef}
                logData={{ isOther: false }}
              >
                <MapView onSelectDevice={this.onSelectDevice} ProcessRef={this.videoLayoutDom} />
              </MapMarkerVideo>
            ) : (
              <ListView
                closeVideo={this.clearSelectDevice}
                asyncGetCurrentVideoList={DeviceStore.asyncGetCurrentVideoList}
                asyncGetHistoryVideo={DeviceStore.asyncGetHistoryVideo}
                ref={this.listViewRef}
                selectSrceen={this.selectSrceen}
                currentScreen={VideoSurveillanceStore.currentVideoScreen}
              />
            )}
          </div>
          <VideoLoopSetting
            playerDatas={this.playerDatas}
            startVideoLoop={this.startVideoLoop}
            closeLoopSettingLayout={this.closeLoopSettingLayout}
            showLoop={showLoopSetting}
            key={loopModalKey}
            currentScreen={VideoSurveillanceStore.currentVideoScreen}
            loopListSize={this.loopList.length}
          />
          <GroupModal
            onOk={this.addOrEditGroup}
            visible={showGroup}
            onCancel={this.hideGroupModal}
            key={groupModalKey}
            group={currentGroup}
          />
        </div>
      </Provider>
    );
  }
}
