import { observable, action, computed, toJS } from 'mobx';
import { KV_STORE, OTHER } from 'src/service/RequestUrl';

import moment from 'moment';
import {
  uuid as Util_uuid,
  downloadLocalImage as Util_downloadLocalImage,
  escapeUrl as Util_escapeUrl
} from 'src/utils';
import lyService from 'src/service/lyService';
import KVService from 'src/service/KVService';
import { message } from 'antd';

const DATE_FORMAT = 'YYYY.MM.DD HH:mm:ss';
// 视图库数据格式
const mediaList = [
  {
    id: '5604342b-6a62-4f98-8716-372718801f9b',
    cameraId: '538378251',
    cameraName: '吧台区-15楼',
    cameraType: 100602,
    ptzType: 'gb',
    checkedList: [],
    video: [
      {
        id: '3a6ccc43-680e-439d-86d0-27f95936565c',
        cameraId: '538378251',
        cameraName: '吧台区-15楼',
        type: 'video',
        // "captureTime": "2018-07-30 14:37:24",
        startTime: '2018-07-31 13:47:57',
        endTime: '2018-07-31 14:47:57',
        imgUrl:
          'https://jxsr-oss1.antelopecloud.cn/files?obj_id=5b600730800040000420a6e2&access_token=2147500032_3356491776_1564554698_1449dc35e34ad1652fc7fe51a2bbc3ad'
      }
    ],
    image: []
  }
];

// 视图库（通行记录）
export default class MediaLibStore {
  kvStoreKey = 'PASS_RECORD';
  // 视图库数据源
  @observable
  mediaList = [];
  @observable
  activeTab = 'all'; // all、video、 image

  // 当前用户id
  @observable userId = '';

  // 全部的列表
  @computed
  get listAll() {
    let data = [];
    this.mediaList.map(v => {
      data.push({
        id: v.id,
        cameraId: v.cameraId,
        cameraName: v.cameraName,
        cameraType: v.cameraType,
        ptzType: v.ptzType,
        checkedList: v.checkedList,
        listData: [].concat(toJS(v.video) || [], toJS(v.image) || [])
      });
    });
    return data;
  }

  // 视频列表
  @computed
  get listVideo() {
    let data = [];
    this.mediaList.map(v => {
      if (v.video && v.video.length) {
        data.push({
          id: v.id,
          cameraId: v.cameraId,
          cameraName: v.cameraName,
          cameraType: v.cameraType,
          ptzType: v.ptzType,
          checkedList: v.checkedList,
          listData: v.video
        });
      }
    });
    return data;
  }

  // 图片列表
  @computed
  get listImage() {
    let data = [];
    this.mediaList.map(v => {
      if (v.image && v.image.length) {
        data.push({
          id: v.id,
          cameraId: v.cameraId,
          cameraName: v.cameraName,
          cameraType: v.cameraType,
          ptzType: v.ptzType,
          checkedList: v.checkedList,
          listData: v.image
        });
      }
    });
    return data;
  }

  // 获取远程视图库列表
  getMediaList() {
    return KVService.getKVStore(this.userId, this.kvStoreKey).then(result => {
      if (result) {
        const mediaList = this.formatUrl(result, false);
        this.setData({
          mediaList
        });
      } else {
        this.setData({
          mediaList: []
        });
      }
    });
  }

  // 更新远程kvStore视图库
  setRemoteMediaList(mediaList) {
    mediaList = this.filterMediaList(mediaList);
    mediaList = this.formatUrl(mediaList, true);
    return KVService.setKVStore(this.userId, this.kvStoreKey, mediaList).then(
      result => {
        if (!result) {
          message.error('');
          return false;
        }
        mediaList = this.formatUrl(mediaList, false);
        this.setData({ mediaList });
        return mediaList;
      }
    );
  }

  /**
   * 添加文件到视图库part-1
   * @param {*} options 
      String cameraId,
      String cameraType 预留摄像机类型
      String ptzType 云台类型
      String type 媒体类型video、image
      Number startTime 抓拍时间，type='image'时 毫秒级
      Number endTime 抓拍时间，type='image'时   毫秒级
      Number captureTime 抓拍时间，type='image'时 毫秒级
      tring imgUrl 图片地址或视频封面
  */
  add(options) {
    let {
      cameraId,
      cameraName,
      cameraType,
      ptzType,
      type = 'image',
      startTime,
      endTime,
      captureTime,
      imgUrl
    } = options;
    // 单个媒体信息对象
    const cameraInfo = window.GlobalStore.DeviceStore.queryCameraById(cameraId);
    cameraId = cameraInfo.manufacturerDeviceId;
    options.cameraId = cameraId;
    const item = {
      id: Util_uuid(),
      cameraId,
      cameraName,
      type,
      imgUrl
    };
    if (type === 'image') {
      item.captureTime = this.formatDate(captureTime);
    } else {
      item.startTime = this.formatDate(startTime);
      item.endTime = this.formatDate(endTime);
    }
    if (item.imgUrl.indexOf('data:image') >= 0) {
      // 图片地址为base64则先上传至羚羊再添加到mediaList
      const oldFile = this.base64ToBlob(item.imgUrl);
      return lyService
        .uploadImgToLy({ file: oldFile, cameraId })
        .then(({ file }) => {
          if (!file) {
            return false;
          }
          item.imgUrl = file.url;
          return item;
        })
        .then(item => {
          const mediaList = this.stageMediaList(options, item);
          this.saveAddLog(item);
          return this.setRemoteMediaList(mediaList);
        });
    } else {
      // 直接添加到mediaList
      const mediaList = this.stageMediaList(options, item);
      this.saveAddLog(item);
      return this.setRemoteMediaList(mediaList);
    }
  }

