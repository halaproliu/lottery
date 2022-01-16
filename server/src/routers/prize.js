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
        url: '/savePrize',
        method: RequestMethod.POST
    })
    async savePrize (ctx) {
        let params = ctx.request.body
        let title = params.title
        let data = await PrizeModel.findOne({ title })
        if (!data) {
            data = await PrizeModel.create(params)
        }
        ctx.body = genSuccessResponse(data)
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

