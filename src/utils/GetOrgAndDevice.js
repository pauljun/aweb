import CatchPromise from './CatchPromise';
import { cloneDeep } from 'lodash';
import JurService from '../service/JurService';
import { qj, znxj, zpj, db } from '../libs/DeviceLib';
export default function GetOrgAndDevice() {
  const { DeviceStore, OrgStore } = window.GlobalStore;
  return Promise.all([
    CatchPromise(DeviceStore.getCameraList({ page: 1, pageSize: 100000 })),
    CatchPromise(OrgStore.getOrgList()),
    CatchPromise(
      JurService.getDeviceCount({
        deviceTypes: [+qj.value, +znxj.value, +zpj.value, +db.value]
      })
    ),
    CatchPromise(
      JurService.getDeviceCount({
        deviceTypes: [+qj.value, +znxj.value, +zpj.value]
      })
    )
  ]).then(res => {
    let orgArray = cloneDeep(OrgStore.orgArray);
    if (res[2] && Array.isArray(res[2].result)) {
      let list = res[2].result;
      for (let ii = 0, ll = orgArray.length; ii < ll; ii++) {
        let item = orgArray[ii];
        let ids = OrgStore.queryOrgIdsForParentOrgId(item.id);
        let orgs = list.filter(v => ids.indexOf(v.organizationId) > -1);
        let deviceCount = { count: 0, onlineCount: 0 };
        for (let i = 0, l = orgs.length; i < l; i++) {
          deviceCount.count += orgs[i].totalCount;
          deviceCount.onlineCount += orgs[i].onlineCount;
        }
        item.deviceCount = deviceCount;
      }
    }

    if (res[3] && Array.isArray(res[3].result)) {
      let list = res[3].result;
      for (let ii = 0, ll = orgArray.length; ii < ll; ii++) {
        let item = orgArray[ii];
        let ids = OrgStore.queryOrgIdsForParentOrgId(item.id);
        let orgs = list.filter(v => ids.indexOf(v.organizationId) > -1);
        let cameraCount = { count: 0, onlineCount: 0 };
        for (let i = 0, l = orgs.length; i < l; i++) {
          cameraCount.count += orgs[i].totalCount;
          cameraCount.onlineCount += orgs[i].onlineCount;
        }

        item.cameraCount = cameraCount;
      }
      OrgStore.setOrgList(orgArray);
    }
  });
}
