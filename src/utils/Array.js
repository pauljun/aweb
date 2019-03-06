import { cloneDeep } from 'lodash';
export function ArrayFill(length, fill) {
  let arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(typeof fill === 'object' ? cloneDeep(fill) : fill);
  }
  return arr;
}
