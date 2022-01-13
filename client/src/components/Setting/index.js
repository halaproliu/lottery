import React, { useState, useEffect, useRef } from 'react'
import { prizeList } from '@/constant'
import './index.styl'
import * as LotteryApi from '@/api/lottery'
import MySelect from '../Select'

function Setting () {
  let [ winnerUsers, setWinnerUsers ] = useState({})
  let [ selectUsers, setSelectUsers ] = useState([])
  let [ prizes, setPrizes ] = useState([])
  let [ title, setTitle ] = useState('')
  let [ user, setUser ] = useState('')
  let selectUser = useRef(null)
  const initData = async () => {
    const { winnerUsers } = await LotteryApi.getData()
    setWinnerUsers(winnerUsers)
  }

  const initPrizes = () => {
    let arr = prizeList.filter(prize => {
      let index = `${prize.type}-${prize.subType}`
      if ((winnerUsers[index] || []).length) {
        console.log(11)
        return prize
      }
    })
    setPrizes([...arr])
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
    setTitle(val)
    getSelectUsers(val)
    setUser(() => '')
  }
  
  const onSelectUser = (val) => {
    setUser(() => val)
    selectUser.current = selectUsers.find(item => item[2] === val)
  }

  const removeSelectUser = (user) => {
    let len = selectUsers.length - 1
    for (let i = len; i >= 0; i--) {
      if (selectUsers[i][0] === user[0]) {
        selectUsers.splice(i, 1)
        setSelectUsers([...selectUsers])
        break
      }
    }
  }

  const onSubmit = async () => {
    if (!title || !selectUser.current.length) {
      return alert('请选择移除的用户')
    }
    let prize = getSelectedPrize(title)
    if ((winnerUsers[`${prize.type}-${prize.subType}`] || []).length === 0) {
      return alert('不存在需要移除的用户')
    }
    await LotteryApi.removeNotArrivedUser({
      type: prize.type,
      subType: prize.subType,
      user: selectUser.current
    })
    removeSelectUser(selectUser.current)
    setUser('')
    alert('移除中奖人员成功')
  }

  useEffect(() => {
    initData()
    getSelectUsers(prizeList[0].title)
  }, [])

  useEffect(() => {
    initPrizes()
  }, [winnerUsers])
  
  return (
    <div className="setting-box">
      <MySelect currentValue={title} options={prizes} labelKey="title" valueKey="title" idKey="title" onChange={onChange}></MySelect>
      <MySelect currentValue={user} options={selectUsers} labelKey="2" valueKey="2" idKey="2" onChange={onSelectUser}></MySelect>
      <button style={{ marginTop: "20px" }} className="btn btn-primary" onClick={onSubmit}>移除中奖</button>
    </div>
  )
}

export default Setting