  // 批量添加视频分段
  addVideos(videoList) {
    let mediaList = Object.assign([], toJS(this.mediaList));
    videoList.map(v => {
      let item = {
        id: Util_uuid(),
        cameraId: v.cameraId,
        cameraName: v.cameraName,
        type: 'video',
        imgUrl: v.imgUrl,
        startTime: this.formatDate(v.startTime),
        endTime: this.formatDate(v.endTime)
      };
      this.saveAddLog(item)
      let options = Object.assign({}, v, { mediaList });
      mediaList = this.stageMediaList(options, item);
    });
    return this.setRemoteMediaList(mediaList);
  }

  // 暂存文件到视图库part-2
  stageMediaList({ cameraId, cameraName, cameraType, ptzType, type, mediaList }, item) {
    mediaList = mediaList ? mediaList : Object.assign([], toJS(this.mediaList));
    let { cameraItem, idx } = this.getCameraInfo(cameraId, mediaList);
    if (cameraItem) {
      mediaList[idx][type].unshift(item);
    } else {
      cameraItem = {
        id: Util_uuid(),
        cameraId,
        cameraName,
        cameraType, // 预留摄像机类型
        ptzType, // 云台类型
        checkedList: [],
        video: [],
        image: []
      };
      cameraItem[type].unshift(item);
      mediaList.unshift(cameraItem);
    }
    return mediaList;
  }

  // 批量删除
  deleteBatch(selectList) {
    // 从羚羊删除图片或视频
    // 截图需删除、收藏图片不能删除
    const mediaList = Object.assign([], toJS(this.mediaList));
    // let objIdList = []
    // https://jxsr-oss1.antelopecloud.cn/files2/538378367/5b5eee962017007f04200626?access_token=538378367_0_1564490780_44bed2f705513b3de71d2f7a767709aa&key=%2Fiermu%2Fai%2F137898526171_538378367_1532948118128_1532948118343654781.jpg
    // https://jxsr-oss1.antelopecloud.cn/files2/538378357/5b5eb1c42017007504206cf8?access_token=538378357_0_1564468541_0466d13ddd1c151cdefa8fb6cb342c88&key=/iermu/ai/137898514315_538378357_1532932548128_1532932548607154830.jpg
    // https://jxsr-oss1.antelopecloud.cn/files?obj_id=5b5fc1b8800040000420e668&access_token=2147500032_3356491776_1564536167_b35276764d62ba94e81ffabc10fe24ea
    selectList.map(v => {
      // let search = v.imgUrl.split('?')[1]; // 取?后的参数
      // if(search.lastIndexOf('.')>=0){
      //   // 去掉.jpg等后缀名
      //   search = search.substring(0,search.lastIndexOf('.'));
      // }
      // if(search.indexOf('obj_id')>=0){
      //   objIdList.push(search.split('obj_id=')[1].split('&')[0])
      // } else if(search.indexOf('key')>=0){
      //   objIdList.push(search.split('key=')[1].split('&')[0])
      // }
      const mediaInfo = mediaList.find(x => x.cameraId == v.cameraId);
      this.saveDeleteLog(v);
      const key = v.type;
      mediaInfo[key] = mediaInfo[key].filter(x => x.id !== v.id);
    });
    // console.log(objIdList,221)
    // lyService.deleteFileList(objIdList)
    return this.setRemoteMediaList(mediaList);
  }

  // 批量下载
  downloadBatch(selectList) {
    selectList.map(v => {
      if (v.type === 'image') {
        Util_downloadLocalImage(v.imgUrl, `${v.cameraName}_${moment(v.captureTime).format('YYYYMMDDTHHmmss')}`);
        GlobalStore.LoggerStore.save({
          ...OTHER.downloadImg,
          description: `下载点位【${v.cameraName}】 ${moment(v.captureTime).format('YYYY.MM.DD HH:mm:ss')}的图片`
        });
      } else {
        GlobalStore.DeviceStore.asyncDownloadVideo({
          cameraId: v.cameraId,
          cameraName: v.cameraName,
          begin: Math.floor(new Date(v.startTime) / 1000),
          end: Math.floor(new Date(v.endTime) / 1000)
        });
      }
    });
  }

