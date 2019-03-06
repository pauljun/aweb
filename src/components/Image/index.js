import React from 'react';
import imagePath from './Card_TimeOver.svg';
import './index.scss'

export default class Image extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isError: null
    };
  }
  onError = (e, env) => {
    this.setState({ isError: true })
    this.props.onError && this.props.onError()
  }
  render() {
    const { isError } = this.state;
    const { src, defaultSrc = imagePath, ...props } = this.props;
    return (
      <img
        className={`${isError?'errorImg-size':''}`}
        src={isError ? defaultSrc : src}
        {...props}
        onError={this.onError}
      />
    );
  }
}
