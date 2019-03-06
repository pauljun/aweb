import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {BusinessProvider}from 'src/utils/Decorator/BusinessProvider'
import { TimeRadio, GrapPoint, PlateColorSelect, VehicleColorSelect, GroupSelectNew } from '../components/SearchGroupNew';
import { captureTime, vehicleBrands, vehicleClasses, vehicleColor, plateColor } from 'src/libs/Dictionary';
import { Button, Input, Icon } from 'antd'
const Search = Input.Search;
@BusinessProvider('vehicleStore')
@observer
class SearchView extends Component {
	//清除查询条件
  clear = () => {
    const { vehicleStore, setTimeRadioValue, searchDataChange } = this.props
    const { pageSize } = vehicleStore.searchData;
    vehicleStore.initSearchData({pageSize}).then(
      () => {
        setTimeRadioValue(3, () => searchDataChange({}, true))
      }
    )
	}
	
	change = (options) => {
		this.props.searchDataChange(options)
  }

	render() {
    const { 
      timeRadioValue, 
      setTimeRadioValue, 
      vehicleStore, 
      handleDateChange, 
      onSearch,
      searchValue,
      placeholder,
      onSearchChange
     } = this.props;
    const { searchData={} } = vehicleStore;
		return (
			<div className='data-repository-search'>
        <div className="upload-or-search">
          {onSearch && (
            <Search 
              value={searchValue}
              enterButton
              placeholder={placeholder}
              onChange={onSearchChange}
              onSearch={onSearch}
            />
          )}
        </div>
				<div className="search-title">
					图库筛选：
					<Button className='reset-btn' onClick={this.clear}>重置</Button>
        </div>
				<div className='container'>
					<div className='data-repository-search-form'>
						<TimeRadio
              change={handleDateChange}
              onOk={this.change}
							value={timeRadioValue}
							startTime={searchData.startTime}
							endTime={searchData.endTime}
							changeTimeRaioValue={setTimeRadioValue}
						/>
            <GrapPoint
              value={searchData.devices}
              onChange={this.change}
							name='devices'
            />
            <PlateColorSelect
              data={plateColor}
              label='车牌颜色'
              iconFont='icon-Brand_Dark'
              value={searchData.plateColor}
              name='plateColor'
              change={this.change}
            />
            <VehicleColorSelect
              data={vehicleColor}
              label='车辆颜色'
              iconFont='icon-_CarAlarm'
              value={searchData.vehicleColor}
              name='vehicleColor'
              change={this.change}
            />
            <GroupSelectNew 
							data={vehicleBrands}
							label='车牌品牌'
							placeholder='请选择车辆品牌'
              iconFont='icon-Sign_Dark'
							value={searchData.vehicleBrands}
							name='vehicleBrands'
							change={this.change}
						/>
            <GroupSelectNew 
							data={vehicleClasses}
							label='车辆类型'
              iconFont='icon-Type_Dark'
							placeholder='请选择车辆类型'
							value={searchData.vehicleClasses}
							name='vehicleClasses'
							change={this.change}
						/>
					</div>
				</div>
			</div>
		)
	}
}

export default SearchView;
