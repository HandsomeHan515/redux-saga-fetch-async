import { handsome } from './index';
import * as actions from './action';
import _ from 'lodash';

export function changeStatus(types) {
  const [req, success, failure] = types

  return function updateStatus(state = {}, action) {
    switch (action.type) {
      case req:
        return Object.assign({}, state, {
          isFetching: true
        })
      case success:
        return Object.assign({}, state, {
          isFetching: false,
        })
      case failure:
        return Object.assign({}, state, {
          isFetching: false,
          errMsg: action.errMsg
        })
      default:
        return state
    }
  }
}

export const changeEntities = types => {
  const [add, create, update, del, next] = types

  return function updateStatus(state = {}, action) {
    switch (action.type) {
      case add:
        if (!action.payload) {
          return {}
        }
        return Object.assign({}, action.payload)

      case del:
        return _.omit(state, [action.id])

      case update:
      case create:
        return Object.assign({}, state, { [action.payload.id]: action.payload })

      case next:
        return Object.assign({}, state, action.payload)

      default:
        return state
    }
  }
}

export const changeResults = types => {
  const [add, create, del, next] = types

  return function updateStatus(state = [], action) {
    switch (action.type) {
      case add:
        if (!action.payload) {
          return []
        }
        return _.cloneDeep(action.payload)

      case del:
        return state.filter(item => item !== action.id)

      case create:
        let tmp = state.slice()
        tmp.push(action.payload.id)
        return tmp

      case next:
        let ns = state.concat(action.payload)
        return [...new Set(ns)]

      default:
        return state
    }
  }
}

export const getReducers = type => {
  let combineReducers = {}
  for (let key in handsome) {
    if (handsome.hasOwnProperty(key)) {
      let acs = handsome[key].actions
      if (type === 'results') {
        combineReducers[key] = changeResults([
          acs[actions.ADD_RESULTS],
          acs[actions.CREATE_RESULTS],
          acs[actions.DEL_RESULTS],
          acs[actions.NEXT_PAGE_RESULTS]
        ])
      } else if (type === 'entities') {
        combineReducers[key] = changeEntities([
          acs[actions.ADD_ENTITIES],
          acs[actions.CREATE_ENTITIES],
          acs[actions.UPDATE_ENTITIES],
          acs[actions.DEL_ENTITIES],
          acs[actions.NEXT_PAGE_ENTITIES]
        ])
      } else {
        combineReducers[key] = changeStatus([
          acs[actions.REQUEST],
          acs[actions.SUCCESS],
          acs[actions.FAILURE],
        ])
      }
    }
  }

  // console.log('comniner %o reducers: %o', type, combineReducers)
  return combineReducers
}
