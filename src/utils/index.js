import cookie from 'js-cookie';
import intl from 'react-intl-universal';
import locales from 'src/locale/index';
import { cloneDeep } from 'lodash';

/**
 * 获取缓存数据
 * @param {string} key
 * @param {string} type: 缓存类型 'local'(默认) / cookie / session;
 */
export function getCacheItem(key, type = 'local') {
  // key = user_id + '_' + key;
  let data;
  switch (type) {
    case 'cookie':
      data = cookie.get(key);
      break;
    case 'session':
      let strS = sessionStorage.getItem(key);
      try {
        data = JSON.parse(strS);
      } catch (e) {
        data = strS;
      }
      break;
    default:
      let strL = localStorage.getItem(key);
      try {
        data = JSON.parse(strL);
      } catch (e) {
        data = strL;
      }
      break;
  }
  return data;
}

/**
 * 获取缓存数据
 * @param {string} key
 * @param {any} value
 * @param {string} type: 缓存类型 'local'(默认) / cookie / session;
 */
export function setCacheItem(key, value, type = 'local') {
  // key = user_id + '_' + key;
  let data;
  switch (type) {
    case 'cookie':
      cookie.set(key, value);
      break;
    case 'session':
      sessionStorage.setItem(key, JSON.stringify(value));
      break;
    default:
      localStorage.setItem(key, JSON.stringify(value));
      break;
  }
  return data;
}

/**
 * 判断是否是空对象
 * @param {Object} data
 */
export function isEmptyObject(data) {
  return Object.keys(data).length === 0;
}

/**
 * 转换tree
 * @param {Array} treeData
 * @param {string} id
 * @param {string} pid
 */
export function computTreeList(list, id = 'id', pid = 'parentId', isNoDeep) {
  let treeData;
  if (!isNoDeep) {
    treeData = cloneDeep(list);
  } else {
    treeData = list;
  }
  let arr = [];
  treeData.forEach((item, index) => {
    let isParent = false;
    treeData.forEach(item2 => {
      if (item[pid] * 1 === item2[id] * 1) {
        isParent = true;
        !Array.isArray(item2.children) && (item2.children = []);
        item2.children.push(item);
      }
    });
    !isParent && arr.push(index);
  });
  return treeData.filter((item, index) => arr.indexOf(index) > -1);
}

/**
 * 处理location.search的方法,将字符串转换成json
 * @param {string} search
 */
export function searchFormat(search = '') {
  let params = {};
  if (search && search.length) {
    search = search.indexOf('?') < 0 ? search : search.substr(1);
    let a = search.split('&');
    let b = a.map(v => v.split('='));
    b.map(v => (params[v[0]] = v[1]));
  }
  return params;
}

// 编码解码url地址（地址若包含'&'符，会导致参数解析出错）
export function escapeUrl(url, isEscape = true) {
  return (url = isEscape ? escape(url) : unescape(url));
}

/**
 * 生成UUID
 */
export function uuid() {
  let s = [];
  let hexDigits = '0123456789abcdef';
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4';
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = '-';

  let uuidStr = s.join('');
  return uuidStr;
}

/**
 *
 * @param {Object} data
 * @param {String} type // String
 */
export function judgeType(data, type) {
  return Object.prototype.toString.apply(data) === `[object ${type}]`;
}

/**
 * 阻止冒泡的兼容
 * @param {*} e
 */
export function stopPropagation(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  } else {
    e.cancelBubble = true;
  }
}
/**
 * 初始化国际化
 * @param {*} currentLocale：需要初始化的语言
 * @param {*} callbak
 */
export function initLocal({ currentLocale }, callbak) {
  intl
    .init({
      currentLocale, // TODO: determine locale here
      locales
    })
    .then(callbak && callbak);
}

/**
 * 预留国际化方法
 * @param {string} str
 * @param {object} options：
 *          isKey: 需要使用str作为key值，默认false，
 *          Locale: 需要设置的语言, 默认中文，
 */
export function lan(str, options = {}) {
  let storage = localStorage.getItem('currentLocale');
  storage = storage ? JSON.parse(storage) : 'zh-CN';
  const currentLocale = options.Locale ? options.Locale : storage;
  if (options.isKey) {
    const key = currentLocale === 'zh-CN' ? str : `CHINESE.${str}`;
    // 是否使用str作为key值，适用于包含变量的国际化
    return intl.get(key, options);
  } else {
    if (currentLocale === 'zh-CN') {
      return intl.get('CHINESE', { value: str });
    }
    return intl.get(`CHINESE.${str}`).d(str);
  }
}

