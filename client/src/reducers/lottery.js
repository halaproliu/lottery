import { 
  SET_SELECTED,
  SET_SELECTED_INDEX,
  SET_PREV_SELECTED_INDEX,
  SET_SELECTED_CARD_INDEX,
  CLEAR_SELECTED_CARD_INDEX,
  SET_SELECTD_USERS,
  CLEAR_SELECTD_USERS,
  RESET_PREV_SELECTED_INDEX } 
from './actions'
import { prizeList } from '../constant'

const initialState = {
  isInit: false,
  selected: prizeList[prizeList.length - 1],
  selectedIndex: prizeList.length - 1,
  selectedCardIndex: [],
  selectedUsers: [],
  preSelectedIndex: prizeList.length - 1,
  preSelected: prizeList[prizeList.length - 1]
}

const setIndex = (payload) => {
  let index = payload
  if (index < 0) {
    index = 0
  }
  let selected = prizeList[index]
  return { index, selected }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SELECTED:
      return {...state, selected: { ...action.payload }}
    case SET_SELECTED_INDEX:
      if (!state.isInit) {
        let { index, selected } = setIndex(action.payload)
        state.isInit = true
        return {...state, selectedIndex: index, selected: {...selected}, preSelectedIndex: index, preSelected: {...selected} }
      } else {
        let { index, selected } = setIndex(action.payload)
        return {...state, selectedIndex: index, selected: {...selected} }
      }
    case SET_PREV_SELECTED_INDEX:
      let { index: prevIndex, selected: preSelected } = setIndex(action.payload)
      return {...state, preSelectedIndex: prevIndex, preSelected: {...preSelected} }
    case SET_SELECTED_CARD_INDEX:
      state.selectedCardIndex.push(action.payload)
      return { ...state, selectedCardIndex: [...state.selectedCardIndex] }
    case CLEAR_SELECTED_CARD_INDEX:
      return { ...state, selectedCardIndex: [] }
    case SET_SELECTD_USERS:
      state.selectedUsers.push(action.payload)
      return { ...state, selectedUsers: [...state.selectedUsers] }
    case CLEAR_SELECTD_USERS:
      state.selectedUsers.length = 0
      return { ...state, selectedUsers: [...state.selectedUsers] }
    case RESET_PREV_SELECTED_INDEX:
      return { ...state, preSelectedIndex: prizeList.length - 1, preSelected: prizeList[prizeList.length - 1]}
    default:
      return state
  }
}

export default reducer
