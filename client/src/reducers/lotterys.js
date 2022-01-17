const initialState = {
    selected: {},
    selectedIndex: '',
    users: [],
    winnerUsers: [],
    remainUsers: [],
    prizes: [],
    isLoaded: false
}

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case 'INIT_DATA':
            const { users, winnerUsers, remainUsers, prizes } = action.payload
            return { ...state, prizes: [...prizes], users: [...users], winnerUsers: [...winnerUsers], remainUsers: [...remainUsers], isLoaded: true }
        case 'SET_SELECTED':
            const { index, value } = action.payload
            return { ...state, selectedIndex: index, selected: value }
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
