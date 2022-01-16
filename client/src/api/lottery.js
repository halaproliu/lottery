import http from './http'

export const getAllUsers = () => {
  return http.get('/api/getAllUsers')
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
  return http.post('/api/reset')
}

export const exportResultData = () => {
  return http.get('/api/exportData')
}

export const exportFile = () => {
  return http.get('/api/exportFile')
}

export const removeNotArrivedUser = (data) => {
  return http.post('/api/removeNotArrivedUser', data)
}

export const saveAllUsers = (data) => {
  return http.post('/api/saveAllUsers', data)
}
