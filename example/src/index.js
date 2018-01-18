import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';

import { appSaga, appState, appReducer } from './templates';

import User from './User';

let sagaMiddleware = createSagaMiddleware()
let enhancer = {}

if (process.env.NODE_ENV === 'production') {
  enhancer = compose(
    applyMiddleware(sagaMiddleware),
  )
} else {
  enhancer = compose(
    applyMiddleware(sagaMiddleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
}

export const store = createStore(
  appReducer,
  appState,
  enhancer,
)

sagaMiddleware.run(appSaga)

ReactDOM.render(
  <Provider store={store}>
    <User />
  </Provider>
  , document.getElementById('root'));
registerServiceWorker();
