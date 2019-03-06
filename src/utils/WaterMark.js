import { loadImage } from './index';
async function createTextImage({
  textAlign = 'center',
  fontSize = 14,
  fillStyle = 'rgba(255, 255, 255,0.4)',
  content = ['请勿外传', '******'],
  rotate = '30',
  offset = {
    x: 0,
    y: 0
  },
} = {}) {
  const height = content.length * (fontSize * 2) + 40;
  const width =
    content.sort((a, b) => a.length - b.length)[0].length * (fontSize * 2) +
    fontSize;
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');
  canvas.setAttribute('width', width + offset.x);
  canvas.setAttribute('height', height + offset.y);
  ctx.translate(width / 2, height / 2);
  ctx.rotate((rotate * Math.PI) / 180);
  ctx.translate((width / 2) * -1, (height / 2) * -1);
  ctx.translate(width / 2, (height - fontSize * content.length) / 2);
  content.map((text, index) => {
    ctx.font = `300 ${fontSize}px 微软雅黑,黑体`;
    ctx.textAlign = textAlign;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = fillStyle;
    ctx.textBaseline = 'bottom';
    ctx.fillText(text, 0, (fontSize + 4) * (index + 1));
  });
  return canvas;
}

/**
 * 生成完整的水印加图片，图片地址跨域不可用
 * @param {*} path
 * @param {*} options
 */

async function createImageWaterMark(path, options) {
  let image = await loadImage(path, true);
  let image2 = await createTextImage(options);
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');
  canvas.setAttribute('width', image.width);
  canvas.setAttribute('height', image.height);
  ctx.drawImage(image, 0, 0);
  let pat = ctx.createPattern(image2, 'repeat');
  ctx.fillStyle = pat;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const url = canvas.toDataURL();
  image = null;
  ctx = null;
  canvas = null;
  return url;
}

export { createImageWaterMark, createTextImage };
