import xlsx from 'node-xlsx'
import fs from 'fs'
import path from 'path'
import { writeFile } from './fileUtils'

/**
 * @description 读取文件数据
 * @param {*} xmlPath 
 * @returns 
 */
export const loadXML = xmlPath => {
  let userData = xlsx.parse(xmlPath);
  let outData = [];
  userData.forEach(item => {
    outData = item.data;
    outData.shift();
    return false;
  });
  outData = outData.filter(item => item.length > 0);
  return outData;
}

export const writeXML = (data, name) => {
  let buffer = xlsx.build([{
    name: '抽奖结果',
    data
  }])
  writeFile(name, buffer)
}

export const saveDataFile = data => {
  let tmpData = JSON.stringify(data, '', 2)
  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(cwd, 'temp.json'), data, (err) => {
        if (err) {
            reject(err);
            return;
        }
        resolve();
        console.log('数据写入成功');
    });
  });
}

export const saveErrorDataFile = (data) => {
  data = JSON.stringify(data, '', 2);

  return new Promise((resolve, reject) => {
      fs.writeFile(path.join(cwd, 'error.json'), data, (err) => {
          if (err) {
              reject(err);
              return;
          }
          resolve();
          console.log('数据写入成功');
      });
  });
}

/**
 * 读取缓存的数据内容
 */
 export const loadTempData = () => {
  let pros = [];
  pros.push(new Promise((resolve, reject) => {
      fs.readFile(path.join(cwd, 'temp.json'), 'utf8', (err, data) => {
          if (err) {
              resolve({});
              return;
          }
          resolve(JSON.parse(data));
      })
  }));

  pros.push(new Promise((resolve, reject) => {
      fs.readFile(path.join(cwd, 'error.json'), 'utf8', (err, data) => {
          if (err) {
              resolve([]);
              return;
          }
          resolve(JSON.parse(data));
      })
  }));

  return Promise.all(pros);
}
