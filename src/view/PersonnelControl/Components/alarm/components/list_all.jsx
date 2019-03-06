import React from 'react'
import AlarmOutCard from '../../../MoniteeRealAlarm/components/alarmOutCard';
import { stopPropagation } from '../../../../../utils';
import ModalView from 'src/components/ModalView';
import './list.scss';

// const noLinkBox = () => {
//   return (
//     <div className='has-not-data'>
//       <div className="has-not-box">
//         <div className='no-data-title'>暂无数据</div>
//       </div>
//     </div>
//   )
// }

class view extends React.Component{
  constructor(props){
    super(props);
    this.state = {
			handleVisible: false,
			type: 1,
			modalItem: {}
		};
  }

  handleChangeYN = (item, type, e) => {
		stopPropagation(e);
		this.setState({
			modalItem: item,
			handleVisible: true,
			type
		});
	};
	handleCancel = () => {
		this.setState({
			modalItem: {},
			handleVisible: false,
			type: 1
		});
	};
	handleOk = () => {
		let { type, modalItem } = this.state;
		this.props.handle(modalItem, type).then(() => {
			this.setState({
				modalItem: {},
				handleVisible: false,
				type: 1
			});
		});
	};
	handleJumPage = (id, libType) => {
		this.props.handlePageJump && this.props.handlePageJump(id, libType);
	}
  render() {
		let { list, libType } = this.props;
    let { handleVisible, type } = this.state;
    return (
      <div className="no-padding-card alarm_str_all alarm-card" style={{padding:'0 50px'}}>
				{list.map((v, index) => {
					return (
						<div key={v.id}>
							<AlarmOutCard type={libType ==2 || libType ==4 ? '' : 'another'} detailType={true} data={v} libType={libType} handleChangeYN={this.handleChangeYN} handleJumPage={this.handleJumPage.bind(this)} />
						</div>
					);
				})}
				<div className="all_alarm_nullbox" />
				<div className="all_alarm_nullbox" />
				<div className="all_alarm_nullbox" />
				<div className="all_alarm_nullbox" />
				<div className="all_alarm_nullbox" />
				<ModalView
					title={type == 1 ? `有效${libType == 3 ? '提醒': '告警'}确认` : `无效${libType == 3 ? '提醒': '告警'}确认`}
					visible={handleVisible}
					onCancel={this.handleCancel}
					onOk={this.handleOk}
          width={320}
          iconType={type == 1 ? 'icon-YesNo_Yes_Main' : 'icon-YesNo_No_Main'}
					view={
						<div>
							点击“确定”把本{libType == 3 ? '提醒': '告警'}标注为{type == 1 ? '有' : '无'}效{libType == 3 ? '提醒': '告警'}?
						</div>
					}
				/>
      </div>
    )
  }
}

export default view
