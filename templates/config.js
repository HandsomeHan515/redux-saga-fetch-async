import { address } from '../service';
import * as state from './store';

export const configList = [
  { id: 'users', addr: address.users, schema: { results: [state.flowerSchema] }, schemaID: 'users', hasCert: false },
]