import asyncComponent from '../asyncComponent'
export default [
  {
    id: '100001010050',
    title: '辖区总览',
    name: 'JurisdictionOverview',
    isLocal: false,
    icon: 'icon-_Area',
    url: 'JurisdictionOverview',
    storeName: ['JurisdictionOverviewStore'],
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/JurisdictionOverview').default
        : asyncComponent(() =>
            require.ensure([], require => require('../../view/JurisdictionOverview'))
          )
  }
];
