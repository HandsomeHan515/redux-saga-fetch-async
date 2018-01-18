import { request } from './utils';
import { address } from './address';
import { configList } from './config';

var appCore = {
  token: 'JWT',
  request: request,
}

export { appCore, request, address, configList }