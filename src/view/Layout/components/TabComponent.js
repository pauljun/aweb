import React, { createContext } from 'react';
import { inject } from 'mobx-react';
import NoPage from '../../../components/NoPage';
import { withRouter } from 'react-router-dom';

const TabContext = createContext(null);
const { Provider, Consumer } = TabContext;
export { Provider, Consumer };

@withRouter
@inject('TabStore')
export default class TabComponent extends React.Component {
  constructor(props) {
    super(props);
    // const { tabIndex, storeId } = props;
    // this.state = {
    //   tabIndex,
    //   storeId
    // };
    // this.isRender = false;
  }
  shouldComponentUpdate(nextProps) {
    const { module, match, TabStore, location } = nextProps;
    const { tabIndex } = match.params;
    const { activeTab } = TabStore;
    if (activeTab === this.props.storeId) {
   
      return true;
    } else {
      return false;
    }

    // if (
    //   (tabIndex === this.state.tabIndex && activeTab === this.state.storeId) ||
    //   module !== this.props.module ||
    //   location.pathname !== this.props.location.pathname ||
    //   location.search !== this.props.location.search
    // ) {
    //   return true
    // }

    // return !this.isRender
  }
  render() {
    // const { tabIndex, storeId } = this.state;
    const { module, location,tabIndex, storeId } = this.props;
    const Component = module ? module.component : null;
    //this.isRender = true;
    return (
      <Provider value={{ tabIndex, storeId }}>
        <Consumer>
          {context =>
            Component ? (
              <Component
                location={location}
                tabIndex={context.tabIndex}
                storeId={context.storeId}
              />
            ) : (
              <NoPage />
            )
          }
        </Consumer>
      </Provider>
    );
  }
}
