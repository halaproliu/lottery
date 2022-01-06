/**
 * @description 异常处理
 * @author halapro.liu
 * @param {*} ctx
 * @param {*} next
 */
 const errorHandler = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500
    ctx.body = {
      code: ctx.status,
      message: err.message
    }
  }
}

export default errorHandler
