import React from 'react';
import TasksComponent from '../../../PersonnelControl/Components/tasks/tasks'
export default class PhantomTasks extends React.Component {
  render() {
    return (
        <TasksComponent libType={3} /> 
    );
  }
}
