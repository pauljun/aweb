import React from 'react'
import Page404 from './img/404.svg'
import NoAlarm from './img/NoAlarm.svg'
import NoData from './img/NoData.svg'
import NoNet from './img/NoNet.svg'
import NoPeople from './img/NoPeople.svg'
import './index.scss'
// 类型传数字 --- 0（404) 1 (无告警) 2 （无数据） 3(无网络) 4(以图搜图无图)
const imgComponent = [ Page404, NoAlarm, NoData, NoNet, NoPeople ]
const NoDataComp = (props) => {
  const title = props.title ? props.title : '数据'
  const imgType = props.imgType ? imgComponent[props.imgType] : NoData
  return (
    <div className='has-not-data-box'>
      <img src={imgType} alt=""/> 
      <div className="has-not-titlt">{`暂无${title}`}</div>
    </div>
	)
}
export default NoDataComp