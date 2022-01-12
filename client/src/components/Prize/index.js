import React from 'react'
import './index.styl'
import { prizeList } from '@/constant'
import classnames from 'classnames'
import { useSelector } from 'react-redux'

function Prize (props) {
  const selectedIndex = useSelector(state => state.lottery.selectedIndex)
  const selected = useSelector(state => state.lottery.selected)
  const preSelected = useSelector(state => state.lottery.preSelected)
  const preSelectedIndex = useSelector(state => state.lottery.preSelectedIndex)
  const winnerUsers = props.winnerUsers || {}
  let index = `${preSelected.type}-${preSelected.subType}`
  let currCount = preSelected.count - (winnerUsers[index] || []).length
  return (
    <div className="lottery-prizeBar">
      <div className="lottery-prizeBar__title">
        正在抽取
        <label className="lottery-prizeBar__label">{ preSelected.type === 0 ? '特' : preSelected.type }等奖</label>
        <label className="lottery-prizeBar__label">{ preSelected.title }</label>
        ，剩余
        <label className="lottery-prizeBar__label">{ currCount }</label>个
      </div>
      <ul className="lottery-prizeBar__list">
        {
          prizeList.map((prize, index) => {
            let key = `${prize.type}-${prize.subType}`
            let hasLotteryCount = (winnerUsers[key] || []).length
            let leftCount = prize.count - hasLotteryCount
            // let isShow = prize.type === selected.type
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
                      {/* <CountComp selectedIndex={selectedIndex} index={index} prize={prize} currCount={currCount}></CountComp> */}
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
