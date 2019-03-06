import { Config } from '../Config';
const {api}=Config
export default {
 GETLOGSTATISTICS: {
    value:  `${api}statistics/getLogStatistics`,
    lable: '系统数据列表'
  },
 EXPORTSTATISTICSLOG: {
    value:  `${api}statistics/exportStatisticsLog`,
    lable: '导出'
  },
}