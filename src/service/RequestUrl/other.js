import { Config } from '../Config';
export default {
  otherModule: {
    code: 107400,
    text: '资源下载'
  },
  downloadImg: {
    code: 107401,
    parent:107400 ,
    text: '下载图片'
  },
  downloadVideo: {
    code: 107402,
    parent:107400 ,
    text: '下载视频'
  },
  // videoView: {
  //   code: 107403,
  //   parent:107400 ,
  //   text: '查看视频'
  // },
  // videoScreenCapture: {
  //   code: 107404,
  //   parent:107400 ,
  //   text: '视频截图'
  // },
  UPLOAD: {
    value: `${Config.api}upload`,
    label: '上传图片'
  }
};
