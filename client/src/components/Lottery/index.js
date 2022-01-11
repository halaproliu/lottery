import React, { useState, useEffect } from 'react'
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
    // let [ barWidth, setBarWidth ] = useState('100%')
    // let [ currCount, setCurrCount ] = useState(selected.count)
    let [ users, setUsers ] = useState([])
    let [ winnerUsers, setWinnerUsers ] = useState([])
    let [ remainUsers, setRemainUsers ] = useState([])
    const initData = async () => {
        const { winnerUsers, remainUsers } = await LotteryApi.getData()
        const { users } = await LotteryApi.getUsers()
        setUsers(users)
        setWinnerUsers(winnerUsers)
        setRemainUsers(remainUsers)
    }
    // const initCurrCount = (count) => {
    //     let totalCount = selected.count
    //     currCount = totalCount - count
    //     setCurrCount(currCount)
    //     let barWidth = `${((totalCount - count) / totalCount) * 100}%`
    //     setBarWidth(barWidth)
    // }
    const getCurrentPrize = () => {
        for (let i = len; i >= 0; i--) {
            let tmpSelected = prizeList[i]
            let index = tmpSelected.type + '-' + tmpSelected.subType
            console.log((winnerUsers[index] || []).length, tmpSelected.count)
            if ((winnerUsers[index] || []).length >= tmpSelected.count) {
                if (i === 0) {
                    setSelectedIndex(i)
                    selected = prizeList[i]
                    setSelected({...selected})
                }
                continue
            }
            setSelectedIndex(i)
            selected = prizeList[i]
            setSelected({...selected})
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
        initData()
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
        document.body.style.backgroundColor = 'linear-gradient(to bottom, #131313 0%, #02101c 100%)'
    }, [])

    useEffect(() => {
        getCurrentPrize()
    }, [winnerUsers])

    // useEffect(() => {
    //     if (selected) {
    //         let count = (winnerUsers[selected.type] || []).length
    //         initCurrCount(count)
    //     }
    // }, [selected])
    return (
        <div className="lotter-box">
            <Star></Star>
            <Music></Music>
            <Prize
                selected={selected}
                selectedIndex={selectedIndex}
                // currCount={currCount}
                // setCurrCount={setCurrCount}
                // barWidth={barWidth}
                winnerUsers={winnerUsers}>
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
                        // currCount={currCount}
                        // initCurrCount={initCurrCount}
                        setWinnerUsers={setWinnerUsers}
                        getCurrentPrize={getCurrentPrize}
                        resetData={resetData}
                        setData={setData}
                        saveNotArriveWinnerData={saveNotArriveWinnerData}
                        exportData={exportData}>
                    </Main>
                )
            }
        </div>
    )
}

export default Lottery
