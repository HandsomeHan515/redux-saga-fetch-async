import { schema } from 'normalizr';

export const userSchema = new schema.Entity('users');

export const stateSchema = {
  users: [userSchema],
}

export const appState = {
  results: {

  },
  entities: {

  },
  status: {

  }
}