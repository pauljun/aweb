import { configure } from 'mobx';
import UserStore from './Base/User';
import LoggerStore from './Base/Logger';
import MenuStore from './Base/Menu';
import TabStore from './Base/Tab';
import DeviceStore from './Base/Device';
import ModuleStore from './Module';
import OrgStore from './Base/Org';
import UserGroupStore from './Base/UserGroup'
import MediaLibStore from './Base/MediaLib'

configure({ enforceActions: 'observed' });

class GlobalStore {
  UserStore = new UserStore();
  UserGroupStore = new UserGroupStore();
  MenuStore = new MenuStore();
  DeviceStore = new DeviceStore();
  OrgStore = new OrgStore();
  LoggerStore = new LoggerStore();
  TabStore = new TabStore({ MenuStore: this.MenuStore, ...ModuleStore });
  MediaLibStore = new MediaLibStore()
}

const Stores = new GlobalStore();

window.GlobalStore = Stores;

export default Stores;
