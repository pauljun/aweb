import React from 'react';
import Table from '../../components/Table';
import Pagination from 'src/components/Pagination';
function myorter(a,b,name){
  if(a[name] === '-' ){
    a[name]=0
  }
  if(b[name] === '-'){
    b[name]=0
  }
  return a[name] - b[name]
}
function percent (text) {
  if(text!=='-'){
    if((text*100+'%').length<=5){
      text=text*100+'%'
    }else{
      text=(text+'').replace('0.0','').replace('0.','')+'%'
    }
  }
  return text
}
const columns = [
  [
    { title: '模块名称', width: '25%', dataIndex: 'moduleName',key:'moduleName'},
    { title: '入口点击次数', sorter: (a, b) => myorter(a,b,'moduleVisitorNum'), width: '25%', dataIndex: 'moduleVisitorNum',key: 'moduleVisitorNum' },
    { title: '登录人数', sorter: (a, b) => myorter(a,b,'sysLandingUserNum'), width: '25%', dataIndex: 'sysLandingUserNum',key: 'sysLandingUserNum' },
    { title: '到达率', sorter: (a, b) => myorter(a,b,'moduleAccessRate'), width: '25%', dataIndex: 'moduleAccessRate',key: 'moduleAccessRate' , render: (text) => percent(text)
    }    
  ],
  [
    { title: '模块名称', width: '20%', dataIndex: 'name',key: 'name' },
    { title: '入口点击次数', sorter: (a, b) => myorter(a,b,'operationNum'),width: '20%', dataIndex: 'operationNum',key: 'operationNum'},
    { title: '入口点击人数', sorter: (a, b) => myorter(a,b,'operationUserNum'), width: '20%', dataIndex: 'operationUserNum',key: 'operationUserNum' },
    { title: '平均点击次数', sorter: (a, b) => myorter(a,b,'avgOperationNum'), width: '20%', dataIndex: 'avgOperationNum',key: 'avgOperationNum' },
    { title: '平均点击率', sorter: (a, b) => myorter(a,b,'rate'), width: '20%', dataIndex: 'rate',key: 'rate', render: (text) => percent(text) }    
  ],
  [
    { title: '模块名称', width: '20%', dataIndex: 'name',key: 'name' },
    { title: '搜索次数', sorter: (a, b) => myorter(a,b,'operationNum'), width: '20%', dataIndex: 'operationNum',key: 'operationNum' },
    { title: '使用人数', sorter: (a, b) => myorter(a,b,'operationUserNum'), width: '20%', dataIndex: 'operationUserNum',key: 'operationUserNum' },
    { title: '平均次数', sorter: (a, b) => myorter(a,b,'avgOperationNum'), width: '20%', dataIndex: 'avgOperationNum',key: 'avgOperationNum' },
    { title: '比重', sorter: (a, b) => myorter(a,b,'rate'), width: '20%', dataIndex: 'rate',key: 'rate', render: (text) => percent(text)}
  ],
  [
    { title: '模块名称', width: '20%', dataIndex: 'name',key: 'name' },
    { title: '搜索次数', sorter: (a, b) => myorter(a,b,'operationNum'), width: '20%', dataIndex: 'operationNum',key: 'operationNum' },
    { title: '使用人数', sorter: (a, b) => myorter(a,b,'operationUserNum'), width: '20%', dataIndex: 'operationUserNum',key: 'operationUserNum' },
    { title: '平均次数', sorter: (a, b) => myorter(a,b,'avgOperationNum'), width: '20%', dataIndex: 'avgOperationNum',key: 'avgOperationNum' },
    { title: '比重', sorter: (a, b) => myorter(a,b,'rate'), width: '20%', dataIndex: 'rate',key: 'rate', render: (text) => percent(text) }
  ],
]
const ListView = ({ dataSource, columnType=0, handleTableChange ,loading, total,searchData,onChange , ...props,}) => {
  return (
    <div className='statistical-table-view'>
      {/* <Table 
        // rowKey='id'
        rowKey={a => a.moduleName||a.name}
        locale={{ emptyText: '暂无数据' }} 
        dataSource={dataSource} 
        columns={columns[columnType]}
        onChange={handleTableChange}
        pagination={false}
        scroll={{ x: false, y: 480 }}
      /> */}
       <Table
          columns={columns[columnType]}
          dataSource={dataSource}
          loading={loading}
          rowKey='moduleName'
          {...props}
        />
        {/* <Pagination
          total={total}
          pageSize={searchData.pageSize}
          current={searchData.currentPage}
          onChange={onChange}
        /> */}
    </div>
  )
}

export default ListView;
