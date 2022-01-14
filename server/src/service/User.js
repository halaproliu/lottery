import UserModel from '../models/UserModel'

export const saveAllUser = async (ctx, options) => {
  try {
    let data = await UserModel.create(options)
    ctx.body = { code: 200, data }
  } catch (e) {
    ctx.body = { code: 500, data: e }
  }
}

export const getAllUser = async () => {
  return UserModel.find({})
}