  // 记录添加日志
  saveAddLog(item) {
    const description = (
      item.type === 'image' 
        ? `添加点位【${item.cameraName}】 ${item.captureTime}的图片`
        : `添加点位【${item.cameraName}】 ${item.startTime}到${item.endTime}的录像`
    )
    GlobalStore.LoggerStore.save({
      description,
      ...KV_STORE[item.type === 'image' ? 'addMediaLibImg' : 'addMediaLibVideo']
    });
  }

  // 记录删除日志
  saveDeleteLog(item) {
    const description = (
      item.type === 'image' 
        ? `移除点位【${item.cameraName}】 ${item.captureTime}的图片`
        : `移除点位【${item.cameraName}】 ${item.startTime}到${item.endTime}的录像`
    )
    GlobalStore.LoggerStore.save({
      description,
      ...KV_STORE[item.type === 'image' ? 'deleteMediaLibImg' : 'deleteMediaLibVideo']
    });
  }

  // 所有摄像机的全选或全不选
  @action
  handleCheckAll(dataType, checked = false) {
    if (!checked) {
      this.mediaList.map(v => {
        v.checkedList = [];
      });
      return;
    }
    this.mediaList.map((v, k) => {
      let currentListData = this.getTabMediaList(dataType)[k].listData;
      v.checkedList = currentListData.map(v => v.id);
    });
  }

  // 单个摄像机全选或全不选
  @action
  handleCheckCamera(cameraId, checked, idx) {
    const { cameraItem } = this.getCameraInfo(cameraId);
    if (!checked) {
      return (cameraItem.checkedList = []);
    }
    const currentListData = this.getTabMediaList(this.activeTab)[idx].listData;
    cameraItem.checkedList = currentListData.map(v => v.id);
  }

  // 单个视频或图片的选中
  @action
  handleCheckItem(checkList, cameraId) {
    const { cameraItem } = this.getCameraInfo(cameraId);
    cameraItem.checkedList = checkList;
  }

  // 获取选中列表
  getSelectList() {
    const mediaList = this.getTabMediaList(this.activeTab);
    let selectList = [];
    mediaList.map(v => {
      if (v.checkedList.length) {
        v.listData.map(item => {
          if (v.checkedList.indexOf(item.id) !== -1) {
            selectList.push(item);
          }
        });
      }
    });
    return selectList;
  }

  @action
  setData(data) {
    for (var k in data) {
      this[k] = data[k];
    }
    return Promise.resolve();
  }

  // 字符串时间和时间戳互相转换
  formatDate(date) {
    return moment(date).format(DATE_FORMAT);
  }
  // 获取单个camera详情和索引
  getCameraInfo(cameraId, mediaList) {
    let idx, cameraItem;
    mediaList = mediaList ? mediaList : this.mediaList;
    mediaList.find((v, k) => {
      if (v.cameraId == cameraId) {
        idx = k;
        cameraItem = v;
        return v;
      }
    });
    return {
      idx,
      cameraItem
    };
  }

  // 获取指定tab的列表数据
  getTabMediaList(dataType) {
    let mediaList;
    switch (dataType) {
      case 'image':
        mediaList = this.listImage;
        break;
      case 'video':
        mediaList = this.listVideo;
        break;
      default:
        mediaList = this.listAll;
        break;
    }
    return mediaList;
  }

  // 编码解码图片路径
  formatUrl(mediaList, isEscape) {
    mediaList.map(v => {
      v.image.map(x => (x.imgUrl = Util_escapeUrl(x.imgUrl, isEscape)));
      v.video.map(x => (x.imgUrl = Util_escapeUrl(x.imgUrl, isEscape)));
    });
    return mediaList;
  }

  // 图片base64转换为blob
  base64ToBlob(base64Url) {
    var bytes = window.atob(base64Url.split(',')[1]); // 去掉url的头，并转换为byte
    //处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/png' });
  }

  // 保存视图库到缓存(预留)
  setLocal() {
    const mediaList = toJS(this.mediaList);
    // const cacheKey = `mediaList_${this.userId}`;
    const cacheKey = `mediaList`;
    localStorage.setItem(cacheKey, JSON.stringify(mediaList));
  }

  // 对mediaList进行过滤，只保留有图片或视频的数据(预留)
  filterMediaList(mediaList) {
    mediaList = mediaList ? mediaList : this.mediaList;
    const data = mediaList.filter(
      v => v.image.length > 0 || v.video.length > 0
    );
    return data;
  }
}
