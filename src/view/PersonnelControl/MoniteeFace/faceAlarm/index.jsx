import React from 'react'
import AlarmComponent from '../../Components/alarm/alarmHistroy'
// import AlarmComponent from '../../Components/alarm/index'

export default class FaceAlarm extends React.Component{
  render(){
    return (
      <AlarmComponent libType={1} /> 
    )
  }
}