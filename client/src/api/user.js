import http from './http'

export const getAllUsers = () => {
    return http.get('/api/getAllUsers')
}

export const saveUser = (data) => {
    return http.post('/api/saveUser', data)
}

export const updateUser = (data) => {
    return http.post('/api/updateUser', data)
}

export const delUser = (data) => {
    return http.delete(`/api/delUser?_id=${data._id}`, data)
}
