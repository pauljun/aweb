import { httpRequest } from '../utils/HttpUtil';

const URLS = {
  deleteFile: '<lyupload>fileinfo/delete?obj_id=<obj_id>&access_token=<token>',
  imgUpload:
    '<lyupload>upload2?size=<size>&access_token=<lyToken>&expiretype=<expiretype>',
  imgUrl: '<lyupload>files?obj_id=<obj_id>&access_token=<lyToken>',
  snapshots:
    '<lyapi>v2/snapshots/<cid>/timestamps?client_token=<deviceToken>&from=<begin>&to=<end>',
  deviceToken: `/api/device/token/getLyTokenByCameraId/`
};

@httpRequest
class LyService {
  /**
   * 从对象系统中删除对象数据
   *    obj_id和key填一个即可， 如果都填以obj_id为准
   * obj_id       对象唯一标识
   * key          文件唯一标识
   * access_token 用于权限验证的access_token
   */
  deleteFile(objId, type = 'obj_id') {
    const lyToken = window.GlobalStore.UserStore.lyToken;
    const lyupload = window.webConfig
      ? window.webConfig.uploadDomain
        ? window.webConfig.uploadDomain
        : 'https://jxsr-oss1.antelopecloud.cn/'
      : 'https://jxsr-oss1.antelopecloud.cn/';
    let url = URLS.deleteFile
      .replace('<lyupload>', lyupload)
      .replace('<obj_id>', objId)
      .replace('<token>', lyToken);
    if (type === 'key') {
      url = url.replace('obj_id', 'key');
    }
    return fetch(url)
      .then(response => response.json())
      .then(result => {
        console.log('羚羊存储删除成功', result);
        return result;
      })
      .catch(result => Promise.resolve(result));
  }

  // 批量删除
  deleteFileList(objIds) {
    return Promise.all(objIds.map(v => this.deleteFile(v)));
  }

  // 上传图片到羚羊
  // 上传添加key值：
  // key: userid/cid/20180101/uuid
  // key: userid/tmp/20180101/uuid
  /**
   *
   * @param {file} file input-file文件
   * @param {string} cameraId cid
   * @param {number} expiretype 保存时长 0: 永久存储，1: 七天
   */
  uploadImgToLy({ file, cameraId = 'temp', expiretype = 0 }) {
    const lyToken = window.GlobalStore.UserStore.lyToken;
    const lyupload = window.webConfig.uploadDomain;
    const uploadUrl = URLS.imgUpload
      .replace('<lyupload>', lyupload)
      .replace('<size>', file.size)
      .replace('<lyToken>', lyToken)
      .replace('<expiretype>', expiretype);
    const formData = new FormData();
    // const userId = globalStore.userModel.userInfo.id;
    // const date = moment().format('YYYYMMDD');
    // const uuid = util.uuid();
    // const key = `${userId}/${cameraId}/${date}/${uuid}`
    // formData.append('key', key)
    formData.append('file', file);
    return fetch(uploadUrl, {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(result => {
        if (!result.obj_id) {
          return {
            file: false,
            result
          };
        }
        const imgUrl = URLS.imgUrl
          .replace('<lyupload>', lyupload)
          .replace('<obj_id>', result.obj_id)
          .replace('<lyToken>', lyToken);
        file.url = imgUrl;
        return { file, result };
      })
      .catch(result => {
        return Promise.resolve({ file: false, result });
      });
  }

  // 批量上传图片到羚羊
  uploadImgListToLy({ fileList, expiretype = 0 }) {
    if (!fileList.length) {
      return Promise.reject();
    }
    return Promise.all(
      fileList.map(file => this.uploadImgToLy({ file, expiretype }))
    );
  }

  // 获取设备封面
  async getDeviceSnapshots({ cameraId, begin, end }) {
    const deviceToken = await this.getDeviceToken(cameraId);
    if (!deviceToken) {
      return false;
    }
    const lyapi = window.webConfig.domainLy;
    const uploadUrl = URLS.snapshots
      .replace('<lyapi>', lyapi)
      .replace('<cid>', cameraId)
      .replace('<deviceToken>', deviceToken)
      .replace('<begin>', begin)
      .replace('<end>', end);
    return fetch(uploadUrl)
      .then(response => response.json())
      .then(result => {
        if (!result.base_urls.length) {
          return false;
        }
        return result;
      });
  }

  // 将一段时间按cutStep分段 秒级
  timeCut = ({ startTime, endTime, cutStep = 1800 }) => {
    let timeList = [];
    // 以30分钟(1800s)切一个片段处理
    let begin = startTime;
    while (endTime - begin >= cutStep) {
      let end = begin + cutStep;
      timeList.push({
        startTime: begin,
        endTime: end
      });
      begin = end;
    }
    if (endTime > begin) {
      timeList.push({
        startTime: begin,
        endTime: endTime
      });
    }
    return timeList;
  };

  // 按时间段获取视频截图, 秒级
  handleSnapshots(snapshots, timeList) {
    let baseUrls, timestamps;
    if (snapshots) {
      baseUrls = snapshots.base_urls;
      timestamps = snapshots.timestamps;
    }
    timestamps &&
      timestamps.map(v => {
        v.list.map(t => {
          let item = timeList.find(x => x.startTime <= t && t < x.endTime);
          if (item) {
            item.imgUrl = baseUrls[v.base_url_index].trim() + t;
          }
        });
      });
    return timeList;
  }

  // 获取设备token
  getDeviceToken(cameraId) {
    return this.$httpRequest({
      url: URLS.deviceToken + cameraId
    }).then(result => result.result);
  }
}

export default new LyService();
