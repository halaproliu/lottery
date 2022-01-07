import path from 'path'
import { readFile, writeFile, existsSync } from '../utils/fileUtils'
import { loadXML } from '../utils/xml'
const cwd = process.cwd()
const winnerPath = path.join(cwd, 'winners.json')
const notArriveWinnerPath = path.join(cwd, 'notArriveWinner.json')

export const getUserData = () => {
  let users = loadXML(path.join(cwd, 'data/users.xlsx'))
  return users
}

export const getWinnerData = () => {
  if (!existsSync(winnerPath)) {
    writeFile(winnerPath, '{}')
  }
  let winners = readFile(winnerPath)
  if (winners) winners = JSON.parse(winners)
  return winners
}

export const getNotArriveWinnersData = () => {
  if (!existsSync(notArriveWinnerPath)) {
    writeFile(notArriveWinnerPath, '{}')
  }
  let winners = readFile(notArriveWinnerPath)
  if (winners) winners = JSON.parse(winners)
  return winners
}

/**
 * @description 获取未抽奖用户
 * @returns 
 */
export const getRemainData = () => {
  let lotteredUser = {} // 已抽取用户
  let userData = getUserData()
  let winnerData = getWinnerData()
  let notArriveWinners = getNotArriveWinnersData()
  for (let key in winnerData) {
    let tmpData = winnerData[key]
    tmpData.forEach(item => {
      lotteredUser[item[0]] = true
    })
  }
  notArriveWinners.forEach(item => {
    lotteredUser[item[0]] = true
  })

  let remainUsers = Object.assign([], userData)
  remainUsers = remainUsers.filter(user => {
    return !lotteredUser[user[0]]
  })
  return remainUsers
}

export const saveFileData = (data, type = 1) => {
  data = JSON.stringify(data, '', 2)
  let currPath = type === 1 ? winnerPath : notArriveWinnerPath
  writeFile(currPath, data)
  let msg = type === 1 ? '保存奖品数据成功' : '保存不在场中奖人员数据成功'
  console.log(msg)
}