export function loadImage(imgUrl, noAjax) {
  return new Promise((resolve, reject) => {
    if (noAjax) {
      let img = document.createElement('img');
      !isCrosPath(imgUrl) && img.setAttribute('crossOrigin', 'Anonymous');
      img.setAttribute('src', imgUrl);
      img.addEventListener(
        'load',
        () => {
          resolve(img);
        },
        false
      );
    } else {
      const xhr = new XMLHttpRequest();
      xhr.open('get', imgUrl, true);
      xhr.responseType = 'blob';
      xhr.addEventListener('load', () => {
        if (this.status == 200) {
          let blob = this.response;
          let oFileReader = new FileReader();
          oFileReader.onloadend = e => {
            let image = new Image();
            image.src = e.target.result;
            resolve(image);
          };
          oFileReader.readAsDataURL(blob);
        }
      });
      xhr.addEventListener('error', function(err) {
        reject(err);
      });
      xhr.send();
    }
  });
}

const regCros = new RegExp(`^${window.location.origin}`);
export function isCrosPath(path) {
  return regCros.test(path);
}

export function toMoney(num) {
  num = num.toFixed(2);
  num = parseFloat(num);
  num = num.toLocaleString();
  return num; //返回的是字符串23,245.12保留2位小数
}
/*数字转为数组*/
export function toArray(num) {
  return num.toString().split('');
}

// 获取元素在页面中的绝对横坐标
export function getElementLeft(element) {
  let actualLeft =
    element.offsetLeft - parseFloat(element.style.marginLeft || 0);
  let current = element.offsetParent;
  if (current) {
    actualLeft -= parseFloat(current.style.paddingLeft || 0);
  }
  while (current !== null) {
    actualLeft += current.offsetLeft;
    current = current.offsetParent;
  }
  return actualLeft;
}
// 获取元素在页面中的绝对纵坐标
export function getElementTop(element) {
  let actualTop = element.offsetTop - parseFloat(element.style.marginTop || 0);
  let current = element.offsetParent;
  if (current) {
    actualTop -= parseFloat(current.style.paddingTop || 0);
  }
  while (current !== null) {
    actualTop += current.offsetTop;
    current = current.offsetParent;
  }
  return actualTop;
}
// 获取元素在页面中的实际位置
export function getDomPositionInPage(element) {
  const actualLeft = getElementLeft(element);
  const actualTop = getElementTop(element);
  return {
    top: actualTop,
    left: actualLeft
  };
}
/**
 * 飞入动画
 * @param {*} start:{clientX, clientY} 鼠标点击的位置
 * @param {*} url 图片src
 * @param {*} speed 动画速度
 * @param {*} target 目标dom
 * @param {*} posFix:{top:0, left:0 } 目标dom位置修正
 */
export function animateFly({
  start,
  url,
  speed = 1000,
  target,
  posFix = { top: 0, left: 0 }
}) {
  target = target ? target : document.querySelector('.media-library-btn');
  const targetPosition = getDomPositionInPage(target);
  const oImg = document.createElement('img');
  oImg.src = url;
  oImg.style.position = 'fixed';
  oImg.style.transition = `all ${speed / 1000}s ease`;
  oImg.style.zIndex = 999999;
  document.body.appendChild(oImg);
  // 滚动大小
  const scrollLeft =
    document.documentElement.scrollLeft || document.body.scrollLeft || 0;
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop || 0;
  const left = start.clientX + scrollLeft + 'px';
  const top = start.clientY + scrollTop + 'px';
  oImg.style.top = top;
  oImg.style.left = left;
  oImg.style.width = '160px';
  oImg.style.height = '90px';
  setTimeout(() => {
    oImg.style.top = targetPosition.top + posFix.top + 'px';
    oImg.style.left = targetPosition.left + posFix.left + 'px';
    oImg.style.opacity = 0.2;
    oImg.style.width = '16px';
    oImg.style.height = '16px';
  }, 100);
  setTimeout(() => {
    document.body.removeChild(oImg);
  }, speed + 500);
}
/**
 * 下载网络图片
 *  @param imgUrl: 下载地址
 *  @param title: 下载标题
 */
export function downloadLocalImage(imgUrl, title) {
  urlToBase64({ imgUrl, imgQuality: 0.8 }, base64Url => {
    tagAToDownload({
      url: base64Url,
      title
    });
  });
}

