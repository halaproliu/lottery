import http from './http'

export const getUsers = () => {
  return http.get('/api/getUsers')
}