import { observable, action } from 'mobx';
import LibsService from '../../../service/PersonnelControlService/LibService';
let orgUserList = []

/**获取平级数据 */
const flatten = item => {
  item.map(itm => {
    orgUserList.push({
      title: itm.title,
      key: `${itm.type}-${itm.key}`,
      type: itm.type
    })
    if (itm.children) {
      flatten(itm.children)
    }
  })
} 

const initSearch = {
	name: '',
	creatorName: '',
	startTime: '',
	endTime: '',
	page: 1,
  pageSize: 500,
  libType: 1,
} 

class MoniteeLibs {
  @observable searchData = initSearch

  // 初始化查询条件
  initData(searchData={}){
    searchData = Object.assign({}, initSearch, searchData)
    return this.setData({ searchData })
	}

  // 编辑查询条件
  editSearchData(options) {
    const searchData = Object.assign({}, this.searchData, options)
    return this.setData({ searchData }) 
  }

  /**获取布控库列表-新建布控任务时使用 */
  getList(libType = undefined) {
    let params = Object.assign({}, this.searchData, { libType })
    //params.libType = libType
    return LibsService.getList(params).then(res => {
      return res.result.resultList
    })
  }
  /**获取实时警情列表 */
  getRealList(option) {
    return LibsService.getList(option).then(res => {
      return res.result.resultList
    })
  }
  /**获取组织与人员树形 */
  getOrgUsersList() {
    return LibsService.getOrgUsersList().then(data => {
      orgUserList = []
      flatten(data.result)
      return {
        formTreeData: data.result,
        orgUserList: orgUserList
			}
    })
	}
	
	/**根据搜索条件获取布控库 */
  getLibList(libId, currLibId=null) {
    return LibsService.getLibList(this.searchData).then(async result => {
      if(!result){
        return false
      }
      const libList = result.resultList || result.list || []; // 布控库列表
      let libInfo={};
      if(libList.length){ 
        // libId不存在或libId===当前libId时取列表第一个
        const newLibId = (!libId || libId === currLibId) ? libList[0].id : libId
        if(result.list){ // 一体机
          libInfo = await this.getMachineDetail(newLibId)
        }else{
          console.log(newLibId, 84)
          libInfo = await this.getLibDetail(newLibId)
        }
      } 
      return {
        libList,
        libInfo
      }
    })
	}
	/**搜索一体机 */
  getMachines(data) {
    return LibsService.getMachines(data).then(result => {
      if(!result){
        return false
      }
      const machines = result.resultList || result.list || [];
      //this.setData(storeId, { machines })
      return machines
    })
	}
	/**获取一体机布控库 */
  getMachineLibs(data) {
    return LibsService.getMachineLibs(data).then(result => {
      if(!result){
        return false
      }
      const machineLibs = result.resultList || result.list || [];
      return machineLibs
    })
	}
	/**根据id获取布控库详情 */
  getLibDetail(id){
    return LibsService.getLibDetail(id).then(libDetail => {
      const libInfo = {
        libDetail: {},
        currLibId: id
      }
      if(libDetail){
        libDetail.objectMainList.map(v => {
          v.infoList = libDetail.objectInfoList.filter(x => x.objectId === v.id);
          v.errPicCount = v.infoList.filter(x => x.saveStatus !== 0).length;
        })
        libInfo.libDetail = libDetail;
      }
      return libInfo
    })
	}
	/**根据一体机布控库id获取布控库详情 */
  getMachineDetail(id){
    return LibsService.getMachineDetail(id).then(libDetail => {
      const libInfo = {
        libDetail: libDetail ? libDetail : {},
        currLibId: id
      }
      return libInfo
    })
	}
	// 根据id删除布控库
  deleteLib({id, updateList=true, libType, libName}){
    return LibsService.deleteLib({id, libType, libName }).then(result => {
      if(!result){
        return false
      }
      if(updateList){
        return this.getLibList(null);
      }
      return result
    })
	}
	// 新建或编辑布控库表单信息
  saveLib(options){
    return LibsService.saveLib(options).then(result => {
      if(!result){
        return false
      }
      return result
    })
  }
  // 一体机布控库导入 uploadMachineMonitorLibs
  uploadMachineMonitorLibs(options){
    return LibsService.uploadMachineMonitorLibs(options).then(result => {
      if(!result){
        return false
      }
      return result
    })
  }
	// 编辑一体机信息
  saveMachineLib(options){
    return LibsService.editMachineInfo({
      id: options.id,
      describe: options.describe
    })
	}
	// 保存文件路径到后台
  saveMachineExcel(options){
    return LibsService.saveMachineExcel(options).then(res => {
      // if(res.code === 200){
      //   this.getLibList(null)
      // }
    })
  }
  //  saveMachineExcel(filePath){
  //   return LibsService.saveMachineExcel({filePath}).then(res => {
  //     if(res.code === 200){
  //       this.getLibList(null)
  //       message.success('导入成功！')
  //     }
  //   })
  // }
  
  @action
  setData(json) {
    for (var k in json) {
      this[k] = json[k]
    }
    return Promise.resolve()
  }
}
export default new MoniteeLibs();