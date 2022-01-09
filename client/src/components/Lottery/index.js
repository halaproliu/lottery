import React, { useState, useRef, useEffect } from 'react'
import music from '@/assets/music/music.mp3'
import '@/assets/css/animate.min.css'
import './index.styl';
import * as LotteryApi from '@/api/lottery'
import Stars from '@/libs/Star'
import LotterCard from '@/libs/LotteryCard'
import Prize from '@/components/Prize'
import Bubble from '@/components/Bubble'
import * as config from '@/constant/prize'
import { prizeList } from '@/constant'

let stopAnimate = false
function Lottery() {
  let len = prizeList.length - 1
  let [ rotated, setRotated ] = useState(0)
  let [ musicStyle, setMusicStyle ] = useState({})
  let [ showLottey, setShowLottery ] = useState(false)
  let [ message, setMessage ] = useState('')
  let [ animateClass, setAnimateClass ] = useState('')
  const [ selectedIndex, setSelectedIndex ] = useState(len)
  const [ selected, setSelected ] = useState(prizeList[len])
  const [ barWidth, setBarWidth ] = useState('100%')
  const audioRef = useRef(null)
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  let winners = []
  let lotteryCard
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

  const getCurrentPrize = () => {
    for (let i = len; i >= 0; i--) {
      if (winners[i] && winners[i].length >= prizeList[i].count) {
        continue
      }
      setSelectedIndex(i)
      setSelected(prizeList[selectedIndex])
      break
    }
  }

  // 展示弹框提示
  const showBubble = (msg) => {
    setMessage(msg)
    setAnimateClass('bounceInRight')
    setTimeout(() => {
      setAnimateClass('bounceOutRight')
    }, 4000)
  }
  
  const toShowLottery = () => {
    setShowLottery(true)
    if (lotteryCard) {
      lotteryCard.removeHighlight()
      lotteryCard.switchScreen('lottery')
      showBubble(`马上抽取[${selected.title}],不要走开。`)
    }
  }

  const goLottery = () => {
    console.log(lotteryCard)
    if (lotteryCard) {
      console.log(11)
      lotteryCard.lottery()
    }
  }

  const reLottery = () => {
    if (lotteryCard) {
      lotteryCard.reLottery()
    }
  }

  const exportResult = () => {
    if (lotteryCard) {
      lotteryCard.exportResult()
    }
  }

  const resetData = () => {
    if (lotteryCard) {
      lotteryCard.reset()
    }
  }

  const init = async () => {
    const { winnerUsers, remainUsers } = await LotteryApi.getData()
    const { users } = await LotteryApi.getUsers()
    getCurrentPrize()
    let stars = new Stars(canvasRef.current)
    stars.init()
    let basicData = {
      users,
      winnerUsers,
      remainUsers,
      selectedIndex,
      selected
    }
    let fns = {
      setBarWidth,
      showBubble
    }
    lotteryCard = new LotterCard(config, basicData, containerRef, fns)
    lotteryCard.init()
  }

  init()

  useEffect(() => {
    // audioRef.current.play()
    // if (lotteryCard) {
    //   lotteryCard.init()
    // }
  }, [showLottey])
  return (
    <>
      <div className="canvas-box">
        <canvas id="canvas" ref={canvasRef}></canvas>
      </div>
      <div className="lottery-music">
        <audio ref={audioRef} className="lottery-music__item" src={music}></audio>
        <div className="lottery-music__box" style={musicStyle} onClick={onMusicPlay}>Music</div>
      </div>

      <Prize selected={selected} selectedIndex={selectedIndex} barWidth={barWidth}></Prize>
      
      <div ref={containerRef} className="lottery-container"></div>
      <div className="lottery-menu">
        {
          !showLottey 
            ? 
            (<button onClick={toShowLottery}>进入抽奖</button>)
            :
            (
              <div>
                <button onClick={goLottery}>抽奖</button>
                <button onClick={reLottery}>重新抽奖</button>
                <button onClick={exportResult}>导出抽奖结果</button>
                <button onClick={resetData}>重置</button>
              </div>
            )
        }
        
      </div>
      <Bubble message={message} animateClass={animateClass}></Bubble>
    </>
  );
}

export default Lottery;
