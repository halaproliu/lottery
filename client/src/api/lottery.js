import http from './http'

export const getData = () => {
  return http.get('/api/getData')
}

export const resetData = () => {
  return http.post('/api/reset')
}

export const exportFile = () => {
  return http.get('/api/exportFile')
}