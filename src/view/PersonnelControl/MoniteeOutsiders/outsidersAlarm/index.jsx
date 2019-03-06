import React from 'react'
import AlarmComponent from '../../Components/alarm/alarmHistroy'
export default class OutsidersAlarm extends React.Component{
  render(){
    return (
      <AlarmComponent libType={2} />
    )
  }
}