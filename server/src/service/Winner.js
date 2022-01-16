import WinnerModel from '../models/WinnerModel'
import WinsNotArriveModel from '../models/winsNotArriveModel'
import UserModel from '../models/UserModel'

/**
 * @description 保存已抽中用户
 * @param {*} data 
 * @returns 
 */
export const saveWinnerUsers = async (data) => {
    const res = await WinnerModel.create(data)
    return res
}

/**
 * @description 保存已抽中未到场用户
 * @param {*} data 
 * @returns 
 */
export const saveNotArriveUsers = async (data) => {
    const res = await WinsNotArriveModel.create(data)
    return res
}

/**
 * @description 获取未抽取的用户
 * @returns
 */
export const getRemainUsers = async () => {
    let usedUsers = {}
    let winnerUsers = await WinnerModel.find({}).exec()
    let winsNotArriveUsers = await WinsNotArriveModel.find({}).exec()
    let users = await UserModel.find({}).exec()
    winnerUsers.forEach(({ code }) => {
        usedUsers[code] = true
    })
    winsNotArriveUsers.forEach(({ code }) => {
        usedUsers[code] = true
    })
    let remainUsers = users.filter(({ code }) => {
        return !usedUsers[code]
    })
    return remainUsers
}

export const getData = async () => {
    let usedUsers = {}
    let winnerUsers = await WinnerModel.find({}).exec()
    let winsNotArriveUsers = await WinsNotArriveModel.find({}).exec()
    let users = await UserModel.find({}).exec()
    winnerUsers.forEach(({ code }) => {
        usedUsers[code] = true
    })
    winsNotArriveUsers.forEach(({ code }) => {
        usedUsers[code] = true
    })
    let remainUsers = users.filter(({ code }) => {
        return !usedUsers[code]
    })
    return {
        users,
        winnerUsers,
        remainUsers
    }
}
