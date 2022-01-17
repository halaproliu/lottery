const initialState = {
    selected: {},
    selectedIndex: '',
    preSelected: {},
    preSelectedIndex: '',
    users: [],
    winnerUsers: [],
    remainUsers: [],
    prizes: [],
    isLoaded: false
}

const getCurrentWinners = (state, obj) => {
    return state.winnerUsers.filter(user => user.type === obj.type && user.title === obj.title) || []
}

const getCurrentPrize = (state) => {
    let len = state.prizes.length - 1
    for (let i = len; i >= 0; i--) {
        let currSelected = state.prizes[i]
        let currWinners = getCurrentWinners(state, currSelected)
         if (currWinners.length >= currSelected.count) {
            if (i === 0) {
                return { ...state, selectedIndex: i, selected: currSelected }
            }
            continue
        }
        return { ...state, selectedIndex: i, selected: currSelected }
    }
}

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case 'INIT_DATA':
            const { users, winnerUsers, remainUsers, prizes } = action.payload
            return { ...state, prizes: [...prizes], users: [...users], winnerUsers: [...winnerUsers], remainUsers: [...remainUsers], isLoaded: true }
        case 'SET_SELECTED':
            const { index, value } = action.payload
            if (!state.preSelectedIndex) {
                return { ...state, selectedIndex: index, selected: value, preSelectedIndex: index, preSelected: value }
            }
            return { ...state, selectedIndex: index, selected: value }
        case 'SET_PRESELECTED':
            const { index: i, value: val } = action.payload
            return { ...state, preSelectedIndex: i, preSelected: val }
        case 'REMOVE_WINNERUSERS':
            for (let i = winnerUsers.length - 1; i >= 0; i--) {
                if (winnerUsers[i].status === 1) {
                    winnerUsers[i].splice(i, 1)
                }
            }
            return { ...state, winnerUsers: [...winnerUsers] }
        case 'SET_WINNERUSERS':
            return { ...state, winnerUsers: [...action.payload]}
        case 'SET_REMAINUSERS':
            return { ...state, remainUsers: [...action.payload]}
        default:
            return state
    }
}

export default reducer
