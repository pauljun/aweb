import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import {BusinessProvider}from 'src/utils/Decorator/BusinessProvider'
import { stopPropagation as Util_stopPropagation } from 'src/utils';
import { message, Tabs, Drawer } from 'antd';
import PlayComponent from '../BusinessComponent/PlayComponent';
import PictureComponent from 'src/components/pictureCanvas';
import ModalComponent from 'src/components/ModalComponent';
import IconSpan from 'src/components/IconSpan'
import CollapseList from "./components/CollapseList";
import DownloadVideo from 'src/utils/DownloadVideo';
import AuthComponent from 'src/view/BusinessComponent/AuthComponent';

import './index.scss';

const TabPane = Tabs.TabPane;
const mediaTabs = [
  {
    title: '全部',
    value: 'all'
  },
  {
    title: '图片',
    value: 'image'
  },
  {
    title: '视频',
    value: 'video'
  }
]

/* 
  视图库列表
*/
@withRouter
@BusinessProvider('MediaLibStore', 'UserStore', 'DeviceStore')
@observer
class MediaLibView extends Component {

  state = {
    isEdit: false,// 批量编辑状态,
    visible: false, // 预览弹窗
    modalContent: {},
  };

  // 切换视图库显示状态
  toggleHidden = () => {
    this.setState({
      isEdit: !this.state.isEdit,
    })
  }

  // 单个删除
  handleDeleteOne = (item) => {
    // message.success(`删除${item.type === 'image' ? '图片' : '视频'}成功`);
    this.props.MediaLibStore.deleteBatch([item])
  }

  // 单个下载
  handleDownloadOne = (item) => {
    this.props.MediaLibStore.downloadBatch([item])
  }

  // 摄像头选中
  handleCheckCamera = (e, cameraId, idx) => {
    // 阻止事件冒泡
    Util_stopPropagation(e);
    const { MediaLibStore } = this.props;
    const checked = e.target.checked;
    MediaLibStore.handleCheckCamera(cameraId, checked, idx);
  }

  // 单个选中
  handleCheckItem = (checkList, cameraId) => {
    this.props.MediaLibStore.handleCheckItem(checkList, cameraId);
  }

  // 批量删除
  deleteBatch = () => {
    const { MediaLibStore } = this.props;
    const selectList = MediaLibStore.getSelectList();
    MediaLibStore.deleteBatch(selectList);
  }

  // 批量下载  
  downloadBatch = () => {
    const { MediaLibStore } = this.props;
    const selectList = MediaLibStore.getSelectList()
    MediaLibStore.downloadBatch(selectList);
  }

  // 播放历史视频
  handleVideoPlay = (item) => {
    console.log(item, 93)
    const { DeviceStore } = this.props;
    const cameraInfo = DeviceStore.queryCameraById(item.cameraId);
    const option = {
      cameraId: item.cameraId,
      startTime: new Date(item.startTime)*1 / 1000,
      endTime: new Date(item.endTime)*1 / 1000
    };
    DeviceStore.asyncGetHistoryVideo(option).then((historyList) => {
      if(!historyList.fragments.length) {
        return message.warn('未获取到视频！')
      }
			const fileData = Object.assign({}, cameraInfo, {
        isLiving: false,
				historyList,
        timeRange: {
          startTime: option.startTime*1000,
          endTime: option.endTime*1000
        }
			});
      this.setState({
        visible: true,
        modalContent: {
          title: '视频查看',
          fileData,
        }
      })
		});
  }

  // 图片预览
  handleImageView = (item) => {
    console.log(item.imgUrl)
    this.setState({
      visible: true,
      modalContent: {
        item,
        title: '图片预览',
        previewUrl: item.imgUrl
      }
    })
  }

  // 切换视图库tab标签
  changeTab = (activeTab) => {
    // 1. 切换激活的tab,清空选中列表
    const { MediaLibStore } = this.props;
    MediaLibStore.setData({
      activeTab,
      selectList: []
    })
    // 2. 清空mediaList每一项的checkedList
    MediaLibStore.handleCheckAll(activeTab);
  }

  // 取消图片预览
  handleCancel = () => {
    this.setState({
      visible: false,
      modalContent: {}
    })
  }

  componentDidMount(){
    const { UserStore, MediaLibStore } = this.props;
    MediaLibStore.setData({
      userId: UserStore.userInfo.id
    })
    MediaLibStore.getMediaList();
  }

  render() {
    const { MediaLibStore, isVisible, hideMediaLib } = this.props;
    const { isEdit, visible, modalContent:{title, item, fileData, previewUrl} } = this.state;
    return (
      <Drawer
        className='media-lib-drawer-wrapper'
        placement="right"
        closable={false}
        width={300}
        onClose={hideMediaLib}
        visible={isVisible}
      >
        <div className='media-lib-module-wrapper'>
          <div className='media-lib-header'>
            <span className='title'>我的视图</span>
            <IconSpan
              className='close-btn'
              icon='icon-Close_Main'
              title='关闭'
              mode='horizontal'
              onClick={hideMediaLib}
            />
            <IconSpan
              mode='horizontal'
              className='edit-btn'
              onClick={this.toggleHidden}
              icon={isEdit ? 'icon-Delete_Light' : 'icon-Edit_Main'}
              label={isEdit ? '取消编辑' : '编辑'}
            />
          </div>
          <div className='media-lib-content'>
            <Tabs
              className='media-lib-tab'
              hideAdd={true}
              animated={true}
              activeTab={MediaLibStore.activeTab}
              onChange={this.changeTab}
            >
              {mediaTabs.map(v => {
                let dataType = v.value
                let collapseData = MediaLibStore.getTabMediaList(dataType);
                return (
                  <TabPane
                    key={dataType}
                    tab={<span>{v.title}</span>}
                  >
                    <CollapseList
                      collapseData={collapseData}
                      editStatus={!isEdit}
                      onCheckCamera={this.handleCheckCamera}
                      onCheckItem={this.handleCheckItem}
                      onDeleteOne={this.handleDeleteOne}
                      onDownloadOne={this.handleDownloadOne}
                      onVideoPlay={this.handleVideoPlay}
                      onImageView={this.handleImageView}
                    />
                  </TabPane>
                )
              })}
            </Tabs>
          </div>
          {isEdit && (
            <div className='media-lib-footer'>
              {MediaLibStore.activeTab !== 'all' && (
                <AuthComponent actionName={MediaLibStore.activeTab === 'image' ? 'BaselibImgDownload' : 'DownloadVideo'}>
                  <IconSpan
                    className='download-btn'
                    mode='horizontal'
                    icon="icon-Download_Main"
                    onClick={this.downloadBatch}
                    label={'下载'}
                  />
                </AuthComponent>
              )}
              <IconSpan
                className='delete-btn'
                mode='horizontal'
                icon="icon-Delete_Main"
                onClick={this.deleteBatch}
                label={'删除'}
              />
            </div>
          )}
          <ModalComponent
            className='media-lib-modal'
            visible={visible} 
            title={title}
            footer={null}
            onCancel={this.handleCancel} 
            >
            { !!previewUrl && (
              <PictureComponent
                name={item.cameraName}
                imgUrl={previewUrl}
                data={item}
                operations={{
                  download:true
                }}
              />
            )}
            { fileData && (
              <PlayComponent
                isLiving={false}
                hasLiving={false}
                fileData={fileData} 
                method={{
                  downloadVideo: options => DownloadVideo({ fileData, ...options })
                }}
              />
            )}
          </ModalComponent>
        </div>
      </Drawer>
    )
  }
}

export default MediaLibView;