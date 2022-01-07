import path from 'path'
import { Controller, Request, RequestMethod } from '../utils/decorator'
import { genSuccessResponse } from '../utils/modelUtils'
import { writeXML } from '../utils/xml'
import { getUserData, getWinnerData, getNotArriveWinnersData, getRemainData } from '../service/Lottery'
const cwd = process.cwd()

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
    let type = ctx.params.type
    let data = ctx.params.data
    let winners = getWinnerData() || {}
    if (winners[type]) {
      winners[type].push.apply(winners[type], data)
    } else {
      winners[type] = Array.isArray(data) ? data : [data]
    }
    saveFileData(JSON.stringify(winners), 1)
    ctx.body = genSuccessResponse({
      msg: '保存奖品数据成功'
    })
  }

  @Request({
    url: '/saveNotArriveWinnerData',
    method: RequestMethod.POST
  })
  saveNotArriveWinnerData (ctx) {
    let type = ctx.params.type
    let data = ctx.params.data
    let winners = getNotArriveWinnersData() || {}
    if (winners[type]) {
      winners[type].push.apply(winners[type], data)
    } else {
      winners[type] = Array.isArray(data) ? data : [data]
    }
    saveFileData(JSON.stringify(winners), 2)
    ctx.body = genSuccessResponse({
      msg: '保存未到场人员奖品数据成功'
    })
  }

  @Request({
    url: '/export',
    method: RequestMethod.GET
  })
  exportData (ctx) {
    let type = [1, 2, 3, 4, 5, 0]
    let outData = [['工号', '姓名', '部门']]
    writeXML(outData)
    type.forEach((item) => {
      outData.push(item === defaultType ? ['特别奖'] : [`${item}等奖`]);
      outData = outData.concat(luckyData[item] || []);
    })
    let filename = `/抽奖结果_${Date.now()}.xlsx`
    writeXML(outData, filename).then(_ => {
      ctx.body = genSuccessResponse({ msg: '导出数据成功', url: filename })
    }).catch(e => {
      ctx.body = genSuccessResponse({
        code: 0,
        msg: '导出数据失败',
        error: e
      })
    })
  }




}

export default Lottery