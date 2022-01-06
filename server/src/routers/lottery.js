import path from 'path'
import { Controller, Request, RequestMethod } from '../utils/decorator'
import { genSuccessResponse } from '../utils/modelUtils'
import { loadXML } from '../utils/xml'
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
    let users = loadXML(path.join(cwd, 'data/users.xlsx'))
    console.log(users)
    ctx.body = genSuccessResponse({
      users
    })
  }

  @Request({
    url: '/getData',
    method: RequestMethod.GET
  })
  getData (ctx) {
    let users = loadXML(path.join(cwd, 'data/users.xlsx'))
    console.log(users)
    ctx.body = genSuccessResponse({
      users
    })
  }


}

export default Lottery