import { Controller, Request, RequestMethod } from '../utils/decorator'
import { genSuccessResponse } from '../utils/modelUtils'
import PrizeModel from '@/models/prizeModel'

@Controller({
    prefix: '/api'
})
class Prize {
    @Request({
        url: '/getAllPrizes',
        method: RequestMethod.GET
    })
    async getAllPrizes (ctx) {
        let data = await PrizeModel.find({}).sort({ type: 1, subType: 1 }).exec()
        ctx.body = genSuccessResponse(data)
    }

    @Request({
        url: '/getPrizeByParams',
        method: RequestMethod.POST
    })
    async getPrizeByParams (ctx) {
        let params = ctx.request.body
        let res = await PrizeModel.find(params).exec()
        let data = Object.prototype.toString.call(res) === '[object Object]' ? [res] : res
        ctx.body = genSuccessResponse(data)
    }

    @Request({
        url: '/savePrize',
        method: RequestMethod.POST
    })
    async savePrize (ctx) {
        let params = ctx.request.body
        let title = params.title
        let data = await PrizeModel.findOne({ title }).exec()
        if (!data) {
            data = await PrizeModel.create(params)
        }
        ctx.body = genSuccessResponse(data)
    }

    @Request({
        url: '/saveMultiPrize',
        method: RequestMethod.POST
    })
    async saveMultiPrize (ctx) {
        let params = ctx.request.body
        let prizes = params.prizes
        let data = await PrizeModel.create(prizes)
        if (data) {
            ctx.body = genSuccessResponse()
        } else {
            ctx.body = genSuccessResponse({ code: 0, msg: '保存失败' })
        }
    }

    @Request({
        url: '/updatePrize',
        method: RequestMethod.POST
    })
    async updatePrize (ctx) {
        let params = ctx.request.body
        let _id = params._id
        delete params._id
        let data = await PrizeModel.findOneAndUpdate({ _id }, params).exec()
        ctx.body = genSuccessResponse(data)
    }

    @Request({
        url: '/delPrize',
        method: RequestMethod.DELETE
    })
    async delPrize (ctx) {
        let params = ctx.request.query
        let _id = params._id
        let data = await PrizeModel.findOneAndRemove({ _id }).exec()
        ctx.body = genSuccessResponse(data)
    }
}

export default Prize

