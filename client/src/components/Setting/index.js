import React, { useState, useEffect } from 'react'
import { prizeList } from '@/constant'
import './index.styl'
import * as LotteryApi from '@/api/lottery'
import MySelect from '../Select'

function Setting () {
  let [ winnerUsers, setWinnerUsers ] = useState([])
  let [ selectUsers, setSelectUsers ] = useState([])
  let [ title, setTitle ] = useState('')
  let [ user, setUser ] = useState('')
  let selectUser = []
  const initData = async () => {
    const { winnerUsers } = await LotteryApi.getData()
    setWinnerUsers(winnerUsers)
  }

  const getSelectedPrize = (title) => {
    let prize = prizeList.find(item => item.title === title) || {}
    return prize
  }

  const getSelectUsers = (title) => {
    console.log(title)
    let prize = getSelectedPrize(title)
    console.log(prize)
    let key = `${prize.type}-${prize.subType}`
    let users = (winnerUsers[key] || [])
    setSelectUsers([...users])
  }

  const onChange = (val) => {
    setTitle(val)
    getSelectUsers(val)
    setUser(() => '')
    console.log(user)
  }
  
  const onSelectUser = (val) => {
    setUser(() => val)
    selectUser = selectUsers.find(item => item[2] === val)
  }

  const onSubmit = async () => {
    let prize = getSelectedPrize(title)
    await LotteryApi.removeNotArrivedUser({
      type: prize.type,
      subType: prize.subType,
      user: selectUser
    })
    alert('移除中奖人员成功')
  }

  useEffect(() => {
    initData()
    getSelectUsers(prizeList[0].title)
  }, [])
  
  return (
    <div className="setting-box">
      <MySelect currentValue={title} options={prizeList} labelKey="title" valueKey="title" idKey="title" onChange={onChange}></MySelect>
      <MySelect currentValue={user} options={selectUsers} labelKey="2" valueKey="2" idKey="2" onChange={onSelectUser}></MySelect>
      <button style={{ marginTop: "20px" }} className="btn btn-primary" onClick={onSubmit}>移除中奖</button>
    </div>
  )
}

export default Setting
