import path from 'path'
import { getDirList } from '../utils/fileUtils'
import KoaRouter from 'koa-router'
/**
 * @description 请求接口添加url和method
 * @author halapro.liu
 * @param {*} { url, method } 接口地址和请求方法
 * @returns
 */
export function Request({ url, method }) {
  return function(target, name, descriptor) {
    let fn = descriptor.value
    descriptor.value = router => {
      router[method](url, async (ctx, next) => {
        await fn(ctx, next)
      })
    }
  }
}

export const RequestMethod = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete'
}
/**
 * @description 定义controller，并允许添加前缀
 * @author halapro.liu
 * @param {*} { prefix } 接口前缀
 * @returns
 */
export function Controller({ prefix }) {
  let router = new KoaRouter()
  if (prefix) {
    router.prefix(prefix)
  }
  return function(target) {
    let reqList = Object.getOwnPropertyDescriptors(target.prototype)
    for (let v in reqList) {
      // 排除类的构造方法
      if (v !== 'constructor') {
        let fn = reqList[v].value
        fn(router)
      }
    }
    return router
  }
}
/**
 * @description 获取routers文件夹目录的所有文件，并进行接口方法合并
 * @author halapro.liu
 * @returns
 */
export function mixins() {
  return function(target) {
    let fileList = []
    let dir = path.join(__dirname, '../routers')
    getDirList(dir).then(list => {
      fileList = list.map(item => require(`../routers/${item}`).default)
      fileList.forEach(item => {
        target.stack = [...target.stack, ...item.stack]
      })
    })
  }
}

export function staticMixins(...list) {
  return function(target) {
    list.forEach(item => {
      target.stack = [...target.stack, ...item.stack]
    })
  }
}
