import path from 'path'
import 'module-alias/register'
import Koa from 'koa'
import logger from 'koa-logger'
import bodyParser from 'koa-bodyparser'
import serve from 'koa-static'
import cors from 'koa-cors'
import convert from 'koa-convert'
import config from './config'
import router from './routers'
import errorHanlder from './middlewares/error'
import mongoose from 'mongoose'
import log from './utils/log'
import {
    getIPAddress
} from './utils/os.js'

const app = new Koa()
const port = config.port || '3000' // 端口号

if (config.useMongo) {
    // mongoose.set('useFindAndModify', false)
    // mongoose.set('useCreateIndex', true)
    // mongoose.set('useNewUrlParser', true)
    mongoose.connect(config.db.url) // 连接mongo
}

const middlewares = [
    convert(cors()),
    logger(),
    bodyParser(),
    serve(path.join(__dirname, config.staticPath)),
    errorHanlder
]

// 挂载中间件
middlewares.forEach(middleware => {
    if (!middleware) return
    app.use(middleware)
})

router(app)


// 监听错误
app.on('error', err => {
    log('cyan', err)
})

// 启动静态服务器
const server = app.listen(port, _ => {
    log('green', '************************************')
    log('green', 'App running at：')
    log('green', '- Local:   http://localhost:' + port)
    log('green', '- Network: http://' + getIPAddress() + ':' + port)
    log('green', '************************************')
})

// 监听ctrl+c退出事件
process.on('SIGINT', () => {
    log('yellow', 'Stopping dev server')
    server.close(() => {
        process.exit(0)
    })
})
