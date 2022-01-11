import React, { useState, useEffect } from 'react'
import { prizeList } from '@/constant'
import './index.styl'
import * as LotteryApi from '@/api/lottery'

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

  const onChange = (e) => {
    let title = e.target.value
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
    console.log(prizeList[0].title)
    getSelectUsers(prizeList[0].title)
  }, [])
  
  return (
    <div className="setting-box">
      <select className="prize-list__select" onChange={onChange}>
        {
          prizeList.map(prize => {
            return (
              <option value={prize.title} key={prize.title}>{ prize.title }</option>
            )
          })
        }
      </select>
      <select className="prize-list__select">
        {
          selectUsers.map(user => {
            return (
              <option value={user[0]} key={user[0]}>{ user[1] }</option>
            )
          })
        }
      </select>
      <button className="btn btn-primary" onClick={onSubmit}>提交</button>
    </div>
  )
}

export default Setting