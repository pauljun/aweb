import { isEqualWith } from 'lodash';

export default function(objValue, othValue) {
  return isEqualWith(objValue, othValue, customizer);
}

function customizer(objValue, othValue) {
  if (!objValue || !othValue) {
    return objValue === othValue;
  }
  let flag = true;
  let keys = Object.keys(objValue);
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i];
    const objItem = objValue[key];
    const othItem = othValue[key];
    if (Object.prototype.toString.call(objItem) === '[object Object]') {
      if (!isEqualWith(objItem, othItem, customizer)) {
        flag = false;
        break;
      }
    } else {
      if (objValue[keys[i]] !== othValue[keys[i]]) {
        flag = false;
        break;
      }
    }
  }
  return flag;
}
