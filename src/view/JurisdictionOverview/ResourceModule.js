const ResourceTotalList = [
    {
        id: 7,
        title: '接入设备统计',
        component: require('./view/Panel/components/CameraStatus').default
    },
    {
        id: 8,
        title: '摄像机类型',
        component: require('./view/Panel/components/CameraType').default
    },
    // {
    //     id: 5,
    //     title: '存储',
    //     component: require('./view/Panel/components/Storage').default
    // },
    {
        id: 9,
        title: '场所有效报警数(Top5)',
        component: require('./view/Panel/components/PlaceAlarmNumb').default
    },
    {
        id: 3,
        title: '资源趋势统计',
        component: require('./view/Panel/components/ResourceTendencyStatic').default
    },
    {
        id: 10,
        title: '资源统计',
        component: require('./view/Panel/components/ResourceStatic').default
    },
    {
        id: 1,
        title: '布控统计',
        component: require('./view/Panel/components/Libanry').default
    },
    {
        id: 2,
        title: '设备统计',
        component: require('./view/Panel/components/Cameras').default
    },
    {
        id: 4,
        title: '警情统计',
        component: require('./view/Panel/components/Alarms').default
    },
    {
        id: 6,
        title: '报警统计',
        component: require('./view/Panel/components/AlarmNumb').default
    },
    // {
    //     id: 11,
    //     title: '流量',
    //     component: require('./view/Panel/components/Flow').default
    // },
    // {
    //     id: 12,
    //     title: '近24小时资源统计',
    //     component: require('./view/Panel/middle/ResourceStatic').default
    // }
];
export default ResourceTotalList