import http from 'http'
import querystring from 'querystring'
/**
 * @description http的get和post请求
 * @param {*} url 接口地址
 * @param {*} options 包含method，onAfter
 * @param {*} postData 请求参数
 * @param {*} success 成功回调
 * @param {*} error 失败回调
 */
const request = (url, options, postData, success, error) => {
  typeof options.before === 'function' && options.before()
  postData && (postData = querystring.stringify(postData)) // 序列化请求参数
  const { method } = options
  if (method.toLowerCase() === 'get' && postData) {
    // get请求参数拼接到url上
    url += postData
  }
  const _options = {
    hostname: 'localhost',
    port: 3001,
    path: url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Content-Length': Buffer.byteLength(postData)
    },
    ...options
  }
  const req = http.request(_options, res => {
    res.setEncoding('utf8')
    res.on('data', chunk => {
      let data
      try {
        data = JSON.parse(chunk)
      } catch (e) {
        data = chunk
      }
      success(data)
    })
    res.on('end', () => {
      typeof options.after === 'function' && options.after() // 接口返回后的处理
    })
  })

  req.on('error', e => {
    console.error(`请求遇到问题：${e.message}`)
    error(e)
  })

  method.toLowerCase() === 'post' && req.write(postData) // post请求通过write方法写入请求参数
  req.end()
}
/**
 * @description post请求
 * @param {*} url 请求接口地址
 * @param {*} [data={}] 请求参数
 * @returns Promise
 */
const POST = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST'
    }
    request(
      url,
      options,
      data,
      res => {
        resolve(res)
      },
      err => {
        reject(err)
      }
    )
  })
}
/**
 * @description get请求
 * @param {*} url 接口地址
 * @param {string} [data=''] 请求参数
 * @returns Promise
 */
const GET = (url, data = '') => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET'
    }
    request(
      url,
      options,
      data,
      res => {
        resolve(res)
      },
      err => {
        reject(err)
      }
    )
  })
}

export { GET, POST }
