import http from './http'

export const getUsers = () => {
  return http.get('/api/getUsers')
}

export const getData = () => {
  return http.get('/api/getData')
}

export const saveData = (data) => {
  return http.post('/api/saveData', data)
}

export const exportResultData = (data) => {
  return http.get('/api/export')
}