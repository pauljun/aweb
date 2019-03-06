import React from 'react';
import ResidenceFilter from './residenceFilter';
import ResidenceTimeMap from './residenceTimeMap';
import { observer } from 'mobx-react';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import { toJS } from 'mobx';

import './residenceTrajectory.scss';

@BusinessProvider('CommunityDetailStore')
@observer
class ResidenceTrajectory extends React.Component{
  constructor(props){
    super(props);
    let { data = {}, CommunityDetailStore } = this.props;
    this.state = {
      searchData: toJS(CommunityDetailStore.searchData),
      faceList: []
    }
    this.getMap(data);
  }

  getMap(data) {
    let vids = [];
    if(data.vids === null) {
      return
    }
    if(data.vids && data.vids.length > 0) {  
      vids = data.vids.map(v => v);
    }
    if(data.vid) {
      vids.push(data.vid);
    }
    this.onTypeChange({vids});
  }

  onTypeChange = (option) => {
    let {CommunityDetailStore} = this.props;
    CommunityDetailStore.editSearchData(option).then(() => {
      this.setState({
        searchData: toJS(CommunityDetailStore.searchData)
      })
      if(CommunityDetailStore.searchData.vids.length == 0) {
        return;
      }
      this.search();
    })
  }
  search = () => {
    let {CommunityDetailStore} = this.props;
    CommunityDetailStore.getFaceList().then(res => {
      this.setState({
        faceList: res.face
      })
    })
  }
  changeSearchData = (option) => {
    let {CommunityDetailStore} = this.props;
    CommunityDetailStore.editSearchData(option).then(() => {
      this.setState({
        searchData: toJS(CommunityDetailStore.searchData)
      })
    })
  }
  render() {
    let { searchData, faceList } = this.state;
    return (
      <div className="residence_trajectory">
        <div className="trajectory_header">
          <p className="header_title">
            活动轨迹：
          </p>
          <ResidenceFilter onTypeChange={this.onTypeChange.bind(this)} changeSearchData={this.changeSearchData.bind(this)} searchData={searchData}/>
        </div>
        <div className="trajectory_map">
          <ResidenceTimeMap faceList={faceList}/>
        </div>
      </div>
    )
  }
}

export default ResidenceTrajectory;
