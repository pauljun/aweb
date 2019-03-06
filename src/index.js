import React from 'react';
import ReactDOM from 'react-dom';
import App from './view/App';
import registerServiceWorker from './registerServiceWorker';
import 'html5-player/libs/assets/css/style.css';

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);

registerServiceWorker();
