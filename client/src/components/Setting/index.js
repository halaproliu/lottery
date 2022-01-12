import React, { useState, useEffect } from 'react'
import { prizeList } from '@/constant'
import './index.styl'
import * as LotteryApi from '@/api/lottery'
import MySelect from '../Select'

function Setting () {
  let [ winnerUsers, setWinnerUsers ] = useState([])
  let [ selectUsers, setSelectUsers ] = useState([])
  let [ title, setTitle ] = useState('')
  const initData = async () => {
    const { winnerUsers } = await LotteryApi.getData()
    setWinnerUsers(winnerUsers)
  }

  const getSelectedPrize = (title) => {
    let prize = prizeList.find(item => item.title === title) || {}
    return prize
  }

  const getSelectUsers = (title) => {
    let prize = getSelectedPrize(title)
    let key = `${prize.type}-${prize.subType}`
    let users = (winnerUsers[key] || [])
    setSelectUsers([...users])
  }

  const onChange = (val) => {
    console.log(val)
    let title = val
    setTitle(title)
    getSelectUsers(title)
  }

  const onSubmit = () => {
    let prize = getSelectedPrize(title)
    LotteryApi.removeNotArrivedUser({
      type: prize.type,
      subType: prize.subType,
      user: selectUsers[0]
    })
  }

  useEffect(() => {
    initData()
    getSelectUsers(prizeList[0].title)
  }, [])
  
  return (
    <div className="setting-box">
      <MySelect options={prizeList} labelKey="title" valueKey="title" idKey="title" onChange={onChange}></MySelect>
      <select className="prize-list__select">
        <option value="">请选择</option>
        {
          selectUsers.map(user => {
            return (
              <option value={user[0]} key={user[0]}>{ user[1] }</option>
            )
          })
        }
      </select>
      <button className="btn btn-primary" onClick={onSubmit}>移除中奖</button>
    </div>
  )
}

export default Setting
