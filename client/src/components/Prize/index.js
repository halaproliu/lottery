import React from 'react'
import './index.styl'
import { prizeList } from '@/constant'
import classnames from 'classnames'

const CountComp = (props) => {
  const prize = props.prize
  const currCount = props.currCount
  if (props.selectedIndex === props.index) {
    return <div className="lottery-prizeBar__count-left">{currCount + '/' + prize.count}</div>
  } else if (props.selectedIndex < props.index) {
    return <div className="lottery-prizeBar__count-left">{0 + '/' + prize.count}</div>
  } else {
    return <div className="lottery-prizeBar__count-left">{prize.count + '/' + prize.count}</div>
  }
}
function Prize (props) {
  let selected = props.selected
  let selectedIndex = props.selectedIndex
  let barWidth = props.barWidth
  let currCount = props.currCount
  return (
    <div className="lottery-prizeBar">
      <div className="lottery-prizeBar__title">
        正在抽取
        <label className="lottery-prizeBar__label">{ selected.type === 0 ? '特' : selected.type }等奖</label>
        <label className="lottery-prizeBar__label">{ selected.title }</label>
        ，剩余
        <label className="lottery-prizeBar__label">{ currCount }</label>个
      </div>
      <ul className="lottery-prizeBar__list">
        {
          prizeList.map((prize, index) => {
            return (
              <li className={classnames('lottery-prizeBar__item', {'shine': selectedIndex === index})} key={prize.type || index + Date.now()}>
                <div className="lottery-prizeBar__img">
                  <img src={prize.img} alt={prize.title} />
                </div>
                <div className="lottery-prizeBar__text">
                  <h5 className="lottery-prizeBar__text-title">{ prize.type === 0 ? '特' : prize.type }等奖 { prize.title }</h5>
                  <div className="lottery-prizeBar__count">
                    <div className="progress">
                        <div className="progress-bar progress-bar-danger progress-bar-striped active" style={{ width: selectedIndex === index ? barWidth : selectedIndex < index ? 0 : '100%' }}></div>
                    </div>
                    <CountComp selectedIndex={selectedIndex} index={index} prize={prize} currCount={currCount}></CountComp>
                </div>
                </div>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default Prize
