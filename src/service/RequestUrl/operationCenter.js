import { Config } from '../Config';
const { api } = Config;

export default {
  LIST: {
    value: `${api}optCenter/list`,
    label: '列表查询'
  },
  ADD : {
    value: `${api}optCenter/add`,
    label: '新建运营中心'
  },
  DETAIL : {
    value: `${api}optCenter/detail`,
    label: '查看详情'
  },
  DEL : {
    value:  `${api}optCenter/del`,
    label: '删除运营中心'
  },
  UPDATE : {
    value: `${api}optCenter/update`,
    label: '编辑运营中心'
  },
  BYLOGINKEYURL : {
    value: `${api}optCenter/getOptByLoginKeyUrl`,
    label: '获取合作单位和系统logo'
  }
}
