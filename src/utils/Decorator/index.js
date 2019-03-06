import React from 'react';
import Log from 'src/libs/Logger';
import ErrorBoundary from '../../components/ErrorBoundary';

/**
 * 不可修改
 * @param {Object} target
 * @param {string} name
 * @param {object.descriptor} descriptor
 */
export function readonly(target, name, descriptor) {
  descriptor.writable = false;
  return descriptor;
}

/**
 * 不可枚举
 * @param {Object} target
 * @param {string} name
 * @param {object.descriptor} descriptor
 */
export function unenumerable(target, name, descriptor) {
  descriptor.enumerable = false;
  return descriptor;
}

/**
 * 公共日志方法注入
 * @param {string} name
 * @param {Boolean} isPreserveLog
 * @param {Object} config
 */
export function Logger(name, isPreserveLog, config) {
  return function(component) {
    component.prototype.Logger = new Log(
      name,
      isPreserveLog,
      config ? config : {}
    );
    if (React.isValidElement(component)) {
      let unmount = component.prototype.componentWillUnmount;
      component.prototype.componentWillUnmount = function() {
        unmount.call(this);
        this.Logger && this.Logger.destory();
        this.Logger = null;
      };
    }
  };
}

/**
 * 添加onRef方法获取组件
 * @param {Component} WrappedComponent
 */
export function onRef(WrappedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.WrappedComponent = React.createRef();
    }
    componentDidMount() {
      this.props.onRef && this.props.onRef(this.WrappedComponent.current);
    }
    render() {
      return <WrappedComponent ref={this.WrappedComponent} {...this.props} />;
    }
  };
}

/**
 * 错误边界处理
 * @param {Component} WrappedComponent
 */
export function errorBoundary(WrappedComponent) {
  return React.forwardRef((props, ref) => (
    <React.Fragment>
      <WrappedComponent {...props} ref={ref} />
    </React.Fragment>
  ));
}
// 处理location.search的方法,将字符串转换成json
export function searchFormat(search = '') {
  let params = {};
  if (search.length) {
    search = search.indexOf('?') < 0 ? search : search.substr(1);
    let a = search.split('&');
    let b = a.map(v => v.split('='));
    b.map(v => (params[v[0]] = v[1]));
  }
  return params;
}
