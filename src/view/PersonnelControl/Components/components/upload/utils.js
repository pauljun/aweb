export default {
   /**
   * file文件转base64
   * @param {file} input-file 
   * @param {function} callback 
   */
  fileToBase64(file, callback) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(file)
  },
  // 严格的类型判断
  judgeType(data, type) {
    return Object.prototype.toString.apply(data) === `[object ${type}]`;
  },
  uuid() {
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
}



