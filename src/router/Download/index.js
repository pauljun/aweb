export default [
  {
    id: '100001010082',
    name: 'download',
    isAction: true
  },
  {
    id: '100001000240',
    title: '下载图片',
    parentId: '100001010082',
    name: 'BaselibImgDownload',
    isLocal: false,
    isAction: true
  },
  {
    id: '100001000076',
    title: '视频下载',
    name: 'DownloadVideo',
    isLocal: false,
    isAction: true,
    parentId: '100001010082'
  }
];