/**
 * 图片地址转base64
 */
export function urlToBase64(
  { imgUrl, imgQuality = 1, width, height },
  callback
) {
  let img = document.createElement('img');
  // crossOrigin属性必须在src之前，否则会报错！！
  img.setAttribute('crossOrigin', 'anonymous');
  img.src = imgUrl;
  img.onload = () => {
    width = width ? width : img.width;
    height = height ? height : img.height;
    const base64Url = drawImage({
      target: img,
      width,
      height,
      imgQuality
    });
    return callback && callback(base64Url);
  };
}
/**
 * dom绘图获取base64Url
 * @param {element} target: 绘图目标： video、img、canvas
 * @param {Number} width: 图片宽度
 * @param {Number} height: 图片高度
 * @param {string} imgType: 图片类型
 * @param {Number} imgQuality: 图片质量 0-1
 */
export function drawImage({
  target,
  width,
  height,
  imgType = 'image/jpeg',
  imgQuality = 1
}) {
  let canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d').drawImage(target, 0, 0);
  const base64Url = canvas.toDataURL(imgType, imgQuality);
  return base64Url;
}
/**
 * 创建A标签下载
 * @param {string} url: 下载地址
 * @param {string} title: 下载标题
 * @param {string} target: 窗口位置（默认新开窗口）
 */
export function tagAToDownload({ url, title = '', target = '_blank' }) {
  let tagA = document.createElement('a');
  tagA.setAttribute('href', url);
  tagA.setAttribute('download', title);
  tagA.setAttribute('target', target);
  document.body.appendChild(tagA);
  tagA.click();
  document.body.removeChild(tagA);
}

export function addWaterMark(canvas, waterMark) {
  const {
    text,
    font,
    color,
    shadowColor,
    shadowX,
    shadowY,
    shadowBlur,
    degree,
    width,
    height
  } = waterMark;
  //水印画布
  let repeatCanvas = document.createElement('canvas');
  let rcw = (repeatCanvas.width = width);
  let rch = (repeatCanvas.height = height);
  let rctx = repeatCanvas.getContext('2d');
  //设置文本大小和字体
  rctx.font = font;
  //设置文本的颜色和透明度
  rctx.fillStyle = color;
  //设置文本阴影的颜色和透明度
  rctx.shadowColor = shadowColor;
  //设置文本阴影位置（相对文本）
  rctx.shadowOffsetX = shadowX;
  rctx.shadowOffsetY = shadowY;
  //设置文本阴影模糊度
  rctx.shadowBlur = shadowBlur;
  //将文本设为居中对齐
  rctx.textAlign = 'center';
  rctx.textBaseline = 'middle';
  //以文本的中心为旋转点
  rctx.translate(rcw / 2, rch / 2);
  rctx.rotate((degree * Math.PI) / 180);
  rctx.translate(-rcw / 2, -rch / 2);
  //讲文本绘制在画布中心
  text.map((item, index) => {
    rctx.fillText(item, rcw / 2, rch / 2 + parseFloat(font) * index);
  });

  let ctx = canvas.getContext('2d');
  //平铺水印画布
  ctx.fillStyle = ctx.createPattern(repeatCanvas, 'repeat');
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// 切割数组 1维变2维
export function splitArrForX(arr, x = 3) {
  let newArr = [];
  for (let i = 0, l = arr.length; i < l; i++) {
    if (newArr.length === 0) {
      newArr.push([]);
    }
    if (newArr[newArr.length - 1].length > x - 1) {
      newArr.push([]);
    }
    newArr[newArr.length - 1].push(arr[i]);
  }
  return newArr;
}

/**
 * file文件转base64
 * @param {file} input-file
 * @param {function} callback
 */
export function fileToBase64(file, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(file);
}
/**
 * 图片base64转换为blob
 * @param {string} base64Url
 */
export function base64ToBlob(base64Url) {
  var bytes = window.atob(base64Url.split(',')[1]); // 去掉url的头，并转换为byte
  //处理异常,将ascii码小于0的转换为大于0
  var ab = new ArrayBuffer(bytes.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }
  return new Blob([ab], { type: 'image/png' });
}
/**
 * 文字超出中间省略号
 * @param {string} str
 */
export function getSubStr(str, number = 4) {
  if(str.length > number*2) {
    let arr1 = str.substr(0,number);
    let arr2 = str.substr(str.length - number ,number);
    return `${arr1}...${arr2}`;
  } else {
    return str
  }
}
