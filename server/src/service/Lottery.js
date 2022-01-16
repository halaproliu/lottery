import path from 'path'
import { loadXML } from '../utils/xml'
import WinnerModel from '../models/WinnerModel'
import WinsNotArriveModel from '../models/winsNotArriveModel'
import UserModel from '../models/UserModel'

export const getUserData = () => {
  let users = loadXML(path.join(cwd, 'data/user1.xlsx'))
  return users
}

export const getData = async () => {
  const usedUsers = {}
  const winnerUsers = await WinnerModel.find({}).exec()
  const winsNotArriveUsers = await WinsNotArriveModel.find({}).exec()
  const users = await UserModel.find({}).exec()
  winnerUsers.forEach(({ code }) => {
      usedUsers[code] = true
  })
  winsNotArriveUsers.forEach(({ code }) => {
      usedUsers[code] = true
  })
  const remainUsers = users.filter(({ code }) => {
      return !usedUsers[code]
  })
  return {
      users,
      winnerUsers,
      remainUsers
  }
}
