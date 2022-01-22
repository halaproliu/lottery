import React, { useState, useEffect } from 'react'
import './index.styl'
import classnames from 'classnames'
import { useSelector } from 'react-redux'

function Prize () {
  const prizes = useSelector(state => state.lotterys.prizes)
  const winnerUsers = useSelector(state => state.lotterys.winnerUsers)
  const selected = useSelector(state => state.lotterys.selected)
  const selectedIndex = useSelector(state => state.lotterys.selectedIndex)
  const preSelected = useSelector(state => state.lotterys.preSelected)
  const preSelectedIndex = useSelector(state => state.lotterys.preSelectedIndex)
  let [ currCount, setCurrCount ] = useState(0)
  const getCurrentWinners = (obj) => {
    return winnerUsers.filter(user => user.type === obj.type && user.title === obj.title) || []
  }
  useEffect(() => {
    if (prizes.length && selected) {
      setCurrCount(selected.count - getCurrentWinners(selected).length)
    }
  }, [selectedIndex, JSON.stringify(selected), JSON.stringify(winnerUsers), JSON.stringify(prizes)])
  return (
    <div className="lottery-prizeBar">
      <div className="lottery-prizeBar__title">
        正在抽取
        <label className="lottery-prizeBar__label">{ selected.type === 0 ? '特' : selected.type }等奖</label>
        <label className="lottery-prizeBar__label">{ selected.title }</label>
        ，剩余
        <label className="lottery-prizeBar__label">{ currCount.toString() }</label>个
      </div>
      <ul className="lottery-prizeBar__list">
        {
          prizes.length && selected && prizes.map((prize, index) => {
            let key = prize._id
            let hasLotteryCount = getCurrentWinners(prize).length
            let leftCount = prize.count - hasLotteryCount
            let isShow = prize.type === preSelected.type
            let barWidth = `${(leftCount / prize.count) * 100}%`
            return (
              isShow && (
                <li className={classnames('lottery-prizeBar__item', {'shine': preSelectedIndex === index})} key={key}>
                  <div className="lottery-prizeBar__img">
                    <img src={prize.img} alt={prize.title} />
                  </div>
                  <div className="lottery-prizeBar__text">
                    <h5 className="lottery-prizeBar__text-title">{ prize.type === 0 ? '特' : prize.type }等奖 { prize.title }</h5>
                    <div className="lottery-prizeBar__count">
                      <div className="progress">
                          <div className="progress-bar progress-bar-danger progress-bar-striped active" style={{ width: barWidth }}></div>
                      </div>
                      <div className="lottery-prizeBar__count-left">{leftCount + '/' + prize.count}</div>
                  </div>
                  </div>
                </li>
              )
            )
          })
        }
      </ul>
    </div>
  )
}

export default Prize
