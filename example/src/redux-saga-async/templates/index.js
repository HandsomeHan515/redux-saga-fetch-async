import { actions, actionMethods } from "./action";
import { getReducers } from './reducer';
import { watchingSagas, appSaga } from "./saga";
import { appState } from './store';

const handsome = {}

/**
 * @param config ={
    id: string,  default = undefined,
    addr: string, default = undefined, 
    schema: schema, default = undefined,
    schemaID: string, default = undefined,
    listActions: function, default = undefined,
    createActions: function, default = undefined,
    updateActions: function, default = undefined,
    headers: object, default = undefined,
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
    headers: undefined,
    hasPage: true
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

export { appSaga, appState, getReducers, register, handsome }
