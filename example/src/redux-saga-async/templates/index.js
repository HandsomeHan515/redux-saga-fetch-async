import { combineReducers } from 'redux';
import { schema } from 'normalizr';

import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';

import { actions, actionMethods } from "./action";
import { getReducers } from './reducer';
import { watchingSagas, appSaga } from "./saga";
import { appState } from './store';
import { configList } from '../service';

export const handsome = {}

/**
 * @param config ={
    id: string,  default = undefined,
    addr: string, default = undefined, 
    schema: schema, default = undefined,
    schemaID: string, default = undefined,
    listActions: function, default = undefined,
    createActions: function, default = undefined,
    updateActions: function, default = undefined,
    hasCert: boolean, default = true,
  }
 */

const register = config => {
  let cfg = Object.assign({}, {
    id: '',
    addr: undefined,
    schema: undefined,
    schemaID: undefined,
    listActions: undefined,
    createActions: undefined,
    updateActions: undefined,
    delActions: undefined,
    hasNetStatus: true,
    isEntity: true,
    hasCert: true,
  }, config);

  if (!cfg.id) {
    return;
  }

  let sagaConfig = Object.assign({}, { type: cfg.id }, cfg);

  let act = {}
  act.id = cfg.id;
  act.actions = actions(cfg.id);
  act.methods = actionMethods(act.actions);
  act.sagas = watchingSagas(sagaConfig);

  handsome[cfg.id] = act
}

const reduxSOP = () => {
  configList.map(item => {
    const tmpSchema = new schema.Entity(item.id);

    item.schemaID = item.id
    item.schema = { results: [tmpSchema] }

    register(item)
    return false
  })
}

reduxSOP()

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

const combineData = (result, entities) => (result.map(item => entities[item]));

export { combineData, Provider, store, reduxSOP }
