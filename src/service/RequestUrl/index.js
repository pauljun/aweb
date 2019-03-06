import USER from './user';
import OTHER from './other';
import ORG from './org';
import DEVICE from './device';
import TASKS from './PersonnelControlUrl/tasks';
import LIBS from './PersonnelControlUrl/libs';
import ALARM from './PersonnelControlUrl/alarm';
import PEOPLE from './PersonnelControlUrl/moniteePeople';
import JUR from './Jur';
import BASELIB_URL from './baselib';
import KV_STORE from './kvStore';
import SOLDIER from './soldier';
import ROLE from './role';
import OPERATIONCENTER from './operationCenter';
import LOGGER from './logger';
import COMMUNITY from './community';
import VILLAGE from './village';
import STATISTIC from './statistic';
import _ from 'lodash';


export {
  USER,
  OTHER,
  DEVICE,
  ORG,
  TASKS,
  LIBS,
  ALARM,
  PEOPLE,
  BASELIB_URL,
  KV_STORE,
  SOLDIER,
  JUR,
  ROLE,
  OPERATIONCENTER,
  COMMUNITY,
  LOGGER,
  VILLAGE,
  STATISTIC
};

const request = {
  USER,
  OTHER,
  DEVICE,
  ORG,
  TASKS,
  LIBS,
  ALARM,
  PEOPLE,
  BASELIB_URL,
  KV_STORE,
  SOLDIER,
  JUR,
  ROLE,
  OPERATIONCENTER,
  COMMUNITY,
  LOGGER,
  VILLAGE,
  STATISTIC
};

export function getRequestInfoList() {
  let list = [];
  for (let k in request) {
    Object.keys(request[k]).map(k2 => {
      list.push(request[k][k2]);
    });
  }
  return list;
}

export function getLogInfoList() {
  let ServiceDict = [];
  getRequestInfoList().map(v => {
    if(v.code){
      ServiceDict.push(v)
    } else if(v.logInfo) {
      ServiceDict = ServiceDict.concat([], v.logInfo)
    }
  })
  ServiceDict = _.uniqBy(ServiceDict, 'code');
  return ServiceDict;
}