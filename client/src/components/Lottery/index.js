import React, { useState, useEffect, useRef } from 'react'
import './index.styl'
import '@/assets/css/animate.min.css'
import Music from '@/components/Music'
import Prize from '@/components/Prize'
import Star from '@/components/Star'
import Main from '@/components/Main'
import { prizeList } from '@/constant'
import * as LotteryApi from '@/api/lottery'
import config from '@/config'

function Lottery () {
    let len = prizeList.length - 1
    const [ selectedIndex, setSelectedIndex ] = useState(len)
    const [ selected, setSelected ] = useState(prizeList[len])
    const [ barWidth, setBarWidth ] = useState('100%')
    const [ users, setUsers ] = useState([])
    const [ winnerUsers, setWinnerUsers ] = useState([])
    const [ remainUsers, setRemainUsers ] = useState([])
    const [ currCount, setCurrCount ] = useState(selected.count)
    const initData = async () => {
        const { winnerUsers, remainUsers } = await LotteryApi.getData()
        const { users } = await LotteryApi.getUsers()
        setUsers(users)
        setWinnerUsers(winnerUsers)
        setRemainUsers(remainUsers)
    }
    const initCurrCount = (count) => {
        let totalCount = selected.count
        setCurrCount(totalCount - count)
        let barWidth = `${((totalCount - count) / totalCount) * 100}%`
        setBarWidth(barWidth)
    }
    const getCurrentPrize = () => {
        for (let i = len; i >= 0; i--) {
            if (winnerUsers[i] && winnerUsers[i].length >= prizeList[i].count) {
                continue
            }
            setSelectedIndex(i)
            setSelected(() => {
                return {...prizeList[i]}
            })
            break
        }
    }

    const setData = (data) => {
       return LotteryApi.saveData(data)
    }

    const saveNotArriveWinnerData = (data) => {
        return LotteryApi.saveNotArriveWinnerData(data)
    }

    const resetData = () => {
        LotteryApi.resetData()
    }

    const exportData = async () => {
        let { url } = await LotteryApi.exportFile()
        const el = document.createElement('a')
        el.setAttribute('href', config.baseURL + url)
        document.body.appendChild(el)
        el.click()
        el.remove()
    }
    useEffect(() => {
        initData()
    }, [])

    useEffect(() => {
        getCurrentPrize()
    }, [winnerUsers])

    useEffect(() => {
        if (selectedIndex && winnerUsers[selectedIndex]) {
            let count = winnerUsers[selectedIndex].length
            initCurrCount(count)
        }
    }, [selectedIndex])
    return (
        <>
            <Star></Star>
            <Music></Music>
            <Prize
                selected={selected}
                selectedIndex={selectedIndex}
                currCount={currCount}
                setCurrCount={setCurrCount}
                barWidth={barWidth}>
            </Prize>
            {
                (users.length > 0 && remainUsers.length && selectedIndex && selected) && 
                (
                    <Main
                        users={users}
                        winnerUsers={winnerUsers}
                        remainUsers={remainUsers}
                        selectedIndex={selectedIndex}
                        selected={selected}
                        setSelectedIndex={setSelectedIndex}
                        setSelected={setSelected}
                        initCurrCount={initCurrCount}
                        setWinnerUsers={setWinnerUsers}
                        resetData={resetData}
                        setData={setData}
                        saveNotArriveWinnerData={saveNotArriveWinnerData}
                        exportData={exportData}>
                    </Main>
                )
            }
        </>
    )
}

export default Lottery
