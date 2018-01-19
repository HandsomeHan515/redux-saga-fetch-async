import { combineReducers, createStore, compose, applyMiddleware, bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { schema } from 'normalizr';

import { handsome, getReducers, appState, appSaga, register } from './templates';


const reduxInit = configList => {
  // console.log('configList: %o', configList)
  configList.map(item => {
    const tmpSchema = new schema.Entity(item.id);

    item.schemaID = item.id
    item.schema = { results: [tmpSchema] }

    register(item)
    return false
  })

  const results = combineReducers(
    getReducers('results')
  )

  const entities = combineReducers(
    getReducers('entities')
  )

  const status = combineReducers(
    getReducers('status')
  )

  const appReducer = combineReducers({
    results,
    entities,
    status,
  })

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

  return { store }
}

const combineData = (result, entities) => (result.map(item => entities[item]));

export { Provider, combineData, bindActionCreators, connect, handsome, reduxInit }