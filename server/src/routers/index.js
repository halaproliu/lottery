import {
  getDirList
} from '../utils/fileUtils'
import path from 'path'

const registerRouter = async (app) => {
  let dir = path.join(__dirname, '../routers')
  let list = await getDirList(dir)
  list.map(item => {
    if (item !== 'index.js') {
        let router = require(`../routers/${item}`).default
        app.use(router.routes())
        app.use(router.allowedMethods())
    }
  })
}


export default registerRouter
