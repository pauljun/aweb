import isEqualWith from '../isEqualWith';

export function shouldComponentUpdate(component) {
  const shouldCustomUpdate = component.prototype.shouldComponentUpdate;
  if (!shouldCustomUpdate) {
    component.prototype.shouldComponentUpdate = function(nextProps, nextState) {
      let oldProps, newProps;
      if (this.props.children) {
        const { children, ...props } = this.props;
        oldProps = props;
      } else {
        oldProps = this.props;
      }
      if (nextProps.children) {
        const { children, ...props } = nextProps;
        newProps = props;
      } else {
        newProps = nextProps;
      }
      const isPropsEqual = isEqualWith(oldProps, newProps);
      const isStateEqual = isEqualWith(this.state, nextState);
      if (
        (!isPropsEqual && !isStateEqual) ||
        (!isPropsEqual && isStateEqual) ||
        (isPropsEqual && !isStateEqual)
      ) {
        return true;
      }
      if (isPropsEqual && isPropsEqual) {
        return false;
      }
    };
  }
}
