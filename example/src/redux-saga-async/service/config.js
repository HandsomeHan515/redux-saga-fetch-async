import { address } from './address';

const lists = Object.keys(address);

export const configList = lists.map((item, index) => {
  return { id: item, addr: Object.values(address)[index], hasCert: false }
})

