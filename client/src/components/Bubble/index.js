import React from 'react'
import './index.styl'

function Bubble (props) {
  let { message, animateClass } = props
  const _className = 'lottery-bubble animated'
  let className = `${_className} ${animateClass}`
  return (
    <div className="lottery-bubble__container">
      {
        message && <div className={className}>{ message }</div>
      }
    </div>
  )
}

export default Bubble