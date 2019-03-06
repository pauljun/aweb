import lyService from 'src/service/lyService';
import { message } from 'antd';

export default async function({ startTime, endTime, fileData }) {
  startTime = startTime * 1;
  endTime = endTime * 1;
  const { manufacturerDeviceId, deviceName } = fileData;
  const timeList = lyService.timeCut({ startTime, endTime });
  const snapshots = await lyService.getDeviceSnapshots({
    cameraId: manufacturerDeviceId,
    begin: startTime,
    end: endTime
  });
  const snapshotsList = lyService.handleSnapshots(snapshots, timeList);
  const videoList = snapshotsList.map(v => handleMediaLibObj(v, fileData));

  if (videoList.length === 1) {
    window.GlobalStore.DeviceStore.asyncDownloadVideo({
      cameraId: manufacturerDeviceId,
      cameraName: deviceName,
      begin: startTime,
      end: endTime
    });
  }

  window.GlobalStore.MediaLibStore.addVideos(videoList).then(() => {
    let downloadTip =
      videoList.length > 1
        ? '视频文件较长，已分段加入我的视图，可前往下载'
        : '视频文件已加入我的视图';
    message.success(downloadTip);
  });
}

// 处理视图库参数 startTime： 毫秒
function handleMediaLibObj(snapItem, fileData) {
  const localVideoObj = {
    cameraId: fileData.manufacturerDeviceId,
    cameraName: fileData.deviceName,
    cameraType: fileData.deviceType,
    ptzType: fileData.ptzType,
    startTime: snapItem.startTime * 1000,
    endTime: snapItem.endTime * 1000,
    imgUrl: snapItem.imgUrl || '',
    type: 'video'
  };
  return localVideoObj;
}
