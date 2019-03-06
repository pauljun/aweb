import React from 'react';
import PropTypes from 'prop-types';
import IconFont from '../../../IconFont';
import { Popover } from 'antd';
import { map } from '../mapContext';
import { errorBoundary } from '../../../../utils/Decorator';
import '../style/map-reset.scss';

@errorBoundary
@map
export default class MapResetTools extends React.Component {
  componentWillMount() {
    this.props.init && this.props.init(this);
  }
  resetMap = () => {
    const { mapMethods } = this.props;
    mapMethods.resetMap();
  };
  mapZoom = zoom => {
    const { mapMethods } = this.props;
    mapMethods.setZoom(mapMethods.getZoom() + zoom);
  };
  render() {
    let {hideReset} = this.props
    return (
      <div className="map-reset-tool">
       {!hideReset ? <Popover
          placement="left"
          content="复位"
          overlayClassName="map-rest-tools-popup"
        >
          <div className="map-reset map-tool-icon" onClick={this.resetMap}>
            <IconFont type="icon-Reduction_Dark" />
          </div>
        </Popover> :
        <Popover
        placement="left"
        content="复位"
        overlayClassName="map-rest-tools-popup"
      >
        <div className="map-reset map-tool-icon" onClick={this.props.click}>
          <IconFont type="icon-Reduction_Dark" />
        </div>
      </Popover>
      }
        <div className="map-zoom">
          <Popover
            placement="left"
            content="放大"
            overlayClassName="map-rest-tools-popup"
          >
            <div className="map-tool-icon" onClick={() => this.mapZoom(1)}>
              <IconFont type="icon-Zoom__Light" />
            </div>
          </Popover>
          <Popover
            placement="left"
            content="缩小"
            onClick={() => this.mapZoom(-1)}
            overlayClassName="map-rest-tools-popup"
          >
            <div className="map-tool-icon">
              <IconFont type="icon-Zoom_-_Light" />
            </div>
          </Popover>
        </div>
      </div>
    );
  }
}
