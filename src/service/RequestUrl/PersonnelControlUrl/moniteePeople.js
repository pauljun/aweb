import { Config } from '../../Config';
export default {
  localList: {
    value: `${Config.api}alarm/selectObjectInfo`,
    label: '查询本地人员列表'
  },
  addPeople: {
    value: `${Config.api}alarm/saveObjectInfo`,
    label: '添加布控人员-停用',
  },
  editPeople: {
    value: `${Config.api}alarm/saveObjectInfo`,
    label: '修改布控人员信息',
    logInfo: [
      {
        type: 1,
        text: '编辑重点人员',
        code: 105009,
        parent: 105000
      },
      {
        type: 2,
        text: '编辑合规人员',
        code: 106006,
        parent: 106000
      },
    ]
  },
  delete: {
    value: `${Config.api}alarm/deleteObjectMain/<id>`,
    label: '删除布控人员-停用',
  },
  deleteBatch: {
    value: `${Config.api}alarm/deleteObjectMainBatch`,
    label: '批量删除人员',
    logInfo: [
      {
        type: 1,
        text: '移除重点人员',
        code: 105010,
        parent: 105000
      },
      {
        type: 2,
        text: '移除合规人员',
        code: 106003,
        parent: 106000
      },
    ]
  },
  deleteImage: {
    value: `${Config.api}alarm/deleteObjectInfo/<id>`,
    label: '删除图片'
  },
  addMultiUpLoad: {
    value: `${Config.api}alarm/batchImportObjectMainInfo`,
    label: '批量添加布控人员',
    logInfo: [
      {
        type: 1,
        text: '添加重点人员',
        code: 105008,
        parent: 105000
      },
      {
        type: 2,
        text: '添加合规人员',
        code: 106002,
        parent: 106000
      },
    ]
  }
}