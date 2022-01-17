import http from './http'

export const getAllWinnerUsers = () => {
    return http.get('/api/getAllWinnerUsers')
}

export const getWinnerUsersByParams = (data) => {
    return http.post('/api/getWinnerUsersByParams', data)
}

export const saveWinnerUser = (data) => {
    return http.post('/api/saveWinnerUser', data)
}

export const saveMultiWinnerUser = (data) => {
    return http.post('/api/saveMultiWinnerUser', data)
}

export const updateWinnerUser = (data) => {
    return http.post('/api/updateWinnerUser', data)
}

export const delWinnerUser = (data) => {
    return http.delete(`/api/delWinnerUser?_id=${data._id}`, data)
}

export const delMultiWinnerUser = (data) => {
    return http.post(`/api/delMultiWinnerUser`, data)
}
