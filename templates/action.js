/**
 * fetch status
 * @REQUEST 
 * @SUCCESS
 * @FAILURE
 */
export const REQUEST = '__REQUEST';
export const SUCCESS = '__SUCCESS';
export const FAILURE = '__FAILURE';

/**
 * actions
 * @get
 * @create
 * @update
 * @del
 */
export const LIST = '__LIST';
export const ADD_ENTITIES = '__ADD_ENTITIES';
export const ADD_RESULTS = '__ADD_RESULTS';

export const CREATE = '__CREATE';
export const CREATE_ENTITIES = '__CREATE_ENTITIES';
export const CREATE_RESULTS = '__CREATE_RESULTS';

export const UPDATE = '__UPDATE';
export const UPDATE_ENTITIES = '__UPDATE_ENTITIES';
export const UPDATE_RESULTS = '__UPDATE_RESULTS';

export const DEL = '__DEL';
export const DEL_ENTITIES = '__DEL_ENTITIES';
export const DEL_RESULTS = '__DEL_RESULTS';

/**
 * next page
 */
export const NEXT_PAGE = '__NEXT_PAGE'
export const NEXT_PAGE_ENTITIES = '__NEXT_PAGE_ENTITIES'
export const NEXT_PAGE_RESULTS = '__NEXT_PAGE_RESULTS'



export const actions = name => {
  return [
    LIST, ADD_ENTITIES, ADD_RESULTS,
    CREATE, CREATE_ENTITIES, CREATE_RESULTS,
    UPDATE, UPDATE_ENTITIES, UPDATE_RESULTS,
    DEL, DEL_ENTITIES, DEL_RESULTS,
    REQUEST, SUCCESS, FAILURE,
    NEXT_PAGE, NEXT_PAGE_ENTITIES, NEXT_PAGE_RESULTS
  ].reduce((action, type) => {
    action[type] = `${type}_${name}`
    return action
  }, {});
}

const action = (type, payload = {}) => ({ type, payload });

export const actionMethods = actions => {
  const relation = {
    'get': LIST,
    'create': CREATE,
    'update': UPDATE,
    'del': DEL,
    'nextPage': NEXT_PAGE
  }

  return ['get', 'create', 'update', 'del', 'nextPage'].reduce((acc, type) => {
    acc[type] = payload => action(actions[relation[type]], payload)
    return acc
  }, {});
}
