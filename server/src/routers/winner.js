import { Controller, Request, RequestMethod } from '../utils/decorator'
import { genSuccessResponse } from '../utils/modelUtils'
import WinnerModel from '@/models/winnerModel'

@Controller({
    prefix: '/api'
})
class Winner {

    @Request({
        url: '/getAllWinnerUsers',
        method: RequestMethod.GET
    })
    async getAllWinnerUsers (ctx) {
        let data = await WinnerModel.find({}).sort({ code: 1 }).exec()
        ctx.body = genSuccessResponse(data)
    }

    @Request({
        url: '/getWinnerUsersByParams',
        method: RequestMethod.POST
    })
    async getWinnerUsersByParams (ctx) {
        let params = ctx.request.body
        let res = await WinnerModel.find(params).exec()
        let data = Object.prototype.toString.call(res) === '[object Object]' ? [res] : res
        ctx.body = genSuccessResponse(data)
    }

    @Request({
        url: '/saveWinnerUser',
        method: RequestMethod.POST
    })
    async saveWinnerUser (ctx) {
        let params = ctx.request.body
        let code = params.code
        let data = await WinnerModel.findOne({ code }).exec()
        if (!data) {
            data = await WinnerModel.create(params)
        }
        ctx.body = genSuccessResponse(data)
    }

    @Request({
        url: '/saveMultiWinnerUser',
        method: RequestMethod.POST
    })
    async saveMultiWinnerUser (ctx) {
        let params = ctx.request.body
        let { users, type, title } = params
        users = users.map(user => {
            user.type = type
            user.title = title
            delete user._id
            return user
        })
        let data = await WinnerModel.create(users)
        ctx.body = genSuccessResponse(data)
    }

    @Request({
        url: '/updateWinnerUser',
        method: RequestMethod.POST
    })
    async updateWinnerUser (ctx) {
        let params = ctx.request.body
        let _id = params._id
        delete params._id
        let data = await WinnerModel.findOneAndUpdate({ _id }, params).exec()
        ctx.body = genSuccessResponse(data)
    }

    @Request({
        url: '/delWinnerUser',
        method: RequestMethod.DELETE
    })
    async delWinnerUser (ctx) {
        let params = ctx.request.query
        let _id = params._id
        let data = await WinnerModel.findOneAndRemove({ _id }).exec()
        ctx.body = genSuccessResponse(data)
    }

    @Request({
        url: '/delMultiWinnerUser',
        method: RequestMethod.POST
    })
    async delMultiWinnerUser (ctx) {
        let params = ctx.request.body
        let key = params.key
        let values = params.values
        let data = await WinnerModel.deleteMany({ [key]: { $in: values } }).exec()
        ctx.body = genSuccessResponse(data)
    }
}

export default Winner

