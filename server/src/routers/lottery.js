import path from 'path'
import { Controller, Request, RequestMethod } from '../utils/decorator'
import { genSuccessResponse } from '../utils/modelUtils'
import { writeXML } from '../utils/xml'
import config from '../config'
import * as LotteryService from '../service/Lottery'
import { prizeList } from '../config/prize'
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
  exportFile (ctx) {
    let defaultType = 0
    let outData = [['工号', '姓名', '部门']]
    let winners = getWinnerData() || {}
    let keys = Object.keys(winners)
    keys.forEach((key) => {
      let prize = prizeList.find(item => `${item.type}-${item.subType}` === key) || {}
      outData.push(prize.type === defaultType ? ['特等奖', prize.title] : [`${prize.type}等奖`, prize.title]);
      outData = outData.concat(winners[key] || []);
    })
    let filename = '/抽奖结果.xlsx'
    let paths = path.join(__dirname, '../', config.staticPath, filename)
    writeXML(outData, paths)
    ctx.body = genSuccessResponse({ msg: '导出数据成功', url:  filename})
  }

  @Request({
    url: '/exportData',
    method: RequestMethod.GET
  })
  exportData (ctx) {
    let type = [1, 2, 3, 4, 5, 0]
    let defaultType = 0
    let fields = ['工号', '姓名', '部门']
    let winners = getWinnerData() || {}
    let outData = []
    type.forEach((item) => {
      outData.push(item === defaultType ? ['特等奖'] : [`${item}等奖`]);
      outData = outData.concat(winners[item] || []);
    })
    ctx.body = genSuccessResponse({
      data: {
        fields,
        data: outData
      }
    })
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

  @Request({
    url: '/removeNotArrivedUser',
    method: RequestMethod.POST
  })
  removeNotArrivedUser (ctx) {
    let params = ctx.request.body
    let type = params.type
    let subType = params.subType
    let user = params.user
    let index = `${type}-${subType}`
    let winners = getWinnerData() || {}
    let len = (winners[index] || []).length
    for (let i = len - 1; i >= 0; i--) {
      if (winners[index][i][0] === user[0]) {
        winners[index].splice(i, 1)
      }
    }
    saveFileData(winners, 3)
    ctx.body = genSuccessResponse({
      msg: '移除未到场人员成功'
    })
  }
}

export default Lottery
