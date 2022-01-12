import { SET_SELECTED, SET_SELECTED_INDEX, SET_SELECTED_CARD_INDEX, CLEAR_SELECTED_CARD_INDEX, SET_SELECTD_USERS, CLEAR_SELECTD_USERS } from './actions'
import { prizeList } from '../constant'

const initialState = {
  selected: {},
  selectedIndex: prizeList.length - 1,
  selectedCardIndex: [],
  selectedUsers: []
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SELECTED:
      return {...state, selected: { ...action.payload }}
    case SET_SELECTED_INDEX:
      let index = action.payload
      if (index < 0) {
        index = 0
      }
      let selected = prizeList[index]
      return {...state, selectedIndex: index, selected: {...selected} }
    case SET_SELECTED_CARD_INDEX:
      state.selectedCardIndex.push(action.payload)
      console.log('payload cardIndex', action.payload)
      console.log('state cardIndex', [...state.selectedCardIndex])
      return { ...state, selectedCardIndex: [...state.selectedCardIndex] }
    case CLEAR_SELECTED_CARD_INDEX:
      return { ...state, selectedCardIndex: [] }
    case SET_SELECTD_USERS:
      state.selectedUsers.push(action.payload)
      console.log('payload', action.payload)
      console.log('state', { ...state, selectedUsers: [...state.selectedUsers] })
      return { ...state, selectedUsers: [...state.selectedUsers] }
    case CLEAR_SELECTD_USERS:
      state.selectedUsers.length = 0
      console.log(action)
      return { ...state, selectedUsers: [...state.selectedUsers] }
    default:
      return state
  }
}

export default reducer
