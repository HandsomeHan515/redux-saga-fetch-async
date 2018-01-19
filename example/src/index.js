import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import User from './User';
import { Provider, reduxInit } from './redux-saga-async';

const address = {
  users: 'https://api.github.com/users',
}

const lists = Object.keys(address)

const configList = lists.map((item, index) => {
  return { id: item, addr: Object.values(address)[index], hasCert: false }
})

const { store } = reduxInit(configList)

ReactDOM.render(
  <Provider store={store}>
    <User />
  </Provider>
  , document.getElementById('root'));
registerServiceWorker();
