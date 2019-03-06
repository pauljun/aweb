import { Config } from '../Config';
const { api } = Config;
export default {
	roleModule: {
		code: 104500,
		text: '角色管理',
  },
  enterRoleModule: {
    text: '进入角色管理界面',
    code: 104599,
    parent: 104500,
    moduleName: 'RoleList',
  },
	LIST: {
		value: `${api}user/queryRoleList`,
		label: '角色列表',
	},
	DETAIL: {
		value: `${api}user/queryRolePrivileges`,
		label: '角色详情',
		logInfo: [
			{
				code: 104501,
				parent: 104500,
				text: '查看角色信息'
			}
		]
	},
	ADD: {
		value: `${api}user/addRole`,
		label: '新增角色',
		logInfo: [
			{
				code: 104502,
				parent: 104500,
				text: '新增角色'
			}
		]
	},
	EDIT: {
		value: `${api}user/changeRole`,
		label: '编辑角色',
		logInfo: [
			{
				code: 104503,
				parent: 104500,
				text: '编辑角色'
			}
		]
	},
	DELETE: {
		value: `${api}user/delRole`,
		label: '删除角色',
		logInfo: [
			{
				code: 104504,
				parent: 104500,
				text: '删除角色'
			}
		]
	},
	CENTER_MENU_LIST: {
		value: `${api}userRolePrivilege/getMenusByOperationCenterId`,
		label: '根据运营中心查询菜单列表'
	},
	CENTER_PRIVILEGE_LIST: {
		value: `${api}userRolePrivilege/getMenuAndPrivilegeByOperationCenterId`,
		label: '根据运营中心查询菜单和权限列表'
	}
};
