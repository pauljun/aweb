import React from 'react'
import TasksComponent from '../../Components/tasks/tasks'
export default class FaceTasks extends React.Component{
  render(){
    return (
      <TasksComponent libType={1} />
    )
  }
}