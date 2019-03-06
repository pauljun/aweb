import React from 'react';
import PropTypes from 'prop-types';
import PlayStatusLib from '../status';
import {stopPropagation} from '../../../utils'

export default class VideoEvent extends React.Component {
  static contextTypes = {
    player: PropTypes.object.isRequired,
    setPlayStatus: PropTypes.func.isRequired,
    playStatus: PropTypes.string
  };

  componentWillUnmount() {
    const { player } = this.context;
    //player.off('error', this.captureError);
    player.off('loadstart', this.loadingAction);
    player.off('waiting', this.loadingAction);
    player.off('ready', this.readyAction);
    player.off('canplay', this.canplayAction);
    player.off('play', this.playAction);
    player.off('pause', this.pauseAction);
    player.off('seek',this.loadingAction)
    player.off('click', this.clickAction);
  }

  componentDidMount() {
    
    const { player } = this.context;
    //player.on('error', this.captureError);
    player.on('loadstart', this.loadingAction);
    player.on('waiting', this.loadingAction);
    player.on('ready', this.readyAction);
    player.on('canplay', this.canplayAction);
    player.on('play', this.playAction);
    player.on('pause', this.pauseAction);
    player.on('seek',this.loadingAction)

   player.on('click', this.clickAction);
  }

  clickAction = (event) => {
    const { onClick } = this.props;
    stopPropagation(event)
    onClick && onClick()
  }
  captureError = event => {
    const { isEmpty } = this.props;
    if (!isEmpty) {
      console.log(event)
      this.context.setPlayStatus(PlayStatusLib.Error);
    }
  };
  loadingAction = event => {
    const { playStatus } = this.context;
    const { isEmpty } = this.props;
    if (!isEmpty && playStatus !== PlayStatusLib.ReConnect) {
      this.context.setPlayStatus(PlayStatusLib.Loading);
    }
  };
  canplayAction = event => {
    this.context.setPlayStatus(PlayStatusLib.Canplay);
  };
  readyAction = event => {
    this.context.setPlayStatus(PlayStatusLib.Ready);
  };
  playAction = event => {
    this.context.setPlayStatus(PlayStatusLib.Play);
  };
  pauseAction = event => {
    this.context.setPlayStatus(PlayStatusLib.Pause);
  };
  render() {
    return null;
  }
}
