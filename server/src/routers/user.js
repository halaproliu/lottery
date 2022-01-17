import { Controller, Request, RequestMethod } from '../utils/decorator'
import { genSuccessResponse } from '../utils/modelUtils'
import UserModel from '@/models/userModel'

@Controller({
    prefix: '/api'
})
class User {
    @Request({
        url: '/saveAllUsers',
        method: RequestMethod.POST
    })
    async saveAllUsers (ctx) {
        let users = getUserData()
        let results = []
        for (let i = 0; i < users.length; i++) {
            let obj = {
            code: users[i][0],
            username: users[i][1],
            nickName: users[i][2]
            }
            results.push(obj)
        }
        let data = await UserModel.create(options)
        ctx.body = genSuccessResponse(data)
    }



    @Request({
        url: '/getAllUsers',
        method: RequestMethod.GET
    })
    async getAllUsers (ctx) {
        let data = await UserModel.find({}).sort({ code: 1 }).exec()
        ctx.body = genSuccessResponse(data)
    }


    @Request({
        url: '/getUserByParams',
        method: RequestMethod.POST
    })
    async getUserByParams (ctx) {
        let params = ctx.request.body
        let res = await UserModel.find(params)
        let data = Object.prototype.toString.call(res) === '[object Object]' ? [res] : res
        ctx.body = genSuccessResponse(data)
    }

    @Request({
        url: '/saveUser',
        method: RequestMethod.POST
    })
    async saveUser (ctx) {
        let params = ctx.request.body
        let code = params.code
        let data = await UserModel.findOne({ code })
        if (!data) {
            data = await UserModel.create(params)
        }
        ctx.body = genSuccessResponse(data)
    }

    @Request({
        url: '/updateUser',
        method: RequestMethod.POST
    })
    async updateUser (ctx) {
        let params = ctx.request.body
        let _id = params._id
        delete params._id
        let data = await UserModel.findOneAndUpdate({ _id }, params).exec()
        ctx.body = genSuccessResponse(data)
    }

    @Request({
        url: '/delUser',
        method: RequestMethod.DELETE
    })
    async delUser (ctx) {
        let params = ctx.request.query
        let _id = params._id
        let data = await UserModel.findOneAndRemove({ _id }).exec()
        ctx.body = genSuccessResponse(data)
    }
}

export default User

