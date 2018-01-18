import { request } from './utils';
import { address, serviceDomain } from './address';

var appCore = {
  token: 'JWT',
  request: request,
}

export { appCore, request, address, serviceDomain }