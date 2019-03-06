import znqjimg from 'src/assets/img/mapicon/znqj.svg';
import qjimg from 'src/assets/img/mapicon/qj.svg';
import zpjimg from 'src/assets/img/mapicon/zpj.svg';
import mjimg from 'src/assets/img/mapicon/mj.svg';
import zjimg from 'src/assets/img/mapicon/zj.svg';
import dbimg from 'src/assets/img/mapicon/db.svg';
import wifiimg from 'src/assets/img/mapicon/wifi.svg';

import { qj, znxj, zpj, db, mj, zj, wifi } from '../DeviceLib';

/**根据设备类型和状态获取设备展示图标 */
export const getCameraTypeIcon = (type, status) => {
  const onLine = status * 1 === 1;
  let option = {};
  if (znxj.value == type) {
    option.url = znqjimg;
    option.color = !onLine ? '#ccc' : 'rgba(255, 156, 84, 1)';
    option.bgColor = !onLine ? '#ccc' : '#17bc84';
    option.icon = 'icon-_Camera__Main1';
  }
  if (qj.value == type) {
    option.url = qjimg;
    option.color = !onLine ? '#ccc' : 'rgba(43, 153, 255, 1)';
    option.bgColor = !onLine ? '#ccc' : '#17bc84';
    option.icon = 'icon-_Camera__Main';
  }
  if (zpj.value == type) {
    option.url = zpjimg;
    option.color = !onLine ? '#ccc' : 'rgba(193, 100, 207, 1)';
    option.bgColor = !onLine ? '#ccc' : '#17bc84';
    option.icon = 'icon-_Camera__Main3';
  }
  if (db.value == type) {
    option.url = dbimg;
    option.color = !onLine ? '#ccc' : 'rgba(255, 156, 84, 1)';
    option.bgColor = !onLine ? '#ccc' : '#17bc84';
    option.icon = 'icon-_Alarm__Main1';
  }
  if (mj.value.indexOf(type) > -1) {
    option.url = mjimg;
    option.color = !onLine ? '#ccc' : 'rgba(255, 156, 84, 1)';
    option.bgColor = !onLine ? '#ccc' : '#17bc84';
    option.icon = 'icon-_Door__Main';
  }
  if (zj.value == type) {
    option.url = zjimg;
    option.color = !onLine ? '#ccc' : 'rgba(255, 156, 84, 1)';
    option.bgColor = !onLine ? '#ccc' : '#17bc84';
    option.icon = 'icon-Dataicon__Dark';
  }
  if (wifi.value == type) {
    option.url = wifiimg;
    option.color = !onLine ? '#ccc' : 'rgba(255, 156, 84, 1)';
    option.bgColor = !onLine ? '#ccc' : '#17bc84';
    option.icon = 'icon-_Wifi__Green_Dark';
  }

  return option;
};
