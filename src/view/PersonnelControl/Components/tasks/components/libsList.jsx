import React, { Component } from 'react'
import { Input } from 'antd-form-component'
import ScoreSlider from '../../components/score/index.jsx'
import LibTreeView from '../../components/libsTree/index'
import MachinLibTreeView from './AIOlibsSelect/index'
export default class LibsList extends Component {
	componentDidMount(){
		let item = this.props.itemDate || {}
		if(item.alarmThreshold){
			this.props.form.setFieldsValue({
        alarmThreshold: item.alarmThreshold,
        libId: item.libId ? item.libId : [],
      })
		}
	}
	// 数据提交到父组件
	toFatherComponent = (obj) => {
		this.props.changeTasksData && this.props.changeTasksData(obj)
	}
	onSelected = (data) => {
		this.toFatherComponent({
			libId: data
		})
		this.props.form.setFieldsValue({
			libId: data
		})
	}
	change = (scope) => {
		this.toFatherComponent({
			alarmThreshold: scope
		})
		this.props.form.setFieldsValue({
			alarmThreshold: scope
		})
	}
	render(){
		const { errorShow, itemDate } = this.props
		const { alarmThreshold = 80, libId = [] } = itemDate
		let libs = []
		if(this.props.item){
			libs = this.props.item.libs || []
		}
		let titleLibs = ['重点人员库', '合规人员库','魅影','布控库']
		return(
			<div className='monitee_tasks_box libs_list'>
				<Input
					name="alarmThreshold"
					type="hidden"
					required
					label="报警阙值"
					value={alarmThreshold}
				/>
				<div className='form-group-item score-form-item alarm-threshold'>
					<div className='form-group-item-label-required'>
						告警阈值 : 
					</div>
					<div 
						className='form-group-item-content'
					>
						{/* <span className='score-span'>{ alarmThreshold }</span> */}
						<ScoreSlider 
							value={Number(alarmThreshold)}
							onChange={this.change}
							libType={this.props.libType}
						/>
					</div>
        </div>
				<Input 
            name='libId'
            type='hidden'
            required
          />
				<div className='form-group-item libs-sel-box'>
            <div className='form-group-item-label-required'>
              {titleLibs[this.props.libType - 1]} :
            </div>
             <div className='form-group-item-content'>
              {this.props.libType === 4 ?
               <MachinLibTreeView 
                libId={libId}
                libs={libs}
                onSelected={this.onSelected}
              /> 
              :<LibTreeView 
                libId={libId}
                onSelected={this.onSelected}
                titleLibs={titleLibs[this.props.libType - 1]}
                libType={this.props.libType}
								showDetail={!!itemDate}
              /> }           
               {!!!libId.length && errorShow && <div className='monitees-error' style={{marginTop: '10px'}}>请选择布控库</div>} 
            </div> 
          </div> 
			</div>
		)
	}
}