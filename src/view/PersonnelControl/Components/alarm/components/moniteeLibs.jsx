import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import { withRouter } from 'react-router-dom'
import { Modal, Table } from 'antd'
import _ from 'lodash'

@withRouter
@inject('alarmHistoryModel')
@observer
class MoniteeLibs extends Component {
  state = {}

  componentWillMount() {
    const { alarmHistoryModel } = this.props
    alarmHistoryModel.getMoniteeLibsList(this.props.storeId,{libType: this.props.libType})
  }

  onMoniteeLibClick = () => {
    const { alarmHistoryModel, storeId } = this.props
    alarmHistoryModel.setMoniteeLibsVisible(storeId, true)
  }

  onCancelClick = () => {
    const { alarmHistoryModel, storeId } = this.props
    alarmHistoryModel.setMoniteeLibsVisible(storeId, false)
  }

  onOkClick = () => {
    const { alarmHistoryModel, storeId } = this.props
    alarmHistoryModel.setMoniteeLibsVisible(storeId, false)
  }

  onClearClicked = () => {
    const { alarmHistoryModel, storeId } = this.props
    alarmHistoryModel.editSearchData(storeId, { libIds: [] })
  }

  render() {
    const { alarmHistoryModel, storeId } = this.props
    const { selectedRowKeys } = this.state
    const modelData = toJS(alarmHistoryModel.getDataByStoreId(storeId))

    const columns = [
      {
        title: '全选',
        dataIndex: 'name',
        render: text => <a href="javascript:;">{text}</a>
      }
    ]

    let _selectedRowKeys = modelData.searchData.libIds

    const rowSelection = {
      selectedRowKeys: _selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        const { alarmHistoryModel, storeId } = this.props
        alarmHistoryModel.editSearchData(storeId, { libIds: selectedRowKeys })
      }
    }

    return (
      <div className="item">
        <span className="label-baselib">布控库</span>
        <div className="item-content point-group">
          {!_.isEmpty(modelData.moniteeLibs) &&
            !_.isEmpty(_selectedRowKeys) && (
              <div className="grap-point-content">
                <ul className="camera-selected">
                  {modelData.moniteeLibs.filter(lib => _.includes(_selectedRowKeys, lib.id)).map((v, k) => {
                    return <li key={k}>{v.name}</li>
                  })}
                </ul>
                <span onClick={this.onClearClicked}>清空</span>
              </div>
            )}
          <div 
            onClick={this.onMoniteeLibClick} 
            className="pg-t"
          >
            布控库列表
          </div>
        </div>
        <Modal 
          title="布控库筛选" 
          visible={this.props.visible} 
          onOk={this.onOkClick} 
          className='item-libs-list-style'
          onCancel={this.onCancelClick}>
          <Table 
            rowSelection={rowSelection} 
            rowKey='id'
            dataSource={modelData.moniteeLibs} 
            columns={columns} 
            pagination={false} 
          />
        </Modal>
      </div>
    )
  }
}

export default MoniteeLibs
