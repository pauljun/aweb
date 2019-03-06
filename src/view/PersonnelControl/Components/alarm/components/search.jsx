import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import { BusinessProvider } from '../../../../../utils/Decorator/BusinessProvider';
import { withRouter } from 'react-router-dom'
import { Input,Icon } from 'antd'

import { GroupRadio, TimeRadio, ScoreSlider, GrapPoint, SearchClearGroup, GroupArray } from '../../../../Baselib/components/SearchGroup'
import { geoAddress, captureTime, alarmOperationType } from '../../../../../libs/Dictionary'
// import MoniteeLibs from './moniteeLibs'
import './search.scss';

@withRouter
 @BusinessProvider('MoniteeAlarmsStore')
@observer
class AlarmHistorySearchView extends Component {
  clear = () => {
    const { MoniteeAlarmsStore, searchDataChange } = this.props
    // 修改排序方式为默认排序-按时间排序
    this.props.setSortType && this.props.setSortType()
    let taskListIds = MoniteeAlarmsStore.searchData.taskListIds
    let searchDataObj = Object.assign({},MoniteeAlarmsStore.getInitSearchData(),{taskListIds})
    this.props.searchDataChange(searchDataObj)
  }
  onSearchParamsChange = data => {
    //高级搜索重置page值为第一页
    data.page = 1
    this.props.searchDataChange(data)
  }

  onMoniteePeopleChange = event => {
    this.props.searchDataChange({ captureUids: event.target.value })
  }

  // 搜索
  onSearch = () => {
    this.props.searchDataChange({ page: 1 })
    this.props.closeSearch()
  }

  render() {
    const searchData = this.props.MoniteeAlarmsStore.searchData
    return (
      <div className="baselib-search" style={{ overflowY: 'auto' }}>
        <div className="container">
          <div className="alarm-history-tlt">
            <span>
             高级搜索
            </span>
            <Icon onClick={this.props.closeSearch} type="close" theme="outlined" />
          </div>
          <div className="baselib-search-form">
            <GroupRadio 
              label="抓拍场所" 
              data={geoAddress} 
              value={searchData.geoAddress} 
              name="geoAddress" 
              change={this.onSearchParamsChange} 
            />
            <TimeRadio
              label="报警时间"
              data={captureTime}
              value={searchData.timeType}
              change={this.onSearchParamsChange}
              startTime={searchData.startTime}
              endTime={searchData.endTime}
            />
            <GroupRadio
              label="报警处置"
              data={alarmOperationType}
              value={searchData.alarmOperationType}
              name="alarmOperationType"
              change={this.onSearchParamsChange}
            />
            <GroupRadio
              label="排列规则"
              name="sortType"
              value={searchData.sortType}
              data={[{ value: 1, label: '按时间倒序排列' },{ value: 2, label: '按相似度倒序排列' },]}
              change={this.onSearchParamsChange}
            />
            {this.props.libType === 1 && 
            <ScoreSlider 
              label="报警阈值" 
              name="threshold" 
              value={searchData.threshold} 
              onAfterChange={this.onSearchParamsChange}
              change={this.props.onSliderChange} 
            />
            }
            <GrapPoint 
              label="报警点位" 
              value={searchData.cameraIds} 
              change={this.onSearchParamsChange} 
            />
            {/* {this.props.libType === 1 && 
            <MoniteeLibs 
              visible={modelData.moniteeLibsVisible} 
              storeId={this.props.storeId} 
              libType={this.props.libType}
            />
            } */}
            {this.props.libType === 1 && 
            <div className="item">
              <span className="label-baselib">布控人员</span>
              <div className="item-content point-group">
                <Input 
                  placeholder="请输入布控人员姓名或身份证号" 
                  onChange={this.onMoniteePeopleChange} 
                  value={searchData.captureUids} 
                />
              </div>
            </div>}
          </div>
        </div>
        <SearchClearGroup search={this.onSearch} clear={this.clear} />
      </div>
    )
  }
}

export default AlarmHistorySearchView
