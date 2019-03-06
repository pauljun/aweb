import React from 'react';

const mapContext = React.createContext(null);

export const Provider = mapContext.Provider;
export const Consumer = mapContext.Consumer;

export function videoModule(Component) {
  class VideoWithModule extends React.Component {
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
    <VideoWithModule {...props} forwardRef={ref} />
  ));
}
