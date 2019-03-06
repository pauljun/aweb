
import { Config } from '../Config';
const { api } = Config;

// key-value存储
export default {
  PANEL_CODE:{
    code: 107101,
    parent: 107100,
    text: '设置展示面板',
  },
  mediaLibModule: {
    text: '我的视图',
    code: 107300,
  },
  addMediaLibImg: {
    text: '添加图片',
    code: 107301,
    parent: 107300
  },
  addMediaLibVideo: {
    text: '添加视频',
    code: 107302,
    parent: 107300
  },
  deleteMediaLibImg: {
    text: '删除图片',
    code: 107303,
    parent: 107300
  },
  deleteMediaLibVideo: {
    text: '删除视频',
    code: 107304,
    parent: 107300
  },
  GET_DATA: {
    value: `${api}userKvStore/getUserKvStore`,
    label: '获取数据'
  },
  SET_DATA: {
    value: `${api}userKvStore/setUserKvStore`,
    label: '存储数据',
  },
  SET_DATA_NEW: {
    value: `${api}userKvStore/setUserKvStoreNew`,
    label: '存储数据-新接口-分组管理调用'
  }
};
