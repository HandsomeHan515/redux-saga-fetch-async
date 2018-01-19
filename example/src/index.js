import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import User from './User';
import { store, Provider, address } from './redux-saga-async';

address['ads'] = 'http://api.handsomehan.cn:10013/v1/ads/'

console.log(address)

ReactDOM.render(
  <Provider store={store}>
    <User />
  </Provider>
  , document.getElementById('root'));
registerServiceWorker();
