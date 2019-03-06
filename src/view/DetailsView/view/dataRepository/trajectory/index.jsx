import React, { Component } from 'react';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import Trajectory from '../../../../Baselib/components/Trajectory/'
import NoData from 'src/components/NoData';

@withRouter
@BusinessProvider('TabStore')
@observer
class TrajectoryComponent extends Component {
  constructor(props){
    super(props)
    let { TabStore, history } = this.props;
    let pageState, type;
    try{
      pageState = history.location.state.pageState;
      type = pageState.type
			this.hasData = true;
		} catch(e){
			this.hasData = false
			pageState = {}
    }
    if(this.hasData){
      this.state = {
        list: pageState.list,
        type: pageState.type
      }
    }
  }
  close = () => {
    alert('关闭')
  }
  render(){
    if(!this.hasData){
			return <NoData></NoData>
		}
    const { list, type } = this.state
    return (
      <Trajectory 
        list={list}
        close={this.close}
        type={type}
      />
    )
  }
}
export default TrajectoryComponent