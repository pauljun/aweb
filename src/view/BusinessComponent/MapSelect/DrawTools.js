import React from 'react';
import IconFont from '../../../components/IconFont';

export default class DrawTools extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: {
        aiCamera: true,
        ballCamera: true,
        captureCamera: true
      },
      status: {
        online: true,
        offline: true
      }
    };
  }

  render() {
    const {
      startDrawRect,
      clearDraw,
      startDrawCircle,
      startDrawPolygon
    } = this.props;
    return (
      <div className="map-select-draw-tools">
        <div className="tools-layout">
          <div
            className="tools-draw"
            onClick={() => startDrawRect && startDrawRect()}
          >
            <IconFont type="icon-Choose__Main1" theme="outlined" />
            框选
          </div>
          <div
            className="tools-draw"
            onClick={() => startDrawCircle && startDrawCircle()}
          >
            <IconFont type="icon-Choose__Main" theme="outlined" />
            圆选
          </div>

          <div
            className="tools-draw"
            onClick={() => startDrawPolygon && startDrawPolygon()}
          >
            <IconFont type="icon-Choose__Main2" theme="outlined" />
            多边形
          </div>
          <div className="tools-draw" onClick={() => clearDraw && clearDraw()}>
            <IconFont type="icon-Close_Main1" theme="outlined" />
            清除
          </div>
        </div>
      </div>
    );
  }
}
