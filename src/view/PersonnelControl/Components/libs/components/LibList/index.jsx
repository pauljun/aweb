import React,{ Component } from 'react';
import { Button, List, Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroller'

import IconFont from 'src/components/IconFont';
import SearchInput from 'src/components/SearchInput';
import NoData from 'src/components/NoData';
import AuthComponent from 'src/view/BusinessComponent/AuthComponent';
import UploadComponent from './Upload'
import './index.scss'

const titleLabel = {
  1: '重点人员库',
  2: '合规人员库',
  4: '专网库'
}
// 黑名单库、白名单库列表组件
class LibList extends Component {
 
  render(){
    const { className='', libType=1, actionName, onSearch, listData, addLib, ...rest } = this.props;
    let label = titleLabel[libType]
    return (
      <div className={`monitee-lib-list-wrapper ${className}`}>
        <div className='lib-list-container'>
          <div className='lib-list-search'>
            <AuthComponent actionName={actionName}>
              {libType !== 4 
                ? <Button 
                    type='primary' 
                    icon="plus" 
                    onClick={() => addLib(libType)}
                  >{`新建${label}`}</Button>
                : <UploadComponent />
              }
            </AuthComponent>
            <SearchInput
              placeholder={`请输入${label}名称`}
              onSearch={onSearch}
            />
          </div>
          <div className='lib-list-content'>
             { !!listData.length 
                ? <InfiniteList 
                    listData={listData}
                    actionName={actionName}
                    {...rest}
                  />
                : <NoData title='布控库'/>
            } 
          </div>
        </div>
      </div>
    )
  }
}

class InfiniteList extends Component {

  renderItem = (v) => {
    const { currLibId, userId, deleteLib, getLibDetail, actionName } = this.props;
    return (
      <List.Item key={v.id}>
        <div className={`item clearfix ${v.id === currLibId ? 'active' : ''}`}>
          <span 
            className="item-title fl"
            title={v.name} 
            onClick={() => getLibDetail(v.id)}
          >
            {v.name}
          </span>
          { v.creator === userId && (
              <AuthComponent actionName={actionName}>
                <IconFont 
                  className='item-del fr' 
                  type='icon-Delete_Main'
                  onClick={() => deleteLib(v.id, v.name, v.personCount)} 
                />
              </AuthComponent>
            )
          }
        </div>
      </List.Item>
    )
  }

  render(){
    const { loadMore, loading, hasMore, listData } = this.props;
    return (
      <InfiniteScroll
        initialLoad={false}
        pageStart={1}
        loadMore={loadMore}
        hasMore={!loading && hasMore}
        useWindow={false}
      >
        <List
          dataSource={listData}
          renderItem={this.renderItem}
        >
          {loading && hasMore && (
            <div className="loading-more">
              <Spin />
            </div>
          )}
        </List>
      </InfiniteScroll>
    )
  }
}

export default LibList;

