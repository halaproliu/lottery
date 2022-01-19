import { Controller, Request, RequestMethod } from '../utils/decorator'
import { genSuccessResponse } from '../utils/modelUtils'
import WinsNotArriveModel from '@/models/winsNotArriveModel'

@Controller({
    prefix: '/api'
})
class Winner {

    @Request({
        url: '/getAllNotArriveUsers',
        method: RequestMethod.GET
    })
    async getAllNotArriveUsers (ctx) {
        let data = await WinsNotArriveModel.find({}).sort({ code: 1 }).exec()
        ctx.body = genSuccessResponse(data)
    }

    @Request({
        url: '/getNotArriveUsersByParams',
        method: RequestMethod.POST
    })
    async getNotArriveUsersByParams (ctx) {
        let params = ctx.request.body
        let res = await WinsNotArriveModel.find(params).exec()
        let data = Object.prototype.toString.call(res) === '[object Object]' ? [res] : res
        ctx.body = genSuccessResponse(data)
    }

    @Request({
        url: '/saveNotArriveUser',
        method: RequestMethod.POST
    })
    async saveNotArriveUser (ctx) {
        let params = ctx.request.body
        let code = params.code
        let data = await WinsNotArriveModel.findOne({ code })
        if (!data) {
            data = await WinsNotArriveModel.create(params)
        }
        ctx.body = genSuccessResponse(data)
    }

    @Request({
        url: '/saveMultiNotArriveUser',
        method: RequestMethod.POST
    })
    async saveMultiNotArriveUser (ctx) {
        try {
            let params = ctx.request.body
            let { users, type, title } = params
            users = users.map(user => {
                user.type = type
                user.title = title
                return user
            })
            let data = await WinsNotArriveModel.create(users)
            ctx.body = genSuccessResponse(data)
        } catch (e) {
            ctx.body = genSuccessResponse({code: 500, msg: '保存失败', data: e})
        }
    }

    @Request({
        url: '/updateNotArriveUser',
        method: RequestMethod.POST
    })
    async updateNotArriveUser (ctx) {
        let params = ctx.request.body
        let _id = params._id
        delete params._id
        let data = await WinsNotArriveModel.findOneAndUpdate({ _id }, params).exec()
        ctx.body = genSuccessResponse(data)
    }

    @Request({
        url: '/delNotArriveUser',
        method: RequestMethod.DELETE
    })
    async delNotArriveUser (ctx) {
        let params = ctx.request.query
        let _id = params._id
        let data = await WinsNotArriveModel.findOneAndRemove({ _id }).exec()
        ctx.body = genSuccessResponse(data)
    }
}

export default Winner

