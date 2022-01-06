const generateApi = (obj) => {
  for (let key in obj) {
    if (/s/.test(obj[key])) {
      obj[key] = generateString()
    } else if (/b/.test(obj[key])) {
      obj[key] = generateBool(obj[key])
    }
  }
  return obj
}

const generateString = len => {
  len = len || 32
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  const maxPos = $chars.length
  let result = ''
  for (let i = 0; i < len; i++) {
    //产生随机数方式
    result += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return result
}
/**
 * @description 生成bool值
 * @param {*} value 格式为b|0,或b|1，其中b为类型，0：false,1:true
 * @returns
 */
const generateBool = value => {
  const tmpArr = value.split('|')
  return tmpArr[1] === '1'
}

module.exports = {
  generateApi
}
