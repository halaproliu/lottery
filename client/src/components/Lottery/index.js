import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SET_SELECTED_INDEX } from '@/reducers/actions'
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
    let [ users, setUsers ] = useState([])
    let [ winnerUsers, setWinnerUsers ] = useState([])
    let [ remainUsers, setRemainUsers ] = useState([])
    let [ isLoaded, setIsLoaded ] = useState(false)
    const dispatch = useDispatch()
    const selectedIndex = useSelector(state => state.lottery.selectedIndex)
    const selected = useSelector(state => state.lottery.selected)
    const initData = async () => {
        const { winnerUsers, remainUsers } = await LotteryApi.getData()
        const { users } = await LotteryApi.getUsers()
        setUsers(users)
        setWinnerUsers(winnerUsers)
        setRemainUsers(remainUsers)
        setIsLoaded(true)
    }
    const getCurrentPrize = () => {
        for (let i = len; i >= 0; i--) {
            let tmpSelected = prizeList[i]
            let index = tmpSelected.type + '-' + tmpSelected.subType
            if ((winnerUsers[index] || []).length >= tmpSelected.count) {
                if (i === 0) {
                    dispatch({ type: SET_SELECTED_INDEX, payload: i })
                }
                continue
            }
            dispatch({ type: SET_SELECTED_INDEX, payload: i })
            break
        }
    }

    const setData = (data) => {
        return LotteryApi.saveData(data)
    }

    const saveNotArriveWinnerData = (data) => {
        return LotteryApi.saveNotArriveWinnerData(data)
    }

    const resetData = async () => {
        await LotteryApi.resetData()
        await initData()
        return Promise.resolve()
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
        if (isLoaded) {
            getCurrentPrize()
        }
    }, [winnerUsers, isLoaded])
    return (
        <div className="lotter-box">
            <Star></Star>
            <Music></Music>
            <Prize winnerUsers={winnerUsers} />
            {
                (users.length > 0 && remainUsers.length > 0 && selectedIndex !== undefined && selected) && 
                (
                    <Main
                        users={users}
                        winnerUsers={winnerUsers}
                        remainUsers={remainUsers}
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
