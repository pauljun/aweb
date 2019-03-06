import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx';
import { message, Popconfirm } from 'antd'
import PrivButton from 'src/view/components/PrivButton';

import './index.scss'

@inject('libraryModel', 'moniteeLocalPeopleModel', 'userModel')
@observer
class ControlPerson extends Component {
  constructor(props){
    super(props);
    this.storeId = props.storeId
  }

  deletePeople = async (id) => {
    const { moniteeLocalPeopleModel, libraryModel } = this.props;
    const result = await moniteeLocalPeopleModel.onDelete(id);
    if (!result) {
      return message.error('删除失败')
    }
    const { item } = libraryModel.getDataByStoreId(this.storeId);
    // 本地删除
    const itemCopy = Object.assign({}, toJS(item))
    const resultList = itemCopy.objectInfoList.resultList.filter(v => v.id !== id);
    itemCopy.objectInfoList.resultList = resultList;
    libraryModel.setData(this.storeId, { item: itemCopy})
  }

	render(){
    const { changeModel, peopleList=[], creator } = this.props;
		return(
			<div className="controlPerson">
          <div className="containerUser">
            { this.props.userModel.userInfo.id === creator && 
              <div className="messageItem">
                {this.props.userModel.btnInfo.monitees_library_people &&
                <ul>
                  <li>
                    <span onClick={() => changeModel(5)}>本地添加</span>
                    <span onClick={() => changeModel(4)}>从社区人员增加</span>
                    <span onClick={() => changeModel(7)}>批量导入</span>
                  </li>
                </ul>}
              </div>
            }
            <div className="contentItem">
              <ul>
              {
                !!peopleList.length && peopleList.map((v,k) => {
                  let selfAttr = v.selfAttr || {}
                  let infoList = v.infoList.slice()[0] || {}
                  let imageUrl = infoList.imageUrl || infoList.image
                  return (
                    <li key={v.id} className="item">
                      <div className='itemAta'><div className='watermask'>{this.props.userModel.userInfo.realName}</div><img src={imageUrl} alt="" /></div>
                      <div className="itemInfo">
                        <div title={selfAttr.name}><span>姓名</span>: {selfAttr.name}</div>
                        <div><span>性别</span>: {selfAttr.gender}</div>
                        <div><span>民族</span>: {selfAttr.nationality}</div>
                        <div><span>身份证</span>：{selfAttr.identityNumber}</div>
                        {this.props.userModel.userInfo.id === creator &&
                          <div className="btnMessage">
                            <PrivButton 
                              type='primary'
                              onClick={() => changeModel(6, v.id)}
                              priv='monitees_library_people'
                              tag='span'
                            /> 
                            {this.props.userModel.btnInfo.monitees_library_people &&
                            <Popconfirm title='确认删除吗' onConfirm={() => this.deletePeople(v.id)} okText="确定" cancelText="取消">
                              <span></span>
                            </Popconfirm>}
                          </div>
                        }
                      </div>
                    </li>
                  )
                })
              }
              </ul>
            </div>
            {/* <div className="controlSubmit">
              <Button type="primary">
              提交
            </Button>
            </div> */}
          </div>
        </div>
		)
	}
}

export default ControlPerson