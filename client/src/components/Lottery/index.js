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
    let [ selectedIndex, setSelectedIndex ] = useState(len)
    let [ selected, setSelected ] = useState(prizeList[len])
    let [ barWidth, setBarWidth ] = useState('100%')
    let [ users, setUsers ] = useState([])
    let [ winnerUsers, setWinnerUsers ] = useState([])
    let [ remainUsers, setRemainUsers ] = useState([])
    let [ currCount, setCurrCount ] = useState(selected.count)
    const initData = async () => {
        const { winnerUsers, remainUsers } = await LotteryApi.getData()
        const { users } = await LotteryApi.getUsers()
        setUsers(users)
        setWinnerUsers(winnerUsers)
        setRemainUsers(remainUsers)
    }
    const initCurrCount = (count) => {
        console.log('count: ', count);
        let totalCount = selected.count
        console.log('totalCount: ', totalCount);
        currCount = totalCount - count
        setCurrCount(currCount)
        let barWidth = `${((totalCount - count) / totalCount) * 100}%`
        setBarWidth(barWidth)
    }
    const getCurrentPrize = () => {
        for (let i = len; i >= 0; i--) {
            console.log(i, winnerUsers[i] && winnerUsers[i].length >= prizeList[i].count)
            if (winnerUsers[i] && winnerUsers[i].length >= prizeList[i].count) {
                continue
            }
            selectedIndex = i
            setSelectedIndex(selectedIndex)
            selected = prizeList[i]
            setSelected({...selected})
            console.log('selectedIndex', selectedIndex)
            console.log('selected', selected)
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
        console.log('getCurrentPrize')
        getCurrentPrize()
    }, [winnerUsers])

    useEffect(() => {
        if (selected) {
            let count = (winnerUsers[selected.type] || []).length
            initCurrCount(count)
        }
    }, [selected])
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
                (users.length > 0 && remainUsers.length > 0 && selectedIndex !== undefined && selected) && 
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
                        getCurrentPrize={getCurrentPrize}
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
