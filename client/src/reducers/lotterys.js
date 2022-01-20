const initialState = {
    selected: {},
    selectedIndex: '',
    preSelected: {},
    preSelectedIndex: '',
    preSelectedUsers: [],
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
            if (!state.preSelectedIndex) {
                console.log(111, index)
                return { ...state, selectedIndex: index, selected: { ...value }, preSelectedIndex: index, preSelected: { ...value } }
            }
            return { ...state, selectedIndex: index, selected: { ...value } }
        case 'SET_PRESELECTED':
            const { index: i, value: val } = action.payload
            return { ...state, preSelectedIndex: i, preSelected: { ...val },  }
        case 'SET_PRESELECTED_USERS':
            const preSelectedUsers = action.payload
            return { ...state, preSelectedUsers: [...preSelectedUsers] }
        case 'SET_WINNERUSERS':
            return { ...state, winnerUsers: [...action.payload]}
        case 'SET_REMAINUSERS':
            return { ...state, remainUsers: [...action.payload]}
        default:
            return state
    }
}

export default reducer
