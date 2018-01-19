import { createStore, compose, applyMiddleware, bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';
import createSagaMiddleware from 'redux-saga';

import { handsome, appReducer, appState, appSaga, reduxSOP } from './templates';

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

const store = createStore(
  appReducer,
  appState,
  enhancer,
)

sagaMiddleware.run(appSaga)

const combineData = (result, entities) => (result.map(item => entities[item]));

export { store, Provider, handsome, combineData, bindActionCreators, connect, reduxSOP }