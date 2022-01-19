import React, { useEffect, useCallback } from 'react'
import './index.styl'
import '@/assets/css/animate.min.css'
import Music from '@/components/Music'
import Prize from '@/components/Prize'
import Star from '@/components/Star'
import Main from '@/components/Mains'
import * as PrizeApi from '@/api/prize'
import * as LotteryApi from '@/api/lottery'
import { initData, setSelected } from '@/reducers/actions'
import { useSelector, useDispatch } from 'react-redux'

const Lottery = () => {
    const prizes = useSelector(state => state.lotterys.prizes)
    const winnerUsers = useSelector(state => state.lotterys.winnerUsers)
    const preSelectedUsers = useSelector(state => state.lotterys.preSelectedUsers)
    const preSelectedIndex = useSelector(state => state.lotterys.preSelectedIndex)
    const isLoaded = useSelector(state => state.lotterys.isLoaded)
    const dispatch = useDispatch()
    const onInit = useCallback(data => dispatch(initData(data)), [dispatch])
    const init = async () => {
        const prizes = await PrizeApi.getAllPrizes()
        const { users, winnerUsers, remainUsers } = await LotteryApi.getData()
        onInit({ prizes, users, winnerUsers, remainUsers })
    }

    const getCurrentWinners = (obj) => {
        return winnerUsers.filter(user => user.type === obj.type && user.title === obj.title) || []
    }

    const getCurrentPrize = () => {
        let len = prizes.length - 1
        for (let i = len; i >= 0; i--) {
            let currSelected = prizes[i]
            let currWinners = getCurrentWinners(currSelected)
            let count = currWinners.length
            if (preSelectedIndex === i) {
                count += preSelectedUsers.length
            }
             if (count >= currSelected.count) {
                if (i === 0) {
                    dispatch(setSelected({ index: i, value: currSelected }))
                }
                continue
            }
            dispatch(setSelected({ index: i, value: currSelected }))
            break
        }
    }

    useEffect(() => {
        init()
        document.body.style.backgroundColor = 'linear-gradient(to bottom, #131313 0%, #02101c 100%)'
        document.title = '抽奖程序'
    }, [])

    useEffect(() => {
        if (isLoaded && prizes.length) {
            getCurrentPrize()
        }
    }, [isLoaded, winnerUsers, prizes])

    return (
        <div className="lottery-box">
            <Star />
            <Music />
            {
                isLoaded && (
                    <Prize prizes={prizes} winnerUsers={winnerUsers} />
                )
            }
            <Main />
        </div>
    )
}

export default Lottery
