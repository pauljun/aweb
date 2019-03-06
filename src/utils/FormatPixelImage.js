/**
 * 去掉或者修改透明的图片不需要的颜色
 * @param {string} src image src
 * @param {Object<{RGBA}>} 匹配的颜色
 */
export function formatPixelImage(src) {
  let image = new Image()
  image.src = src
  image.setAttribute('crossOrigin', 'anonymous')
  return new Promise((resolve, reject) => {
    image.onload = function() {
      let canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      var context = canvas.getContext('2d')
      context.drawImage(image, 0, 0, image.width, image.height)
      try {
        let imageData = context.getImageData(0, 0, image.width, image.height)
        //获取到每个像素的信息
        var px = imageData.data
        for (var i = 0; i < px.length; i += 4) {
          let r = px[i]
          var g = px[i + 1]
          var b = px[i + 2]

          //TODO 黑变白
          if (r === 0 && g === 0 && b === 0) {
            px[i] = 255
            px[i + 1] = 255
            px[i + 2] = 255
            px[i + 3] = px[i + 3] * 1
          }

          //TODO 黑灰变透明
          if (r === 205 && g === 205 && b === 205) {
            px[i + 3] = px[i + 3] * 0
          }

          //TODO 白变透明
          if (r === 255 && g === 255 && b === 255) {
            px[i + 3] = px[i + 3] * 0
          }
          //TODO 灰白变透明
          if (r === 254 && g === 254 && b === 254) {
            px[i + 3] = px[i + 3] * 0
          }
        }

        context.putImageData(imageData, 0, 0)
        resolve(canvas.toDataURL('image/png'))
      } catch (e) {
        reject(e)
      }
    }
  })
}