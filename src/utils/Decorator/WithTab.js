
import React from 'react';
import { Consumer } from '../../view/Layout/components/TabComponent';
/**
 * 获取多页签下当前的tabIndex 和 storeId
 * @param {ReactComponent} WrappedComponent
 */
export function withTab(WrappedComponent) {
  return class extends React.Component {
    render() {
      return (
        <Consumer>
          {context => (
            <WrappedComponent
              {...this.props}
              tabIndex={context.tabIndex}
              storeId={context.storeId}
            />
          )}
        </Consumer>
      );
    }
  };
}