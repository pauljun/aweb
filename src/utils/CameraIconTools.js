import { cameraOrientation } from '../libs/Dictionary';
import { getCameraTypeIcon } from '../libs/Dictionary/mapIcon';

export function getAMapCameraIcon(point, active, bgIconColor) {
  let { url, color, bgColor } = getCameraTypeIcon(
    point.deviceType,
    point.deviceData
  );
  let score = 0;
  if (
    point.extJson &&
    point.extJson.extMap &&
    point.extJson.extMap.cameraOrientation
  ) {
    let result = cameraOrientation.filter(
      v => v.value === point.extJson.extMap.cameraOrientation.toString()
    );
    if (result.length) {
      score = result[0].score;
    }
  } else {
    color = 'transparent';
  }
  let Content = `<div class='map-icon-content'>
    <div class='bd' style='background-image: url(${url});background-color:${
    active ? '#ffaa00' : bgIconColor || bgColor
  };background-size:16px'></div>
    <div class='circle' style='border-color: ${color} transparent transparent transparent; transform: rotate(${score}deg)'></div>
  </div>`;
  return Content;
}

export function getMapIndexContent({
  index,
  color = '#17bc84',
  active,
  activeColor = '#ffaa00'
}) {
  let Content = `<div class='map-icon-content map-text-content'>
    <div class='bd' style='background-color:${
      active ? activeColor : color
    };background-size:16px'>${index}</div>
  </div>`;
  return Content;
}
