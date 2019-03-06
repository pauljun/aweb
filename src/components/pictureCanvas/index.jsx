import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';
import PictureCanvas from './pictureCanvas';

class View extends React.Component {
  static create() {
    class Decorator extends React.Component {
      pictureViewer = Object.create({});
      static childContextTypes = {
        pictureViewer: PropTypes.object
      };
      change() {}
      getChildContext() {
        return {
          pictureViewer: this.pictureViewer
        };
      }
      render() {
        let WrapperComponent = this.getWrapperComponent();
        return (
          <WrapperComponent
            pictureViewer={this.pictureViewer}
            {...this.props}
          />
        );
      }
    }
    return WrappedComponent => {
      Decorator.prototype.getWrapperComponent = () => WrappedComponent;
      return Decorator;
    };
  }
  static contextTypes = {
    pictureViewer: PropTypes.object
  };
  render() {
    const { imgUrl, type, name, data, handleSearchPic, operations } = this.props;
    return (
      <div className="picture-viewer-wrapper">
        <div className="container">
          <PictureCanvas
            url={imgUrl}
            type={type}
            name={name}
            data={data}
            handleSearchPic={handleSearchPic} 
            operations={operations}
          />
        </div>
      </div>
    );
  }
}

export default View;
