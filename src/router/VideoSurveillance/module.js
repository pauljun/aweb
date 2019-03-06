import asyncComponent from '../asyncComponent';
export default [
  {
    id: '100001010018',
    title: '视频监控',
    name: 'VideoSurveillance',
    isLocal: false,
    icon: 'icon-_Video',
    url: 'VideoSurveillance',
    storeName: ['VideoSurveillanceStore'],
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/VideoSurveillance').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../view/VideoSurveillance')
            )
          )
  }
];
