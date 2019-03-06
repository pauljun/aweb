import React from 'react';
import Map from './MapComponent';
export function providerMap(className) {
  return function (WrapComponent) {
    return class extends React.Component {
      render() {
        return (
          <Map className={className}>
            <WrapComponent {...this.props} />
          </Map>
        );
      }
    };
  }

}
