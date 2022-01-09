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

export const saveNotArriveWinnerData = (data) => {
  return http.post('/api/saveNotArriveWinnerData', data)
}

export const resetData = () => {
  return http.post('/api/resetData')
}

export const exportResultData = () => {
  return http.get('/api/exportData')
}

export const exportFile = () => {
  return http.get('/api/exportFile')
}
