import React from 'react';
import MapSelect from 'src/view/BusinessComponent/MapSelect';

class view extends React.Component {
  constructor(props) {
    super(props);
    let list = this.computedSelectList(props.selectIds, props.list);
    this.state = {
      selectList: list
    };
  }
  computedSelectList(ids, points) {
    let list = [];
    ids.map(id => {
      let obj = points.find(item => item.id === id);
      obj && list.push(obj);
    });
    return list;
  }
  changeSelectList = selectList => {
    this.setState({
      selectList
    });
    this.props.setSelectKeys(selectList.map(v => v.id));
  };
  deleteDeviceItem = item => {
    const { selectList } = this.state;
    this.setState({ selectList: selectList.filter(v => v.id !== item.id) });
  };
  componentWillReceiveProps(nextProps) {
    if (this.props.selectIds !== nextProps.selectIds) {
      let list = this.computedSelectList(nextProps.selectIds, nextProps.list);
      this.setState({
        selectList: list
      });
    }
  }
  render() {
    return (
      <div className="device-sollot-table">
        <MapSelect
          deleteDeviceItem={this.deleteDeviceItem}
          onSelect={this.changeSelectList}
          points={this.props.list}
          selectList={this.state.selectList}
        />
      </div>
    );
  }
}

export default view;
