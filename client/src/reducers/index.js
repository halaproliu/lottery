import { SHOW_MESSAGE, SET_ANIMATE_CLASS } from './actions'

const initialState = {
  message: '',
  animateClass: ''
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_MESSAGE:
      console.log('action', action)
      return {...state, message: action.message}
    case SET_ANIMATE_CLASS:
      console.log(action)
      return {...state, animateClass: action.animateClass}
    default:
      return state
  }
}

export default reducer
