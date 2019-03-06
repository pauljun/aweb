import React from 'react';

const mapContext = React.createContext(null);

export const Provider = mapContext.Provider;
export const Consumer = mapContext.Consumer;

export function map(Component) {
  class MapWithComponent extends React.Component {
    render() {
      const { forwardRef, ...props } = this.props;
      return (
        <Consumer>
          {context => <Component {...props} {...context} ref={forwardRef} />}
        </Consumer>
      );
    }
  }
  return React.forwardRef((props, ref) => (
    <MapWithComponent {...props} forwardRef={ref} />
  ));
}
