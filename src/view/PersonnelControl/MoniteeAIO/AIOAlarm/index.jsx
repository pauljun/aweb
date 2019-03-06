import React from 'react'
import LibRouter from "../../Components/libs";
import AlarmComponent from '../../Components/alarm/alarmHistroy'

export default class FaceAlarm extends React.Component{
  render(){
    return (
      <AlarmComponent libType={4} /> 
    )
  }
}