import React from 'react';
import MapSelect from '../../BusinessComponent/MapSelect/ModalMapSelect';
import OrgSelectModal from '../../BusinessComponent/OrgSelectDevice/OrgSelectModal';
import { Button, Slider } from 'antd';
import MoveContent from 'src/components/MoveContent'

import '../style/map.scss';

export default class MapView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  setSpeed = (value) => {
    console.log(value)
  }
  render() {
    return (
      <React.Fragment>
        <MoveContent size={{width:200,height:200}}><div style={{width:200,height:200,background:'#000'}}></div></MoveContent>
      </React.Fragment>
    );
  }
}
