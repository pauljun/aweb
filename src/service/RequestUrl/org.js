import { Config } from '../Config';
const {api}=Config
export default {
  orgModule: {
    text: '组织管理',
    code: 104300,
  },
  enterOrgModule: {
    text: '进入组织管理界面',
    code: 104399,
    parent: 104300,
    moduleName: 'OrganizationView',
  },
  ORG_LIST: {
    value:  `${api}org/getAllByPid `,
    label: '组织列表'
  },
  SEARCHORG: {
    value:  `${api}org/queryOrgList`,
    label: '通过名称搜索组织'
  },
  ORDERUPDOWN:{ 
    value:`${api}org/sortOrg`,
    label:'控制上移和下移',
  },
  ORG_DELETE:{
    value:`${api}org/orgDel`,
    label:'删除组织',
		logInfo: [
			{
				code: 104304,
				parent: 104300,
				text: '删除组织'
			}
		]
  },
  ORG_UPDATE:{
    value:`${api}org/orgUpdate`,
    label:'编辑组织',
		logInfo: [
			{
				code: 104303,
				parent: 104300,
				text: '编辑组织'
			}
		]
  },
  ORG_ADD:{
    value:`${api}org/addOrg`,
    label:'新增组织',
		logInfo: [
			{
				code: 104302,
				parent: 104300,
				text: '新增组织'
			}
		]
  },
}