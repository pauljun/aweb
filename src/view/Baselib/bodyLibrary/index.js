import React, { Component } from 'react';
import {BusinessProvider}from 'src/utils/Decorator/BusinessProvider'
import BaselibContainer from '../components/BaselibContainer';

@BusinessProvider('bodyStore') 
export default class BodyLib extends Component {
  render() {
    return (
      <BaselibContainer 
        BaselibStore={this.props.bodyStore}
        baselibType='body'
      />
    )
  }
}

