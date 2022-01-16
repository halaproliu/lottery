import http from './http'

export const getAllPrizes = () => {
    return http.get('/api/getAllPrizes')
}

export const savePrize = (data) => {
    return http.post('/api/savePrize', data)
}

export const updatePrize = (data) => {
    return http.post('/api/updatePrize', data)
}

export const delPrize = (data) => {
    return http.delete(`/api/delPrize?_id=${data._id}`, data)
}
