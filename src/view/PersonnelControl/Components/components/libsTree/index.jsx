import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx'
import { Table, message, Checkbox, Row, Col, Icon, Tag } from 'antd'
import { BusinessProvider } from '../../../../../utils/Decorator/BusinessProvider';
import _ from 'lodash'
import InputSearch from 'src/components/SearchInput';

import './index.scss'

@BusinessProvider('MoniteeLibsStore')
@observer
class MoniteeLibs extends Component {
  state = {
    showDetail: false,
    selectedRows: [],
    itemsAll: [],// 所有布控库的数据
    items: [], //当前table所有数据
    itemIds: [] //当前table所有数据对应的id集合
  }

  componentDidMount() {
    let { MoniteeLibsStore, libId, libType } = this.props
    MoniteeLibsStore.getList(libType).then(result => {
      const items = result
      let selectedRows = []
      items.forEach(item => {
        if(libId.indexOf(item.id) !== -1){
          selectedRows.push(item)
        }
      })
      let id = this.getIds(items)
      this.setState({ 
        selectedRowKeys: libId, 
        selectedRows, 
        items,
        itemsAll:items,
        itemIds: id
      })
    })
    this.setState({
      showDetail: this.props.showDetail
    })
  }

  //由所有数据得到所有id集合
  getIds = (items) => {
    let id = []
    items && items.forEach(item => {
      id.push(item.id)
    })
    return id
  }

  // 搜索-前端实现搜索
  onSearch = p => {
    const items = this.state.itemsAll
    let lists = items.filter(item => {
      return item.name.indexOf(p) !== -1
    })
    let id = this.getIds(lists)
    this.setState({
      items: lists,
      itemIds: id
    })
  }

  // 展开/收起组织
  onExpand = expandedKeys => {
    //this.setState({ expandedKeys })
  }

  // tag标签删除
  onTagClose = (id) => {
    const { selectedRows } = this.state
    let selectList = selectedRows.filter(item => {
      return item.id !== id
    })
    let selectedRowKeys = []
    selectList.forEach(item => {
      selectedRowKeys.push(item.id)
    })
    this.setState({
      selectedRowKeys,
      selectedRows: selectList
    })
    this.props.onSelected(selectedRowKeys)
  }
  //清空全部
  delAllItem = () => {
    this.setState({
      selectedRowKeys: [],
      selectedRows: []
    })
    this.props.onSelected([])
  }

  render() {
    const { 
      showDetail,
      selectedRowKeys,
      items
    } = this.state


    const columns = [
      {
        title: '',
        dataIndex: 'name',
        //render: text => <a href="javascript:;">{text}</a>
        render: text => <span>{text}</span>
      }
    ]

    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        //筛选-selectedRowKeysList-改变之前的id  items-当前得到的搜索数据  selectedRowKeys-当前选中的id
        let selectedRowKeysList = this.state.selectedRowKeys
        let items = this.state.items
        let ids = this.state.itemIds
        const allList = this.state.itemsAll
        selectedRowKeysList = _.difference(selectedRowKeysList, ids)
        selectedRowKeysList = _.union(selectedRowKeysList,selectedRowKeys)
        selectedRows = allList.filter(item => {
          if(selectedRowKeysList.indexOf(item.id) !== -1){
            return true
          }
        })
        this.setState({
          selectedRowKeys: selectedRowKeysList,
          selectedRows
        })
        this.props.onSelected(selectedRowKeysList)
      },
      getCheckboxProps: record => ({
        name: record.name
      })
    }

    return (
      <div className="libs-select-new">
        <div className="list-left-libs">
          <div 
            className='libs-search-title'
            onClick={() => this.setState({
              //showDetail: !showDetail
            })}
          >
            <span>{this.props.titleLibs ? this.props.titleLibs : '黑名单库'}</span>
            <InputSearch
              placeholder={'请输入你要搜索的库'}
              onSearch={this.onSearch} 
              className="search"
            />
          </div>
          {showDetail && <div className='libs-search-content'>
            <div className='libs-search-list-tb'>
              <Table 
                showHeader={false} 
                rowKey='id'
                rowSelection={rowSelection} 
                dataSource={items} 
                columns={columns} 
                pagination={false} 
              />
            </div>
          </div>}
        </div>
        <div className="selected-libs-right-container">
					<div className="selected-title">
						<span>{`已添加${this.props.titleLibs ? this.props.titleLibs : '黑名单库'}`}</span>
            <span style={{marginLeft:'6px'}}>({this.state.selectedRows && this.state.selectedRows.length}个)</span>
						<span className='libs-del' onClick={this.delAllItem}><i className='icon anticon'>&#xa61e;</i> 清空</span>
					</div>
					<div className="container-list">
            {this.state.selectedRows.map(item => {
              return (
                <Tag
                  closable
                  key={item.id}
                  onClose={this.onTagClose.bind(this, item.id)}
                >
                  <i className='icon anticon'>&#xa653;</i>{item.name}
                </Tag>
              )
            })}
					</div>
        </div>
      </div>
    )
  }
}

export default MoniteeLibs