import React from 'react';
import { Provider, inject } from 'mobx-react';
import ModuleStore from '../../store/Module';
import { isEmptyObject } from '../index';

/**
 * 注入业务组件的Stores,同时可注入globalstore 注入后组件不需要再inject
 * @param  {...any} props
 */
export function BusinessProvider(...props) {
  let store = {};
  props.map(storeName => {
    if (ModuleStore[storeName]) {
      store[storeName] = ModuleStore[storeName];
    } else {
      // throw new Error(
      //   `不存在${storeName},请查看/src/store/Module/index.js 是否挂载！`
      // );
    }
  });
  return function(WrappedComponent) {
    const ModuleInject = inject(...props)(WrappedComponent);
    return class extends React.Component {
      render() {
        return isEmptyObject(store) ? (
          <ModuleInject {...this.props} />
        ) : (
          <Provider {...store}>
            <ModuleInject {...this.props} />
          </Provider>
        );
      }
    };
  };
}
