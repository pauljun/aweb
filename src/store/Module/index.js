import Technology from './Technology';
import Monitee from './PersonnelControl/monitee';
import MoniteeTasks from './PersonnelControl/MoniteeTasks';
import MoniteeLibs from './PersonnelControl/MoniteeLibs';
import MoniteeAlarms from './PersonnelControl/MoniteeAlarms';
import MoniteePeople from './PersonnelControl/MoniteePeople';
import OrgManagementStore from './OrgManagement';
import UserManagementStore from './UserManagement';
import DeviceManagementStore from './DeviceManagement';
import DeviceEditStore from './DeviceEdit';
import faceStore from './baselib/face';
import wifiStore from './baselib/wifi';
import bodyStore from './baselib/body';
import vehicleStore from './baselib/vehicle';
import imgSearchStore from './baselib/search';
import SoldierStore from './Soldier';
import LogManagementStore from './Logmanagement';
import RoleManagementStore from './RoleManagement';
import JurisdictionOverview from './JurisdictionOverview';
import RealAlStore from './RealAlStore';
// import KvStore from './keyValue';
import VideoSurveillance from './VideoSurveillance';
import OperationCenterStore from './OperationCenter/index';
import OperationCenterDeviceListStore from './OperationCenter/deviceList';
import OperationCenterDeviceSollotStore from './OperationCenter/deviceSollot';
import OperationCenterDeviceVillageStore from './OperationCenter/deviceVillage';
import LongLivedStore from './Community/LongLivedStore'
import CenterVillageListStore from './CenterVillageList'
import StatisticStore from './statistic'
import CommunityDetailStore from './Community/communityDetail'
import CommunityEntryStore from './Community/communityEntry'
import VillageListStore from './VillageList'
import FloatPersonStore from './Community/FloatPersonStore'

class ModuleStore {
  TechnologyStore = Technology;
  // ---------  布控start  ---------
  MoniteeTasksStore = MoniteeTasks;
  MoniteeLibsStore = MoniteeLibs;
  MoniteeAlarmsStore = MoniteeAlarms;
  MoniteePeopleStore = MoniteePeople;
  MoniteeStore = Monitee;
  // ---------  布控end  ---------
  TechnologyStore = Technology;
  // ----- setting start-----
  OrgManagementStore = OrgManagementStore;
  UserManagementStore = UserManagementStore;
  JurisdictionOverviewStore = JurisdictionOverview;
  DeviceManagementStore = DeviceManagementStore;
  DeviceEditStore = DeviceEditStore;
  OperationCenterStore = OperationCenterStore;
  OperationCenterDeviceListStore = OperationCenterDeviceListStore;
  OperationCenterDeviceSollotStore = OperationCenterDeviceSollotStore;
  OperationCenterDeviceVillageStore = OperationCenterDeviceVillageStore;
  CenterVillageListStore = CenterVillageListStore
  StatisticStore = StatisticStore
  RoleManagementStore = RoleManagementStore;
  RealAlStore = RealAlStore;
  LongLivedStore=LongLivedStore;
  FloatPersonStore=FloatPersonStore;
  VillageListStore = VillageListStore;
  // ----- setting end -----
  // KvStore = KvStore
  // ----- baselib store start -----
  faceStore = faceStore;
  wifiStore = wifiStore
  bodyStore = bodyStore;
  vehicleStore = vehicleStore;
  imgSearchStore = imgSearchStore;
  // ----- baselib store  end -----
  SoldierStore = SoldierStore;

  VideoSurveillanceStore = VideoSurveillance;
  LogManagementStore = LogManagementStore;

  // ----- 社区管理 ----
  CommunityDetailStore = CommunityDetailStore;
  CommunityEntryStore = CommunityEntryStore;
}
const Stores = new ModuleStore();

window.ModuleStore = Stores;

export default Stores;
