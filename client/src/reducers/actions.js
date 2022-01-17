export const SET_SELECTED = 'SET_SELECTED'
export const SET_SELECTED_INDEX = 'SET_SELECTED_INDEX'
export const SET_PREV_SELECTED_INDEX = 'SET_PREV_SELECTED_INDEX'
export const SET_SELECTED_CARD_INDEX = 'SET_SELECTED_CARD_INDEX'
export const CLEAR_SELECTED_CARD_INDEX = 'CLEAR_SELECTED_CARD_INDEX'
export const SET_SELECTD_USERS = 'SET_SELECTD_USERS'
export const CLEAR_SELECTD_USERS = 'CLEAR_SELECTD_USERS'
export const RESET_PREV_SELECTED_INDEX = 'RESET_PREV_SELECTED_INDEX'
export const SET_LOADING = 'SET_LOADING'
export const initData = (payload) => {
    return {
        type: 'INIT_DATA',
        payload
    }
}
export const setPreSelected = (payload) => {
    return {
        type: 'SET_PRESELECTED',
        payload
    }
}
export const setSelected = (payload) => {
    return {
        type: 'SET_SELECTED',
        payload
    }
}

export const setWinnerUsers = (payload) => {
    return {
        type: 'SET_WINNERUSERS',
        payload
    }
}

export const removeWinnerUsers = () => {
    return {
        type: 'REMOVE_WINNERUSERS'
    }
}

export const setRemainUsers = (payload) => {
    return {
        type: 'SET_REMAINUSERS',
        payload
    }
}
