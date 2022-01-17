import React, { useState, useRef, useEffect } from 'react'
import Bubble from '@/components/Bubble'
import MESSAGES from '@/constant/message'
import Lottery from '@/libs/lottery'
import { useSelector, useDispatch } from 'react-redux'
import './index.styl'

const Main = () => {
    const containerRef = useRef(null)
    const lotteryInstance = useRef(null)
    const [ showLottey, setShowLottery ] = useState(false)
    const [ message, setMessage ] = useState('')
    const [ animateClass, setAnimateClass ] = useState('')
    const selected = useSelector(state => state.lotterys.selected)
    const selectedIndex = useSelector(state => state.lotterys.selectedIndex)
    const users = useSelector(state => state.lotterys.users)
    const winnerUsers = useSelector(state => state.lotterys.winnerUsers)
    const remainUsers = useSelector(state => state.lotterys.remainUsers)
    const dispatch = useDispatch()
    // 展示弹框提示
    const showBubble = (i, options) => {
        let _msg = MESSAGES[i]
        options && Object.keys(options).forEach(key => {
            let reg = new RegExp(`{${key}}`)
            _msg = _msg.replace(reg, options[key])
        })
        setMessage(_msg)
        setAnimateClass('bounceInRight')
        setTimeout(() => {
            setAnimateClass('bounceOutRight')
        }, 4000)
    }

    const toShowLottery = (e) => {
        e.stopPropagation()
        lotteryInstance.current.toShowLottery()
    }

    const goLottery = async (e) => {
        e.stopPropagation()
        lotteryInstance.current.goLottery()
    }
    const reLottery = (e) => {
        e.stopPropagation()
        lotteryInstance.current.reLottery()
    }
    const exportResult = (e) => {
        e.stopPropagation()
        lotteryInstance.current.exportResult()
    }
    const resetData = (e) => {
        e.stopPropagation()
        lotteryInstance.current.resetData()
    }

    const saveData = (e) => {
        e.stopPropagation()
        lotteryInstance.current.saveData()
    }
    
    useEffect(() => {
        if (users.length && remainUsers.length && selected && selectedIndex) {
            const basicData = { users, winnerUsers, remainUsers, selected, selectedIndex }
            const fns = { setShowLottery, showBubble, dispatch }
            lotteryInstance.current = new Lottery(containerRef, basicData, fns)
            lotteryInstance.current.init()
            const onWindowResize = () => {
                lotteryInstance.current.onWindowResize()
            }
            window.addEventListener('resize', onWindowResize, false)
            return () => {
                window.removeEventListener('resize', onWindowResize, false)
            }
        }
    }, [users, winnerUsers, remainUsers, selected, selectedIndex])

    return (
        <>
            <div ref={containerRef} className="lottery-container"></div>
            <div className="lottery-menu">
            {
                !showLottey 
                ? 
                (<button className="btn" onClick={toShowLottery}>进入抽奖</button>)
                :
                (
                    <div>
                        <button className="btn" onClick={goLottery}>抽奖</button>
                        <button className="btn" onClick={reLottery}>重新抽奖</button>
                        <button className="btn" onClick={saveData}>保存数据</button>
                        <button className="btn" onClick={exportResult}>导出抽奖结果</button>
                        <button className="btn" onClick={resetData}>重置</button>
                    </div>
                )
            }
            {
                message && <Bubble message={message} animateClass={animateClass}></Bubble>
            }
            </div>
        </>
    )
}

export default Main
