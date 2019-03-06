import { httpRequest } from '../utils/HttpUtil';
import { ROLE } from './RequestUrl';

@httpRequest
class ROLEService {
  getList(options) {
    return this.$httpRequest({
      url: ROLE.LIST.value,
      method: 'post',
      data: options,
    });
  }

  detail(options) {
    return this.$httpRequest({
      url: `${ROLE.DETAIL.value}?roleId=${options}`,
      method: 'get',
      logInfo:ROLE.DETAIL.logInfo[0]
    });
  }

  add(options) {
    let logInfo = {
      description:`新增【${options.roleName}】角色`,
      ...ROLE.ADD.logInfo[0]
      }
    return this.$httpRequest({
      url: ROLE.ADD.value,
      method: 'post',
      data: options,
      logInfo,
    });
  }

  edit(options) {
    let logInfo = {
      description:`编辑【${options.roleName}】角色`,
      ...ROLE.EDIT.logInfo[0]
      }
    return this.$httpRequest({
      url: ROLE.EDIT.value,
      method: 'post',
      data: options,
      logInfo,
    });
  }

  delete(options,roleName) {
    let logInfo = {
      description:`移除【${roleName}】角色`,
      ...ROLE.DELETE.logInfo[0]
      }
    return this.$httpRequest({
      url: `${ROLE.DELETE.value}/${options}`,
      method: 'post',
      data: options,
      logInfo,
    });
  }

  getMenusByOperationCenterId(id) {
    return this.$httpRequest({
      url: ROLE.CENTER_MENU_LIST.value,
      method: 'post',
      data: { operationCenterId: id },
    });
  }

  getMenuAndPrivilegeByOperationCenterId(id) {
    return this.$httpRequest({
      url: ROLE.CENTER_PRIVILEGE_LIST.value,
      method: 'post',
      data: { operationCenterId: id },
    });
  }
}

export default new ROLEService();
