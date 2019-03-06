import React from 'react';
import InputAfter from 'src/components/InputAfter';
import InfoCard from './infoCard';
import '../style/infoLeft.scss';

class InfoLeft extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      val: ''
    }
  }
	changeVal = (e) => {
		this.setState({
			val: e.target.value
		});
		let value = e.target.value;
		clearTimeout(this.alarmTime);
		this.alarmTime = setTimeout(() => {
			this.props.getVillageList(value);
		}, 500);
	};

	onCancel = () => {
		this.setState({
			val: ''
		});
		this.props.getVillageList();
	}
  render() {
    let { val } = this.state;
    let { villageList = [], villageId } = this.props;
    return (
      <div className="info-left">
        <div className="header">
          <p className="header-title">信息录入</p>
          <div className="header-search">
            <InputAfter 
                size={'lg'}
                placeholder={'请输入小区名称搜索'}
                value={val}
                onChange={this.changeVal}
                onCancel={this.onCancel.bind(this)}
                style={{ width: '100%' }} 
            />
          </div>
        </div>
        <div className="content">
          {villageList.map( (v, index) => {
            return <InfoCard villageId={villageId} data={v} key={index} onChoseVillage={this.props.onChoseVillage}/>
          })}
        </div>
      </div>
    )
  }
}

export default InfoLeft;