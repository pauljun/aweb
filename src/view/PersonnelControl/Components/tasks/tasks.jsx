import React from 'react'
import { observer } from 'mobx-react'
import { Spin } from 'antd'
import './index.scss'
//左侧列表
import NavView from '../components/tasksNavList/tasksList'
// 添加布控任务
import AddTask from './addTask/index'
// import AddTaskMachine from './addTask/index_machine'
//编辑查看布控任务
import EditTask from './editTask/index'
import NoDataComp from 'src/components/NoData'
import { BusinessProvider } from '../../../../utils/Decorator/BusinessProvider';
import LogsComponent from 'src/components/LogsComponent';

@LogsComponent()
@BusinessProvider('MoniteeLibsStore')
@observer
class view extends React.Component {

  state = {
    /**1:查看详情, 2: 添加布控库*/
    model: 1,
    isLoading: true,
    item: undefined,// 当前列表选中的任务
    EidtKey: Math.random(),
    // userOrgTreeData: {
    //   formTreeData: [],
    //   orgUserList: []
    // },// 用户组织机构
  }
  // componentDidMount(){
  //   const { MoniteeLibsStore } = this.props
  //   /**获取用户评级组织结构树 */
  //   MoniteeLibsStore.getOrgUsersList().then(userOrgTreeData => {
  //     this.setState({
  //       userOrgTreeData
  //     })
  //   })
  // }

  /**改变loading状态 ---右侧详情loading */
  changeLoadingState = (state) => {
    this.setState({
      isLoading: state
    })
  }
  /**调用 NavView 获取列表的方法 --- 编辑保存后更新列表和当前选中的布控任务*/
  updateNavList = () => {
    this.NavViewDom.getTaskList({},(res) => {
      let item = res[0] ? res[0] : {}
			item.id && this.NavViewDom.setItemById(item.id).then(res => {
        this.setState({
          EidtKey: Math.random()
        })
      })
    })
  }

  /**根据model获取渲染内容 */
  getContentByModel = () => {
    const { model, item } = this.state
    if(!item){
      return <div style={{height: '441px'}}></div>
    }
    if(!item.name){
      return <NoDataComp title={'数据'} imgType={2}/>
    }
    return <EditTask
      changeModel={this.changeModel}
      model={model}   
      item={item}
      libType={this.props.libType}
      updateNavList={this.updateNavList}
      key={this.state.EidtKey}
      // userOrgTreeData={this.state.userOrgTreeData}
    />
  }
  /**获取当前选中的布控任务---item */
  getItem = (item) => {
    this.setState({
      item,
      libId: item.id
    })
  }

  /**修改模式 */
  changeModel = model => {
    this.setState({
      model,
      item: {}
    })
  }

  render() {
    const { item } = this.state
    return (
      <div className='tasks-all-container'>
        {this.state.model === 2 
          ? <div className='container'>
          {/* 魅影告警任务添加-AddTaskAll 人脸布控任务/未知人员布控任务-addTask */}
            <div className="tasks-add-auto"><AddTask
                model={this.state.model}   
                changeModel={this.changeModel}
                libType={this.props.libType}
                //userOrgTreeData={this.state.userOrgTreeData}
              />
            </div>
          </div>
        : <div className='container'>
             <NavView 
              changeLibId={id => {
                this.setState({
                  libId: id
                })
              }}
              addNewTasks={() => this.changeModel(2)}
              isAlarm={false}
              listType={2}
              item={item ? item : {}}
              changeLoadingState={this.changeLoadingState}
              libType={this.props.libType}
              getItem={this.getItem}
              refDom={(dom) => this.NavViewDom = dom}
            /> 
            <div 
              className='content task-content-box'
              key={this.state.libId}
            >
            <Spin spinning={this.state.isLoading} size='large'>
                {this.getContentByModel()}   
            </Spin>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default view