import { take, put, call, fork, all } from 'redux-saga/effects';
import { handsome } from './index';
import * as apis from './api';

function* wacthGetMethods(config) {
  const { hasNetStatus, type, addr, schema, schemaID, cert } = config

  while (true) {
    const { payload } = yield take(handsome[type].actions.__LIST);

    if (hasNetStatus) {
      yield put({ type: handsome[type].actions.__REQUEST });
    }

    try {
      let apiConfig = {
        url: payload.url ? payload.url : addr,
        cert,
      }

      let data = yield call(apis.get, apiConfig, schema);
      const { count, previous, next } = data.result

      Object.assign(data.entities[schemaID], { count, previous, next });

      yield put({ type: handsome[type].actions.__ADD_ENTITIES, payload: data.entities[schemaID] });
      yield put({ type: handsome[type].actions.__ADD_RESULTS, payload: data.result.results });

      if (hasNetStatus) {
        yield put({ type: handsome[type].actions.__SUCCESS });
      }
    } catch (error) {
      yield put({ type: handsome[type].actions.__FAILURE });
    }
  }
}

function* watchCreateMethods(config) {
  const { isEntity, hasNetStatus, type, addr, createActions, cert } = config

  while (true) {
    const { payload } = yield take(handsome[type].actions.__CREATE);

    if (hasNetStatus) {
      yield put({ type: handsome[type].actions.__REQUEST });
    }

    try {
      let apiConfig = {
        url: addr,
        body: JSON.stringify(payload),
        cert,
      }

      let created = yield call(apis.create, apiConfig);

      if (isEntity) {
        yield put({ type: handsome[type].actions.__CREATE_ENTITIES, payload: created })
        yield put({ type: handsome[type].actions.__CREATE_RESULTS, payload: created })
      }

      if (createActions) {
        let relatedActions = createActions(payload, created);
        yield [
          ...relatedActions
        ]
      }

      if (hasNetStatus) {
        yield put({ type: handsome[type].actions.__SUCCESS })
      }
    } catch (error) {
      yield put({ type: handsome[type].actions.__FAILURE })
    }
  }
}

function* watchUpdateMethods(config) {
  const { isEntity, hasNetStatus, type, addr, updateActions, cert } = config

  while (true) {
    const { payload } = yield take(handsome[type].actions.__UPDATE);

    if (hasNetStatus) {
      yield put({ type: handsome[type].actions.__REQUEST });
    }

    try {
      let apiConfig = {
        url: `${addr}${payload.id}/`,
        body: JSON.stringify(payload),
        cert,
      }

      let updated = yield call(apis.update, apiConfig);

      if (isEntity) {
        yield put({ type: handsome[type].actions.__UPDATE_ENTITIES, payload: updated });
        yield put({ type: handsome[type].actions.__UPDATE_RESULTS, payload: updated });
      }

      if (updateActions) {
        let relatedActions = updateActions(payload, updated);
        yield [
          ...relatedActions
        ]
      }

      if (hasNetStatus) {
        yield put({ type: handsome[type].actions.__SUCCESS })
      }
    } catch (error) {
      yield put({ type: handsome[type].actions.__FAILURE });
    }

  }
}

function* watchDelMethods(config) {
  const { isEntity, hasNetStatus, type, addr, delActions, cert } = config

  while (true) {
    const { payload } = yield take(handsome[type].actions.__DEL);
    if (hasNetStatus) {
      yield put({ type: handsome[type].actions.__REQUEST });
    }

    try {
      let apiConfig = {
        url: `${addr}${payload.id}/`,
        cert,
      }

      yield call(apis.del, apiConfig);

      if (isEntity) {
        yield put({ type: handsome[type].actions.__DEL_RESULTS, id: payload.id })
        yield put({ type: handsome[type].actions.__DEL_ENTITIES, id: payload.id })
      }

      if (delActions) {
        let relatedActions = delActions(payload)
        yield [
          ...relatedActions
        ]
      }

      if (hasNetStatus) {
        yield put({ type: handsome[type].actions.__SUCCESS })
      }
    } catch (error) {
      yield put({ type: handsome[type].actions.__FAILURE });
    }
  }
}

function* watchNextPageMethods(config) {
  const { hasNetStatus, type, schema, schemaID, cert } = config

  while (true) {
    const { payload } = yield take(handsome[type].actions.__NEXT_PAGE);

    if (!payload.url) {
      return false
    }

    try {
      if (hasNetStatus) {
        yield put({ type: handsome[type].actions.__REQUEST })
      }

      let apiConfig = {
        url: payload.url,
        cert,
      }

      let data = yield call(apis.get, apiConfig, schema);
      const { count, previous, next } = data.result

      Object.assign(data.entities[schemaID], { count, previous, next });

      yield put({ type: handsome[type].actions.__NEXT_PAGE_ENTITIES, payload: data.entities[schemaID] });
      yield put({ type: handsome[type].actions.__NEXT_PAGE_RESULTS, payload: data.result.results });

      if (hasNetStatus) {
        yield put({ type: handsome[type].actions.__SUCCESS });
      }
    } catch (error) {
      yield put({ type: handsome[type].actions.__FAILURE });
    }
  }
}

export const watchingSagas = config => {
  return [
    fork(wacthGetMethods, config),
    fork(watchCreateMethods, config),
    fork(watchUpdateMethods, config),
    fork(watchDelMethods, config),
    fork(watchNextPageMethods, config)
  ]
}

export function* appSaga() {
  let sopSagas = []

  for (let key in handsome) {
    if (handsome.hasOwnProperty(key)) {
      handsome[key].sagas.map(item => sopSagas.push(item))
    }
  }

  yield all([
    ...sopSagas,
  ])
}