import React from 'react';
import { getLogInfoList } from "src/service/RequestUrl";

const LogsComponent = config => WrappedComponent => class extends React.Component {
  componentDidMount(){
    if(config){
      this.saveLog(config)
    }else{
      const infoList = getLogInfoList()
      let pathname = window.location.href.split('/')
      const params = infoList.find(v => v.moduleName == pathname[pathname.length - 1])
      params && this.saveLog(params)
    }
  }
  saveLog(params){
    GlobalStore.LoggerStore.save({
      code: params.code,
      parent: params.parent
    })
  }
  render() {
    return <WrappedComponent {...this.props} />
  }
};

export default LogsComponent;