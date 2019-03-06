import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { HomeComponent } from '../Home';
import { Provider } from 'mobx-react';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { hot } from 'react-hot-loader';
import LoginView from '../Login';
import Store from '../../store/GlobalStore';
import 'moment/locale/zh-cn';
import './index.scss';


window.GlobalStore = Store
class App extends Component {
  render() {
    return (
      <LocaleProvider locale={zh_CN}>
        <Provider {...Store}>
          <BrowserRouter>
            <Switch>
              <Route exact path="/login" render={() => <LoginView />} />
              <Route exact path="/login/:id" render={() => <LoginView />} />
              <Route
                path="/:tabIndex/:module"
                render={() => <HomeComponent />}
              />
              <Route
                path="/"
                render={() => <HomeComponent isRedirect={true} />}
              />
            </Switch>
          </BrowserRouter>
        </Provider>
      </LocaleProvider>
    );
  }
}
export default hot(module)(App);
