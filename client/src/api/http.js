import axios from 'axios'
import config from '../config'
import {
  REQUEST_UNRECORNIZED,
  REQUEST_FORBIDDEN
} from '@/constant/status'

// create an axios instance
const api = axios.create({
  baseURL: config.baseURL
})

api.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// request interceptor
api.interceptors.request.use(
  config => {
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// response interceptor
api.interceptors.response.use(
  res => {
    if (res.status === 200) {
      let { data = {} } = res
      if (data.code === 200) {
        return data.data || {}
      } else {
        return res
      }
    } else {
      return res
    }
  },
  err => {
    if (!err.response) {
      return Promise.reject(err)
    }
    switch (err.response.status) {
      case REQUEST_UNRECORNIZED:
        break
      case REQUEST_FORBIDDEN:
        console.log('No Permission')
        break
      default:
        break
    }
    return Promise.reject(err.response)
  }
)

export default api