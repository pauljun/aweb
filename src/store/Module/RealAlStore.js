import { observable, action, computed, autorun, toJS, configure } from 'mobx';
import LibsService from '../../service/PersonnelControlService/AlarmService';
import RealAlarmService from '../../service/PersonnelControlService/RealAlarmService'
const options={
  page: 0,
  pageSize: 84,
  alarmOperationType: 2,
  sortType: 1,
  logTypes: '3'
}
const Imoptions={
  page: 0,
  pageSize: 80,
  alarmOperationType: 2,
  sortType: 1,
  logTypes: "1",
  threshold: '60.0'
}
const Iloptions={
  page: 0,
  pageSize: 80,
  alarmOperationType: 2,
  sortType: 1,
  logTypes: "2",
}
const Maoptions={
  page: 0,
  pageSize: 80,
  alarmOperationType: 2,
  sortType: 1,
  logTypes: "5",
  threshold: '60.0'
}
class RealAlStore {
  @observable optionPage=options;
  @observable ImoptionsPage=Imoptions;
  @observable IloptionsPage=Iloptions;
  @observable MaoptionsPage= Maoptions;
  /**
   * 布控库列表查询
   * @param {Object} option
   */
  getRealList(option) {
    return LibsService.getList(option).then(res => {
      return res.data?res.data:[];
    });
  }
  /**
   *七天报警数据查询
   * @param {Object} option
   */
  getSevenStatistics(option){
    return RealAlarmService.getSevenStatistic(option).then(res => {
      return res.result?res.result:[]
    })
  }
  getDataFromCount(){
    return RealAlarmService.getDataAllCount().then(res => {
      return res.result?res.result:[]
    })
  }
  /**
   *未处理，有效，无效报警查询
   * @param {Object} option
   */
  getTypeStaticCounts(option){
    return RealAlarmService.getTypeStaticCount(option).then(res => {
      return res.result?res.result:[]
    })
  }
}
 export default new RealAlStore();