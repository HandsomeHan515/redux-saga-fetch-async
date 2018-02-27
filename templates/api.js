import { normalize } from 'normalizr';
import { request } from '../service/';

export const get = (config, schema) => request(config)
  .then(resp => {
    let rsp = {}
    if (!resp.results) {
      rsp = {
        count: null,
        previous: null,
        next: null,
        results: resp
      }
    } else {
      rsp = resp
    }

    let schemaData = normalize(rsp, schema)
    const { count, previous, next } = schemaData.result
    Object.assign(schemaData.entities, { count, previous, next })
    return schemaData
  })

const base = config => request(config).then(resp => resp);

export const list = config => base(config);

export const create = config => base(
  Object.assign({}, {
    method: 'POST',
  }, config)
);

export const update = config => base(
  Object.assign({}, {
    method: 'PUT',
  }, config)
);

export const del = config => base(
  Object.assign({}, {
    method: 'DELETE',
    isJson: false,
  }, config)
)