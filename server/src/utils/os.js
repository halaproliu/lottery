import os from 'os'
const getIPAddress = _ => {
  let address = ''
  let interfaces = os.networkInterfaces()
  for (let key in interfaces) {
    let item = interfaces[key]
    for (let i = 0; i < item.length; i++) {
      let port = item[i]
      if (port.family === 'IPv4' && port.address !== '127.0.0.1' && !port.internal) {
        address = port.address
      }
    }
  }
  return address
}

export {
  getIPAddress
}
