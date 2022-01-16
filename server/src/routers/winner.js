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
        url: '/saveWinnerUser',
        method: RequestMethod.POST
    })
    async saveWinnerUser (ctx) {
        let params = ctx.request.body
        let code = params.code
        let data = await WinnerModel.findOne({ code })
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
        let { users, type, subType, title } = params
        users = users.map(user => {
            user.type = type
            user.subType = subType
            user.title = title
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
}

export default Winner

