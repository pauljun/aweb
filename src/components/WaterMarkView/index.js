import React from 'react';
import Stores from '../../store/GlobalStore';
import Image from '../Image';
import './index.scss';

class WaterMakerCorsView extends React.Component {
  state = {
    isError: false
  };
  onError = () => {
    this.setState({ isError: true });
  };
  render() {
    const { isError } = this.state;
    let {
      className = '',
      src,
      background = true,
      type = 'face',
      ...rest
    } = this.props;
    return (
      <span
        className={`bg-sence-path ${className} ${isError ? 'error-img' : ''}`}
      >
        {background && !isError && (
          <span
            className="img-span"
            style={{
              backgroundImage: `url(${src})`
            }}
          />
        )}
        <Image
          style={{ display: background && !isError ? 'none' : 'block' }}
          src={src}
          onError={this.onError}
          {...rest}
        />
        {!isError && (
          <React.Fragment>
            <span
              className={`water-mark-span ${type === 'face' ? 'rt' : 'ct'}`}
            >
              {Stores.UserStore.userInfo.realName}
            </span>
            {type === 'face' && (
              <span className="water-mark-span lb">
                {Stores.UserStore.userInfo.realName
                  .split('')
                  .reverse()
                  .join('')}
              </span>
            )}
          </React.Fragment>
        )}
      </span>
    );
  }
}

export default WaterMakerCorsView;
