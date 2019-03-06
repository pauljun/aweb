import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Tag, Checkbox } from 'antd'
import _ from 'lodash'
import './index.scss'
import { BusinessProvider } from '../../../../../../utils/Decorator/BusinessProvider';
import InputSearch from 'src/components/SearchInput';
@BusinessProvider('MoniteeLibsStore')
@observer
class MoniteeLibs extends Component {
  state = {
    machinesDataInit: [], // 用于前端实现搜索
    machinesData:[], //一体机数据源
    selectedRowKeys:[],//当前选中项 -- 布控任务id
    selectedRows:[], // 当前选中完整数据
    libData: [], //布控库数据源
    libIds: [], //布控库id 
    activeMachin:'',
    allChecked: false,
    indeterminate: false,
    // 新增字段
    searchData: {
      pageSize: 500,
      page: 1
    }
  }

  componentDidMount() {
    const { MoniteeLibsStore, libs } = this.props
    MoniteeLibsStore.getMachines(this.state.searchData).then(machinesData => {
      if(machinesData && machinesData.length > 0){
        this.setState({ 
          machinesData,
          machinesDataInit: machinesData
         })
        let sn = machinesData[0].sn
        this.getSnLibs(sn)
      }
    })
    if(libs){
      let { selectedRowKeys, selectedRows} = this.state
      libs.forEach(item => {
        selectedRowKeys.push(item.libId)
        selectedRows.push({
          id: item.libId,
          name: item.libName
        })
      })
      this.setState({
        selectedRowKeys,
        selectedRows
      })
    }
  }

  // 设置当前选中的转态，将选中数据返回给父组件
  toFatherComponent = (selectedRows) => {
    let selectedRowKeys = this.getSelectedId(selectedRows)
    this.props.onSelected && this.props.onSelected(selectedRowKeys)
    this.setState({ selectedRows, selectedRowKeys }, () => {
      this.checkState()
    })
  }
   //选择一体机
  machinesChange=(info) => {
    if(info && info.sn===this.state.activeMachin){
      return
    }
    info && this.getSnLibs(info.sn)
  }
  
  //获取单个一体机布控库
  getSnLibs(sn){
    let searchData = Object.assign({}, this.state.searchData, {sn})
    this.props.MoniteeLibsStore.getMachineLibs(searchData).then(libData => {
      let libIds = this.getSelectedId(libData)
      this.setState({
        libData,
        libIds,
        activeMachin: sn
      },() => {
        this.checkState()
      })
    })
  }

  // 搜索-前端实现搜索
  onSearch = val => {
    let machinesData = this.state.machinesDataInit.filter(v => {
      if(~v.name.indexOf(val)){
        return true
      }
    })
    this.setState({ machinesData })
    if(machinesData.length > 0){
      this.getSnLibs(machinesData[0].sn)
    }else{
      this.setState({
        libData: []
      })
    }
  }

  // tag标签删除
  onTagClose = (item) => {
    let { selectedRows } = this.state
    selectedRows = _.differenceBy(selectedRows, [item], 'id')
    let selectedRowKeys = this.getSelectedId(selectedRows)
    this.toFatherComponent(selectedRows)
  }
  //清空全部
  delAllItem = () => {
    this.toFatherComponent([])
  }
 //布控库全选反选
  onAllSelect=(e) => {
    let { selectedRows, libData } = this.state
    if(e.target.checked){
      // 当前全部选中
      selectedRows = _.unionBy(selectedRows, libData, 'id')// 合并去重
    }else{
      // 当前全部不选中
      selectedRows = _.differenceWith(selectedRows, libData, _.isEqual)// 根据id去重--三个参数
    }
    this.toFatherComponent(selectedRows)
  }
 /* 布控库全半选状态 */
  checkState = () => {
    let { libIds, selectedRowKeys } = this.state
    const temp = _.intersection(libIds, selectedRowKeys);
    const checkHalfStatus = temp.length && temp.length < libIds.length;
    const checkAllStatus = libIds.length && temp.length === libIds.length;
    this.setState({
      indeterminate: checkHalfStatus,
      allChecked: checkAllStatus
    })
  }
  /**根据所有的 selectedRows 获取id集合*/
  getSelectedId = (selectedRows) => {
    let ids = []
    selectedRows.forEach(item => {
      ids.push(item.id)
    })
    return ids
  }
 /* 布控库选择 -- 单个选择 */
  onLibChange = (item, e) => {
    let { selectedRows } = this.state
    if(e.target.checked){
      //选中当前
      selectedRows.push(item)
    }else{
      //取消选中当前
      //selectedRows = _.differenceBy(selectedRows, [item], 'id')// 根据id去重--三个参数
      selectedRows = _.differenceWith(selectedRows, [item], _.isEqual)// 根据id去重--三个参数
    }
    this.toFatherComponent(selectedRows)
  }

  render() {
    const { machinesData=[], libData=[], activeMachin, allChecked, indeterminate, selectedRowKeys } = this.state
    return (
      <div className="monitee-libs libs-new-style aio-libs-select">
        <div className="list-left-libs">
          <div 
            className='libs-search-title'
          >
            <span>一体机列表</span>
            <InputSearch 
              className="search" 
              onSearch={this.onSearch} 
              placeholder='请输入你要搜索的一体机'
            />
          </div>
          <div className='libs-search-content'>
            <div className='libs-search-list-tb'>
            <ul>
              {machinesData && machinesData.map(v => 
              <li className={activeMachin===v.sn?'activeMachin machinLi':'machinLi'} key={v.sn} onClick={() => this.machinesChange(v)}><i style={{marginRight:'10px'}} className='icon anticon'>&#xa62e;</i>{v.name}</li>
              )}
            </ul>
            </div>
          </div>
        </div>
        <div className="list-left-libs list-center-libs-box">
          <div 
            className='libs-search-title'
          >
          <span>布控库列表</span>
          <Checkbox style={{float:'right'}} checked={allChecked} disabled={_.isEmpty(libData)} onChange={this.onAllSelect} indeterminate={indeterminate}>
            全选
          </Checkbox>
          </div>
          <div className='libs-search-content'>
            <div className='libs-search-list-tb'>
            <ul>
              {libData && libData.map(v => 
              <li className='libLi' key={v.id} title={v.name}>
              <Checkbox 
                checked={_.includes(selectedRowKeys, v.id)} 
                onChange={event => this.onLibChange(v, event)} 
              />
                <i className='icon anticon'>&#xa653;</i>
                {v.name}
              </li>
              )}
            </ul>
            </div>
          </div>
        </div>
        <div className="selected-libs-right-container">
					<div className="selected-title">
						<span className='title-text'>{`已选布控库`}</span>
            <span className='title-text' style={{marginLeft:'6px'}}>({this.state.selectedRows && this.state.selectedRows.length}个)</span>
						<span className='libs-del' onClick={this.delAllItem}><i className='icon anticon'>&#xa61e;</i> 清空</span>
					</div>
					<div className="container-list">
            <div className="selected-libs-list">
             {this.state.selectedRows && _.unionBy(this.state.selectedRows,'id').map(item => {
              return (
                <Tag
                  style={{border:0,display:'block',position:'relative',paddingLeft:'28px'}}
                  closable
                  key={item.id}
                  onClose={this.onTagClose.bind(this, item)}
                  title={item.name}
                >
                  <i style={{position:'absolute',left:0,top:'8px'}} className='icon anticon'>&#xa653;</i>
                  {item.name}
                </Tag>
              )
            })} 
            </div>
					</div>
        </div>
      </div>
    )
  }
}

export default MoniteeLibs