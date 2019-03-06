import React, { Component } from 'react';
import {BusinessProvider}from 'src/utils/Decorator/BusinessProvider'
import BaselibContainer from '../components/BaselibContainer';


@BusinessProvider('faceStore') 
export default class BodyLib extends Component {
  render() {
    return (
      <BaselibContainer 
        BaselibStore={this.props.faceStore}
        baselibType='face'
      />
    )
  }
}
