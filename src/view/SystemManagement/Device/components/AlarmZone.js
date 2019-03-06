import React from 'react';
import { Button } from 'antd';

class AlarmZoneView extends React.Component {
  state = {
    alarmZoneKeys: [],
    mouseDownStatu: false,
    startKey: '',
    selectType: true,
    width: 480,
    height: 270,
    col: 18,
    row: 22
  };

  componentDidMount() {
    let { width, height, col, row, zoneArray, brand } = this.props;
    let allZone = [];
    this.setState({
      alarmZoneKeys: allZone,
      width: width || 480,
      height: height || 270,
      col: col || 18,
      row: row || 22
    });
    col = col || 18;
    row = row || 22;
    let brandType = '1';
    if (brand === '爱耳目') {
      brandType = '0';
    }
    for (let i = 0; i < col * row; i++) {
      allZone.push({
        id: i,
        type: zoneArray ? zoneArray[i] === brandType : false
      });
    }
  }

  mouseDownZone = v => {
    this.setState({
      mouseDownStatu: true,
      startKey: v.id
    });
  };
  mouseUpZone = v => {
    let { startKey, alarmZoneKeys, selectType } = this.state;
    if (v.id === startKey) {
      alarmZoneKeys[startKey].type = selectType;
    }
    this.setState({
      mouseDownStatu: false,
      startKey: '',
      alarmZoneKeys
    });
    this.setKeys(alarmZoneKeys);
  };

  //判断a是否在b,c之间
  isBetween = (a, b, c) => {
    if ((a < b && a < c) || (a > b && a > c)) {
      return false;
    } else {
      return true;
    }
  };
  coo = num => {
    let x = num % this.state.row;
    let y = Math.ceil(num / this.state.row);
    if (x === 0) {
      y += 1;
    }
    return { x, y };
  };

  mouseMoveZone = (v, e) => {
    e.preventDefault();
    if (!this.state.mouseDownStatu) {
      return;
    }
    let { startKey, alarmZoneKeys, selectType } = this.state;
    let startKeyX = this.coo(startKey).x;
    let startKeyY = this.coo(startKey).y;
    let vx = this.coo(v.id).x;
    let vy = this.coo(v.id).y;

    alarmZoneKeys.map(k => {
      let kx = this.coo(k.id).x;
      let ky = this.coo(k.id).y;
      if (
        this.isBetween(ky, startKeyY, vy) &&
        this.isBetween(kx, startKeyX, vx)
      ) {
        return (k.type = selectType);
      }
    });
    this.setState({ alarmZoneKeys });
    this.setKeys(alarmZoneKeys);
  };
  mouseLeaveZone = () => {
    this.setState({
      mouseDownStatu: false
    });
  };
  clearAll = () => {
    let alarmZoneKeys = this.state.alarmZoneKeys;
    alarmZoneKeys.map(v => {
      return (v.type = false);
    });
    this.setState({ alarmZoneKeys });
    this.setKeys(alarmZoneKeys);
  };
  selectType = type => {
    this.setState({
      selectType: type,
      startKey: ''
    });
  };
  setKeys = alarmZoneKeys => {
    let zoneKeys = '';
    if (this.props.brand === '爱耳目') {
      alarmZoneKeys.map(v => {
        zoneKeys += v.type ? '0' : '1';
      });
    } else {
      alarmZoneKeys.map(v => {
        zoneKeys += v.type ? '1' : '0';
      });
    }
    this.props.getZoneKeys && this.props.getZoneKeys(zoneKeys);
  };

  render() {
    const { hideBar = false } = this.props;
    let { alarmZoneKeys, width, height, row, col } = this.state;
    return (
      <React.Fragment>
        <div
          className={this.props.className}
          style={{ zIndex: '500', position: 'absolute' }}
        >
          <div
            className="alarm-zone"
            onMouseLeave={this.mouseLeaveZone}
            style={{
              width: width,
              height: height,
              background: 'rgba(84, 173, 255, 0.05)'
            }}
          >
            {alarmZoneKeys.map(v => {
              let background = v.type ? 'rgba(84, 173, 255, 0.5)' : '';
              let itemWidth = width / row;
              let itemHeight = height / col;
              return (
                <div
                  key={v.id}
                  className="zone"
                  style={{
                    width: itemWidth,
                    height: itemHeight,
                    border: '1px dashed  rgba(84, 173, 255,0.7)',
                    background: background,
                    float: 'left'
                  }}
                  onMouseDown={this.mouseDownZone.bind(this, v)}
                  onMouseMove={this.mouseMoveZone.bind(this, v)}
                  onMouseUp={this.mouseUpZone.bind(this, v)}
                />
              );
            })}
          </div>
          {!hideBar && (
            <React.Fragment>
              <Button
                onClick={this.selectType.bind(this, true)}
                style={{
                  margin: '10px 10px 10px 0',
                  height: '28px',
                  fontSize: '12px'
                }}
                type="primary"
              >
                选取
              </Button>
              <Button
                onClick={this.selectType.bind(this, false)}
                style={{ margin: '10px', height: '28px', fontSize: '12px' }}
                type="primary"
              >
                擦除
              </Button>
              <Button
                onClick={this.clearAll}
                style={{ margin: '10px', height: '28px', fontSize: '12px' }}
              >
                清空
              </Button>
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default AlarmZoneView;
