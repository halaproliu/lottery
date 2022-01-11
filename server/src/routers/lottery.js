import path from 'path'
import { Controller, Request, RequestMethod } from '../utils/decorator'
import { genSuccessResponse } from '../utils/modelUtils'
import { writeXML } from '../utils/xml'
import config from '../config'
import { getUserData, getWinnerData, getNotArriveWinnersData, getRemainData, resetData, saveFileData } from '../service/Lottery'

@Controller({
  prefix: '/api'
})
class Lottery {
  @Request({
    url: '/getUsers',
    method: RequestMethod.GET
  })
  getUsers (ctx) {
    let users = getUserData()
    ctx.body = genSuccessResponse({
      users
    })
  }

  @Request({
    url: '/getData',
    method: RequestMethod.GET
  })
  getData (ctx) {
    let remainUsers = getRemainData()
    let winnerUsers = getWinnerData()
    ctx.body = genSuccessResponse({
      winnerUsers,
      remainUsers
    })
  }

  @Request({
    url: '/saveData',
    method: RequestMethod.POST
  })
  saveData (ctx) {
    let params = ctx.request.body
    let type = params.type
    let data = params.data
    let winners = getWinnerData() || {}
    if (winners[type]) {
      winners[type].push.apply(winners[type], data)
    } else {
      winners[type] = Array.isArray(data) ? data : [data]
    }
    saveFileData(winners, 1)
    ctx.body = genSuccessResponse({
      msg: '保存奖品数据成功'
    })
  }

  @Request({
    url: '/saveNotArriveWinnerData',
    method: RequestMethod.POST
  })
  saveNotArriveWinnerData (ctx) {
    let params = ctx.request.body
    let type = params.type
    let data = params.data
    let winners = getNotArriveWinnersData() || {}
    if (winners[type]) {
      winners[type].push.apply(winners[type], data)
    } else {
      winners[type] = Array.isArray(data) ? data : [data]
    }
    saveFileData(winners, 2)
    ctx.body = genSuccessResponse({
      msg: '保存未到场人员奖品数据成功'
    })
  }

  @Request({
    url: '/exportFile',
    method: RequestMethod.GET
  })
  exportFile (ctx) {
    let type = [1, 2, 3, 4, 5, 0]
    let defaultType = 0
    let outData = [['工号', '姓名', '部门']]
    let winners = getWinnerData() || {}
    type.forEach((item) => {
      outData.push(item === defaultType ? ['特等奖'] : [`${item}等奖`]);
      outData = outData.concat(winners[item] || []);
    })
    // let filename = `/抽奖结果_${Date.now()}.xlsx`
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
  reset (ctx) {
    resetData()
    ctx.body = genSuccessResponse()
  }
}

export default Lottery
