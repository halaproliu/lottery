import React, { useState, useRef, useEffect } from 'react'
// import '@/libs/canvas'
import music from '@/assets/music/music.mp3'
import './App.styl';
import { prizeList } from '@/constant'
import * as Lottery from '@/api/lottery'
import Stars from '@/libS/Stars'

let stopAnimate = false
function App() {
  let [ rotated, setRotated ] = useState(0)
  let [ musicStyle, setMusicStyle ] = useState({})
  const audioRef = useRef(null)
  const canvasRef = useRef(null)
  const animateFn = () => {
      window.requestAnimationFrame(() => {
      if (stopAnimate) return
      setMusicStyle({
        transform: `rotate(${rotated % 360}deg)`
      })
      setRotated(++rotated)
      animateFn()
    })
  }
  const onMusicPlay = () => {
    let audio = audioRef.current
    if (audio.paused) {
      audio.play().then(_ => {
        stopAnimate = false
        animateFn()
      }).catch(e => {
        console.log(e)
      })
    } else {
      audio.pause()
      stopAnimate = true
    }
  }

  const init = async () => {
    const res = await Lottery.getUsers()
    console.log(res)
    let stars = new Stars(canvasRef.current)
    stars.init()
  }

  useEffect(() => {
    audioRef.current.play()
    init()
  })
  return (
    <>
      <div className="lottery-container">
        <div className="canvas-box">
          <canvas id="canvas" ref={canvasRef}></canvas>
        </div>
        <div className="lottery-music">
          <audio ref={audioRef} className="lottery-music__item" src={music}></audio>
          <div className="lottery-music__box" style={musicStyle} onClick={onMusicPlay}>Music</div>
        </div>
        <div className="lottery-prizeBar">
          <div className="lottery-prizeBar__title">
            正在抽取
            <label className="lottery-prizeBar__label">5等奖</label>
            <label className="lottery-prizeBar__label">凌美钢笔</label>
            ，剩余
            <label className="lottery-prizeBar__label">35</label>个
          </div>
          <ul className="lottery-prizeBar__list">
            {
              prizeList.map((prize, index) => {
                return (
                  <li className="lottery-prizeBar__item" key={prize.type || index + Date.now()}>
                    <div className="lottery-prizeBar__img">
                      <img src={prize.img} alt={prize.title} />
                    </div>
                    <div className="lottery-prizeBar__text">
                      <h5 className="lottery-prizeBar__text-title">{ prize.type }等奖 { prize.title }</h5>
                      <div className="lottery-prizeBar__count">
                        <div className="progress">
                            <div className="progress-bar progress-bar-danger progress-bar-striped active" style={{width: '100%' }}></div>
                        </div>
                        <div className="lottery-prizeBar__count-left">
                            {prize.count + '/' + prize.count}
                        </div>
                    </div>
                    </div>
                  </li>
                )
              })
            }
          </ul>
        </div>
        <div className="lottery-menu">
          <button>进入抽奖</button>
          <div className="lottery-none">
            <button>抽奖</button>
            <button>重新抽奖</button>
            <button>导出抽奖结果</button>
            <button>重置</button>
          </div>
        </div>
        <div className="lottery-bubble__container">
          <div className="lottery-bubble animated"></div>
        </div>
      </div>
    </>
  );
}

export default App;
