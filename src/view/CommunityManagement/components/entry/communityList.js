import React, { Component } from 'react';
import IconFont from 'src/components/IconFont';
import EntryCard from './entryCard';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import { Popover, Checkbox} from 'antd';
import InputAfter from 'src/components/InputAfter';
import { stopPropagation } from '../../../../utils';
import './communityList.scss';

@withRouter
@BusinessProvider('TabStore')
@observer
class CommunityList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      checkedAll: true,
      currentId: ''
    }
  }

  inputHandleChange = (e) => {
    clearTimeout(this.alarmTime);
    this.setState({
      inputValue: e.target.value
    })
    let value = e.target.value;
    this.alarmTime = setTimeout(() => {
        this.props.getVillageList(value);
      }, 500);
  }
  onCancel = () => {
    this.setState({
      inputValue: ''
    })
    this.props.getVillageList();
  }
  handleSearch = () => {
    let { inputValue } = this.state;
    this.props.getVillageList(inputValue);
  }
  //常住跳转
  residenceHandle = ( type, id, e) => {
    stopPropagation(e);
    if(id) {
      let { TabStore, history } = this.props;
      let childModuleName = type == 0 ? 'CommunityRegistered': 'CommunityUnRegistered';
      TabStore.goPage({ moduleName: 'CommunityManagement', childModuleName, history,data: {id} })
    }
  }

  handleSelect = () => {
    let { checkedAll } = this.state;
    if(!checkedAll) {
      this.setState({
        currentId: '',
        checkedAll: true
      }, () => {
        this.props.restMap();
      })
    }
  }

  clickCommunity = (data) => {
    let { currentId } = this.state;
    if(currentId == data.id) {
      this.setState({
        currentId: '',
        checkedAll: true
      })
    this.props.restMap();
    } else {
      this.setState({
        currentId: data.id,
        checkedAll: false
      })
    this.props.clickCommunity(data);
    }
    // this.setState({
		// 	currentId: data.id
		// })
    // if(this.state.checkedAll) {
    //   return 
    // }
    // this.props.restMap();
  }
  render() {
    let { data = [] } = this.props;
    let { inputValue, checkedAll, currentId } = this.state;
    return (
      <div className="community_list">
      <div className="community_list_header">
      <p className="list_title">
          我的小区
       </p>
      <div className="community_list_checkbox">
            全部显示
            <span style={{ paddingLeft: '6px' }}>
              <Popover
                overlayClassName={'checkbox-span-pop-community'}
                placement="bottom"
                content={
                  checkedAll ? (
                    <span>请选择下面列表查看单个小区常住人口</span>
                  ) : (
                    <span>全部显示小区常住人口</span>
                  )
                }
              >
                <Checkbox
                  onChange={this.handleSelect}
                  checked={checkedAll}
                />
              </Popover>
            </span>
          </div>
      </div>

       <div className="list_search">
        <InputAfter size={'lg'} style={{ color: 'rgba(0,0,0,.25)' }} value={inputValue} placeholder="请输入小区名称搜索" onChange={this.inputHandleChange.bind(this)} onCancel={this.onCancel.bind(this)}/>
       </div>
       <div className="list_content">
          {data && data.map((item, index) => {
            return (
              <EntryCard currentId={currentId} key={index} data={item} clickCommunity={this.clickCommunity} residenceHandle={this.residenceHandle} />
            )
          })}
       </div>
      </div>
    )
  }
}

export default CommunityList;
