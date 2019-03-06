import asyncComponent from '../asyncComponent';
export default [
  {
    id: '100001000144',
    title: '辖区面板',
    name: 'Panel',
    isLocal: false,
    isAction: true,
    icon: 'icon-DataPanel_Main',
    url: 'JurisdictionOverview/Panel',
    storeName: ['JurisdictionOverviewStore'],
    parentId: '100001010050',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/JurisdictionOverview/view/Panel/index').default
        : asyncComponent(() =>
          require.ensure([], require =>
            require('../../view/JurisdictionOverview/view/Panel/index')
          )
        )
  },
  {
    id: '100001000145',
    title: '自定义辖区面板',
    name: 'PanelSetting',
    isLocal: true,
    isAction: true,
    icon: 'icon-DataPanel_Main',
    url: 'JurisdictionOverview/PanelSetting',
    storeName: ['JurisdictionOverviewStore'],
    parentId: '100001010050',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/JurisdictionOverview/view/PanelSetting/index').default
        : asyncComponent(() =>
          require.ensure([], require =>
            require('../../view/JurisdictionOverview/view/PanelSetting/index')
          )
        )
  }
];
