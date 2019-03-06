export function getPosition(obj) {
  //获取某元素以浏览器左上角为原点的坐标
  var t = obj.offsetTop; //获取该元素对应父容器的上边距
  var l = obj.offsetLeft; //对应父容器的上边距
  //判断是否有父容器，如果存在则累加其边距
  while ((obj = obj.offsetParent)) {
    //等效 obj = obj.offsetParent;while (obj != undefined)
    t += obj.offsetTop; //叠加父容器的上边距
    l += obj.offsetLeft; //叠加父容器的左边距
  }
  return { left:l, top:t };
}