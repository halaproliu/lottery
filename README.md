# 抽奖程序

### 初始化

##### 前端

```js
cd client
npm i
npm start
```

### node端

```js
cd server
npm i
npm start
```

### 配置修改

- client/src/constant/index.js

修改奖品信息

- client/src/constant/prize.js

配置显示信息

- server/src/config/prize.js

配置奖品信息，用于导出时解析奖品名称

- client/assets/music/music.mp3

替换此文件，可以更改背景音乐

- server/data/user1.xlsx

抽奖用户名单

### 使用

### 前端

```js
cd client
npm start
```

### node端

目前抽奖数据保存在json文件中，使用npm start启动会监听文件变化，导致修改时，可能引起服务重启

```js
cd server
npm run dev
```

### 配置数据导入mongodb

- 导入奖品列表

```sh
mongoimport -h 127.0.0.1:27017 -d lottery -c prizes --file data/prizes.json
```
