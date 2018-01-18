import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import { store, Provider } from './redux-saga-async';

import User from './User';

ReactDOM.render(
  <Provider store={store}>
    <User />
  </Provider>
  , document.getElementById('root'));
registerServiceWorker();
