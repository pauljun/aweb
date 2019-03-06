/* eslint-disable no-useless-escape */
const Base64Binary = {
  _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

  /* will return a  Uint8Array type */
  decodeArrayBuffer(input) {
    const bytes = input.length / 4 * 3
    const ab = new ArrayBuffer(bytes)
    this.decode(input, ab)

    return ab
  },

  removePaddingChars(input) {
    const lkey = this._keyStr.indexOf(input.charAt(input.length - 1))
    if (lkey == 64) {
      return input.substring(0, input.length - 1)
    }
    return input
  },

  decode(input, arrayBuffer) {
    //get last chars to see if are valid
    input = this.removePaddingChars(input)
    //input = this.removePaddingChars(input);

    const bytes = parseInt(input.length / 4 * 3, 10)

    let uarray
    let chr1
    let chr2
    let chr3
    let enc1
    let enc2
    let enc3
    let enc4
    let i = 0
    let j = 0

    if (arrayBuffer) {
      uarray = new Uint8Array(arrayBuffer)
    }else {
      uarray = new Uint8Array(bytes)
    }

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '')

    for (i = 0; i < bytes; i += 3) {
      //get the 3 octects in 4 ascii chars
      enc1 = this._keyStr.indexOf(input.charAt(j++))
      enc2 = this._keyStr.indexOf(input.charAt(j++))
      enc3 = this._keyStr.indexOf(input.charAt(j++))
      enc4 = this._keyStr.indexOf(input.charAt(j++))

      chr1 = (enc1 << 2) | (enc2 >> 4)
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
      chr3 = ((enc3 & 3) << 6) | enc4

      uarray[i] = chr1
      if (enc3 !== 64) {
        uarray[i + 1] = chr2
      }
      if (enc4 !== 64){
        uarray[i + 2] = chr3
      }
    }

    return uarray
  }
}

let base64toFloatArray = base64Encoded => {
  let byteArr = Base64Binary.decode(base64Encoded, new ArrayBuffer(1024))
  return new Float32Array(byteArr.buffer)
}

let cosSimilar = (bytesA, bytesB) => {
  console.log(bytesA, 5555)
  console.log(bytesB, 6666)
  let sum = 0.0
  for (let i = 0; i < 256; i++) {
    if(bytesA[i] && bytesB[i]){
      sum += bytesA[i] * bytesB[i]
    }
  }
  console.log(sum);
  return sum
}

let scoreToCos = score => {
  let a = 0
  let b = 0

  if (score < 60) {
    //0.54
    a = 38.96
    b = 38.96
  } else if (score < 70) {
    //0.59
    a = 200.0
    b = -48.0
  } else if (score < 85) {
    //0.66
    a = 374.99
    b = -151.24
  } else if (score < 95) {
    //0.709
    a = 102.04
    b = 22.66
  } else {
    a = 17.18
    b = 82.818
  }

  return (score - b) / a
}

let cosToScore = score => {
  let a
  let b
  if (score < 0.54) {
    a = 38.96
    b = 38.96
  } else if (score < 0.59) {
    a = 200.0
    b = -48.0
  } else if (score < 0.63) {
    a = 374.99
    b = -151.24
  } else if (score < 0.66) {
    a = 166.67
    b = -20.0
  } else if (score < 0.709) {
    a = 102.04
    b = 22.66
  } else {
    a = 17.18
    b = 82.818
  }
  score = a * score + b

  if (score > 100) {
    score = -1
  }
  if(score === 100){
    score === 99
  }
  score = score.toString().substring(0,2)
  return score
}

let calculate = (base64StringA, base64StringB) => {
  base64StringA = base64StringA.split('data:image/jpeg;base64,')[1]
  base64StringB = base64StringB.split('data:image/jpeg;base64,')[1]
  console.log(base64StringA,base64StringB, 162222);
  if (base64StringA instanceof Array){
    base64StringA = new Float32Array(base64StringA)
  }else{
    base64StringA = base64toFloatArray(base64StringA)
  }
  if (base64StringB instanceof Array){
    base64StringB = new Float32Array(base64StringB)
  }else{
    base64StringB = base64toFloatArray(base64StringB)
  }
  return cosToScore(
    cosSimilar(
      base64StringA,
      base64StringB
      // base64toFloatArray(base64StringB)
      // new Float32Array(floatArray)
    )
  )
}

module.exports = {
  calculate,
  cosToScore,
  scoreToCos
}