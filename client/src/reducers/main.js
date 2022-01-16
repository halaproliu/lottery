const initialState = {
    loading: false
}

const reducers = (state = initialState, action) => {
    switch(action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload }
        default:
            return state
    }
}

export default reducers
