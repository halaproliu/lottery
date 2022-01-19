import http from './http'

export const getAllNotArriveUsers = () => {
    return http.get('/api/getAllNotArriveUsers')
}

export const getNotArriveUsersByParams = (data) => {
    return http.post('/api/getNotArriveUsersByParams', data)
}

export const saveNotArriveUser = (data) => {
    return http.post('/api/saveNotArriveUser', data)
}

export const saveMultiNotArriveUser = (data) => {
    return http.post('/api/saveMultiNotArriveUser', data)
}

export const updateNotArriveUser = (data) => {
    return http.post('/api/updateNotArriveUser', data)
}

export const delNotArriveUser = (data) => {
    return http.delete(`/api/delNotArriveUser?_id=${data._id}`, data)
}
