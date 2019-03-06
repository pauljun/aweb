import React from 'react';
import { errorBoundary } from '../../../../utils/Decorator';
import { map } from '../mapContext';
import SearchInput from 'src/components/SearchInput/indexOnChange';
import { Icon, message } from 'antd';
import '../style/map-search-layer.scss';

@errorBoundary
@map
export default class MapSearch extends React.Component {
  constructor(props) {
    super(props);
    this.placeSearch = null;
    this.geocoder = null;
    this.initMapSearch();
    this.state = {
      address: null,
      resultList: [],
      selectPoi: null,
      position: [],
      name: null
    };
  }
  componentWillUnmount() {
    this.placeSearch.clear();
    this.placeSearch = null;
    this.geocoder = null;
  }

  initMapSearch() {
    Promise.all([this.initPlaceSearch(), this.initGeocoder()]).then(res => {
      this.placeSearch = res[0];
      this.geocoder = res[1];
      this.props.init && this.props.init(this);
    });
  }
  initPlaceSearch() {
    return new Promise(resolve => {
      AMap.service('AMap.PlaceSearch', () => {
        let placeSearch = new AMap.PlaceSearch({
          pageSize: 100
        });
        resolve(placeSearch);
      });
    });
  }
  initGeocoder() {
    return new Promise(resolve => {
      AMap.service('AMap.Geocoder', () => {
        let geocoder = new AMap.Geocoder({ city: '全国' });
        resolve(geocoder);
      });
    });
  }

  /**
   *根据地址搜索兴趣点
   * @param {string} address
   */
  searchPoisForAddress(address) {
    return new Promise((resolve, reject) => {
      this.placeSearch.search(address, (status, result) => {
        if (status === 'complete') {
          resolve(
            result.poiList &&
              result.poiList.hasOwnProperty('pois') &&
              Array.isArray(result.poiList.pois)
              ? result.poiList.pois
              : []
          );
        } else {
          reject({ status, result });
        }
      });
    });
  }
  /**
   * 根据经纬度查询详细位置
   * @param {Array<Number>} position
   */
  searchAddressForPosition(position) {
    return new Promise((resolve, reject) => {
      this.geocoder.getAddress(position, (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          const { formattedAddress, addressComponent } = result.regeocode;
          const {
            province = '',
            city = '',
            district = '',
            township = '',
            street = '',
            streetNumber = ''
          } = addressComponent;
          const address =
            province + city + district + township + street + streetNumber;
          resolve({
            address,
            name: formattedAddress,
            result
          });
        } else {
          reject({ status, result });
        }
      });
    });
  }
  /**
   *
   * @param {string} address
   */
  searchPois(address) {
    if (!address) {
      this.setState({
        resultList: [],
        selectPoi: null
      });
      return false;
    }
    return this.searchPoisForAddress(address)
      .then(resultList => {
        this.setState({
          resultList
        });
      })
      .catch(this.catchSearch);
  }
  /**
   * @desc 选中结果
   * @param {*} item
   */
  selectPoiAction(item) {
    let position = [item.location.lng, item.location.lat];
    this.searchAddressForPosition(position).then(address => {
      this.setState({ address, selectPoi: item, position });
      this.props.onSelectPoi &&
        this.props.onSelectPoi({ position, ...address });
    }).catch(this.catchSearch);
  }
  catchSearch = error => {
    console.log(error);
    message.warn('未知的位置！');
  };
  render() {
    let { resultList, selectPoi } = this.state;
    return (
      <div className="map-search-layer">
        <SearchInput
          enterButton={true}
          placeholder="请输入位置"
          onChange={address => this.searchPois(address)}
        />
        <div className="poisList">
          {resultList.length > 0 &&
            resultList.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  this.selectPoiAction(item);
                }}
                className="poiItem"
              >
                <Icon style={{ fontSize: 12 }} type="environment-o" />
                <span title={item.name} className="name">
                  {item.name}
                </span>
                {selectPoi && selectPoi.id === item.id ? (
                  <Icon
                    style={{ fontSize: 12, color: '#52c41a' }}
                    type="check-circle"
                    className="selectPoi"
                  />
                ) : null}
              </div>
            ))}
        </div>
      </div>
    );
  }
}
