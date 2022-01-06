const genSuccessResponse = data => {
  const defaults = {
    code: 200,
    msg: '成功'
  }

  return {
    ...defaults,
    data
  }
}

export { genSuccessResponse }
