import ReactDOM from 'react-dom';
import {
  getAMapCameraIcon,
  getMapIndexContent
} from '../../../../utils/CameraIconTools';

export function createIcon(image, w = 20, h = 20) {
  return new AMap.Icon({
    size: new AMap.Size(w, h),
    image
  });
}
/**
 * Marker模拟infoWindow
 * @param {*} Content
 * @param {*} position
 */

export function createContentMarker(
  Content,
  position,
  offset = [0, 0],
  id,
  className = ''
) {
  let Div = document.createElement('div');
  Div.className = className;
  Div.id = id;
  ReactDOM.render(Content, Div);
  let marker = new AMap.Marker({
    content: Div,
    position: position,
    offset: new AMap.Pixel(...offset),
    animation: 'AMAP_ANIMATION_NONE',
    zIndex: 102,
    bubble: false
  });
  return marker;
}

/**
 * 创建marker对象
 */
export function createMarker(point, options = {}, icon, active = false, color) {
  let item = {
    position: point.position || [point.longitude, point.latitude],
    offset: options.offset
      ? new AMap.Pixel(...options.offset)
      : new AMap.Pixel(-15, -15),
    animation: options.animation ? options.animation : 'AMAP_ANIMATION_NONE',
    draggable: options.draggable || false,
    raiseOnDrag: true,
    bubble: false,
    topWhenClick: true
  };
  if (icon) {
    item.icon = createIcon(icon, options.w, options.h);
  } else {
    item.content = getAMapCameraIcon(point, active, color);
  }
  let marker = new AMap.Marker(item);
  marker.setExtData({
    id: point.id,
    position: [point.longitude, point.latitude],
    name: point.deviceName,
    type: point.deviceType,
    _deviceInfo: point,
    status: point.deviceData
  });
  marker.on('mouseover', event => {
    marker.setzIndex(101);
    marker.setLabel({ content: point.deviceName || point.cameraName });
    options.mouseover && options.mouseover(point, event);
  });

  marker.on('mouseout', event => {
    marker.setLabel({ content: '' });
    marker.setzIndex(100);
    options.mouseout && options.mouseout(point, event);
  });

  if (options.click) {
    marker.on('click', event => {
      options.click(point, event);
    });
  }
  if (options.dblclick) {
    marker.on('dblclick', event => {
      options.dblclick(point, event);
    });
  }
  if (options.dragend) {
    marker.on('dragend', event => {
      options.dragend(point, event, [event.lnglat.lng, event.lnglat.lat]);
    });
  }
  return marker;
}

export function createIndexMaker({
  point,
  index,
  options = {},
  active = false,
  color,
  activeColor
}) {
  let item = {
    position: point.position || [point.longitude, point.latitude],
    offset: options.offset
      ? new AMap.Pixel(...options.offset)
      : new AMap.Pixel(-15, -15),
    animation: options.animation ? options.animation : 'AMAP_ANIMATION_NONE',
    draggable: options.draggable || false,
    raiseOnDrag: true,
    bubble: false,
    topWhenClick: true,
    content: getMapIndexContent({ index, color, activeColor, active })
  };
  let marker = new AMap.Marker(item);
  marker.setExtData({
    id: point.id,
    position: [point.longitude, point.latitude],
    name: point.deviceName,
    pointInfo: point
  });
  marker.on('mouseover', event => {
    marker.setzIndex(101);
    marker.setLabel({ content: point.deviceName || point.cameraName });
    options.mouseover && options.mouseover(point, event);
  });

  marker.on('mouseout', event => {
    marker.setLabel({ content: '' });
    marker.setzIndex(100);
    options.mouseout && options.mouseout(point, event);
  });

  if (options.click) {
    marker.on('click', event => {
      options.click(point, event);
    });
  }
  if (options.dblclick) {
    marker.on('dblclick', event => {
      options.dblclick(point, event);
    });
  }
  if (options.dragend) {
    marker.on('dragend', event => {
      options.dragend(point, event, [event.lnglat.lng, event.lnglat.lat]);
    });
  }
  return marker;
}
