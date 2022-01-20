import path from 'path'
import { Controller, Request, RequestMethod } from '../utils/decorator'
import { genSuccessResponse } from '../utils/modelUtils'
import { writeXML } from '../utils/xml'
import config from '../config'
import * as LotteryService from '../service/Lottery'
import WinnerModel from '@/models/winnerModel'
import WinsNotArriveModel from '@/models/winsNotArriveModel'
@Controller({
  prefix: '/api'
})
class Lottery {
  @Request({
    url: '/getData',
    method: RequestMethod.GET
  })
  async getData (ctx) {
    let data = await LotteryService.getData()
    ctx.body = genSuccessResponse(data)
  }

  @Request({
    url: '/exportFile',
    method: RequestMethod.GET
  })
  async exportFile (ctx) {
    let defaultType = 0
    let outData = [['工号', '姓名', '花名', '奖品', '奖品等级']]
    let winners = await WinnerModel.find({}).sort({ type: 1, subType: 1, title: 1}).exec()
    winners.forEach(user => {
      outData.push([user.code, user.name, user.nickName, user.prizeName, user.type === defaultType ? '特等奖' : `${user.type}等奖`])
    })
    let filename = '/抽奖结果.xlsx'
    let paths = path.join(__dirname, '../', config.staticPath, filename)
    writeXML(outData, paths)
    ctx.body = genSuccessResponse({ msg: '导出数据成功', url:  filename})
  }

  @Request({
    url: '/reset',
    method: RequestMethod.POST
  })
  async reset (ctx) {
    await WinnerModel.remove({}).exec()
    await WinsNotArriveModel.remove({}).exec()
    ctx.body = genSuccessResponse()
  }
}

export default Lottery
