/**
 * @description 判断是否为数组
 * @param {*} arr
 * @returns Boolean
 */
 export const isArray = arr => {
  return Array.isArray(arr) || Object.prototype.toString.call(arr) === '[object Array]'
}

/**
 * @description 判断是否为对象
 * @param {*} obj
 * @returns Boolean
 */
export const isPlainObject = obj => {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

/**
 * @description 判断是否为空
 * @param {*} obj
 * @returns Boolean
 */
export const isEmpty = (obj) => {
  if (isArray(obj)) {
    return obj.length === 0
  }
  if (isPlainObject(obj)) {
    return Object.keys(obj).length === 0
  }
  return obj === '' || obj === undefined || obj === null
}

/**
 * @description 字典值解析
 * @param {any} val 值
 * @param {Object,Array} obj 字典列表
 * @param {Object} param
 * @param {String} param.labelKey 字典字段label
 * @param {String} param.valueKey 字典字段value
 * @returns 字段label
 */
export const dictsFilter = (val, obj, param = {}) => {
  if (!isArray(obj) && !isPlainObject(obj)) return val
  const { labelKey = 'label', valueKey = 'value' } = param
  if (isArray(obj)) {
    return (obj.find(item => item[valueKey] === val) || {})[labelKey] || ''
  } else {
    return obj[val] || ''
  }
}
