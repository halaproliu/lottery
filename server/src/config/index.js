export default {
  port: '3001', // http服务端口号
  db: {
    url: 'mongodb://localhost:27017/lottery' // mongodb链接地址
  },
  staticPath: './static', // 静态目录
  useMongo: true // 是否使用mongo
}
