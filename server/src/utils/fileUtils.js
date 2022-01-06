import fs from 'fs'
import path from 'path'
/**
 * @description 获取指定目录文件列表
 * @param {*} dirPath 目录路径
 * @returns fileList 文件列表
 */
export const getDirList = async dirPath => {
  let fileList = []
  let stats
  const files = await readdir(dirPath)
  for (let filename of files) {
    const fileDir = path.join(dirPath, filename)
    stats = await stat(fileDir)
    if (stats.isFile()) {
      fileList.push(filename)
    }
  }
  return fileList
}

function readdir(dirPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, files) => {
      if (err) reject(err)
      resolve(files)
    })
  })
}

function stat(dir) {
  return new Promise((resolve, reject) => {
    fs.stat(dir, (err, stats) => {
      if (err) reject(err)
      resolve(stats)
    })
  })
}
