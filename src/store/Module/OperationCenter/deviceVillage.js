import Service from 'src/service/Community/VillageService';

class OperationCenterDeviceVillageStore {
  getList(id) {
    return Service.getVillagesByCenterId(id);
  }

  updateVillageToCenter(options){
    return Service.assignedByCenter(options)
  }
}

export default new OperationCenterDeviceVillageStore();
