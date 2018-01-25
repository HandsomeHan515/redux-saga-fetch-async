import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import { Provider, reduxInit } from './redux-saga-async';

// import User from './User';
import Ad from './Ad';

const address = {
  users: 'https://api.github.com/users',
  ads: 'http://api.handsomehan.cn:10001/v1/ads/',
}

const token = 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNTE2NDEzMzIzLCJ1c2VyX2lkIjoxLCJlbWFpbCI6bnVsbH0.2lB5WfjSGLn4g2kFLZq54BADsQ2y10ilt-0JtF6Ch40'

let headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': token
}

const configList = [
  { id: 'users', addr: address.users },
  { id: 'ads', addr: `${address.ads}?limit=2`, headers: headers }
]

const { store } = reduxInit(configList)

ReactDOM.render(
  <Provider store={store}>
    <Ad />
  </Provider>
  , document.getElementById('root'));
registerServiceWorker();
