import React, { useState, useRef, useEffect } from 'react'
import { ROW_COUNT, COLUMN_COUNT, COMPANY, EACH_COUNT, YEAR } from '@/constant/prize'
import initHightlightCell from '@/libs/initHighlightCell'
import './index.styl'
import Bubble from '@/components/Bubble'
import MESSAGES from '@/constant/message'
import { prizeList } from '@/constant'
import { useSelector, useDispatch } from 'react-redux'
import * as actions from '@/reducers/actions'
import '@/assets/css/animate.min.css'

let isLottery = false
let highlightCell = initHightlightCell(YEAR)
function Main (props) {
    let container = useRef(null)
    let firstRender = useRef(true) // 记录第一次render
    let shineTimer = useRef(null)
    let [ showLottey, setShowLottery ] = useState(false)
    let [ message, setMessage ] = useState('')
    let [ animateClass, setAnimateClass ] = useState('')
    let [ table, setTable ] = useState([])
    let [ sphere, setSphere ] = useState([])
    let camera = useRef(null)
    let scene = useRef(null)
    let renderer = useRef(null)
    let controls = useRef(null)
    let threeDCards = useRef([])
    let users = props.users
    let winnerUsers = props.winnerUsers
    let remainUsers = props.remainUsers
    let selectedIndex = useSelector(state => state.lottery.selectedIndex)
    let selected = useSelector(state => state.lottery.selected)
    let selectedUsers = useSelector(state => state.lottery.selectedUsers)
    let selectedCardIndex = useSelector(state => state.lottery.selectedCardIndex)
    let preSelectedIndex = useSelector(state => state.lottery.preSelectedIndex)
    let preSelected = useSelector(state => state.lottery.preSelected)
    let selectedUsersCurr = useRef(null)
    let selectedCardIndexCurr = useRef(null)
    let selectedIndexCurr = useRef(null)
    let selectedCurr = useRef(null)
    let preSelectedIndexCurr = useRef(null)
    let preSelectedCurr = useRef(null)
    const dispatch = useDispatch()
    let reset = props.resetData
    let setData = props.setData
    let saveNotArriveWinnerData = props.saveNotArriveWinnerData
    let setWinnerUsers = props.setWinnerUsers
    let exportData = props.exportData
    let getCurrentPrize = props.getCurrentPrize
    let isHighlight
    let resolution = 1 // 分辨率
    let rotateTime = 3000 // 旋转时间
    let index = 0
    let len = users && users.length
    let showTable = users.length === remainUsers.length
    let position = {
        x: (140 * COLUMN_COUNT - 20) / 2,
        y: (180 * ROW_COUNT - 20) / 2
    }
    const TOTAL_CARDS = ROW_COUNT * COLUMN_COUNT
    const initScene = () => {
        // 创建场景
        scene.current = new THREE.Scene()
    }
    const initCamera = () => {
        // 创建相机
        camera.current = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000)
        camera.current.position.z = 3000
    }
    const initContent = () => {
        for (let i = 0; i < ROW_COUNT; i++) {
            for (let j = 0; j < COLUMN_COUNT; j++) {
                // 获取高亮名牌
                isHighlight = highlightCell.includes(`${i}-${j}`)
                let element = createCard(users[index % len], isHighlight, index, showTable)
                let threeDObject = new THREE.CSS3DObject(element)
                threeDObject.position.x = Math.random() * 4000 - 2000
                threeDObject.position.y = Math.random() * 4000 - 2000
                threeDObject.position.z = Math.random() * 4000 - 2000
                scene.current.add(threeDObject)
                threeDCards.current.push(threeDObject)
                // 创建三维物体
                let object = new THREE.Object3D()
                object.position.x = (j * 140) - position.x
                object.position.y = -(i * 180) + position.y
                table.push(object)
                setTable(table)
                index++
            }
        }
        // sphere
        let vector = new THREE.Vector3()
        for (let i = 0, l = threeDCards.current.length; i < l; i++) {
            let phi = Math.acos(-1 + (2 * i) / l)
            let theta = Math.sqrt(l * Math.PI) * phi
            let object = new THREE.Object3D()
            object.position.setFromSphericalCoords(800 * resolution, phi, theta)
            vector.copy(object.position).multiplyScalar(2)
            object.lookAt(vector)
            sphere.push(object)
            setSphere(sphere)
        }
    }
    const initRender = () => {
        // 创建渲染器
        renderer.current = new THREE.CSS3DRenderer()
        // 设置渲染器的大小
        renderer.current.setSize(window.innerWidth, window.innerHeight)
        container.current.appendChild(renderer.current.domElement)
    }
    const initControls = () => {
        // 轨迹球控件
        controls.current = new THREE.TrackballControls(camera.current, renderer.current.domElement)
        controls.current.rotateSpeed = 0.5 // 旋转速度
        controls.current.minDistance = 500 // 最小视角
        controls.current.maxDistance = 6000 // 最大视角
        controls.current.addEventListener('change', () => {
            render()
        })
    }
    const update = () => {
        TWEEN.update()
        controls.current.update()
    }
    const render = () => {
        renderer.current && renderer.current.render(scene.current, camera.current)
    }
    const animate = () => {
        requestAnimationFrame(animate)
        render()
        update()
    }
    const initThree = () => {
        // 创建场景
        initScene()
        // 创建相机
        initCamera()
        // 创建内容
        initContent()
        // 创建渲染器
        initRender()
        // 轨迹球控件
        initControls()
        if (showTable) {
            setShowLottery(false)
            switchScreen('enter')
        } else {
            setShowLottery(true)
            switchScreen('lottery')
        }
        animate()
        shineCard()
    }
    const switchScreen = (type) => {
        if (type === 'enter') {
            transform(table, 2000)
        } else {
            transform(sphere, 2000)
        }
    }
    const transform = (targets, duration) => {
        for (let i = 0; i < threeDCards.current.length; i++) {
            let object = threeDCards.current[i]
            let target = targets[i]
            new TWEEN.Tween(object.position).to({
              x: target.position.x,
              y: target.position.y,
              z: target.position.z
            }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start()
      
            new TWEEN.Tween(object.rotation).to({
              x: target.rotation.x,
              y: target.rotation.y,
              z: target.rotation.z
            }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start()
        }
        new TWEEN.Tween(this).to({}, duration * 2).onUpdate(render).start()
    }

    const createElement = (css, text) => {
        let dom = document.createElement('div')
        dom.className = css || ''
        dom.innerHTML = text || ''
        return dom
    }
    const createCard = (user, isHighlight, id, showTable) => {
        let element = createElement()
        element.id = `card-${id}`
        if (isHighlight) {
            element.className = 'element lightitem'
            if (showTable) {
                element.classList.add('highlight')
            }
        } else {
            element.className = 'element'
            element.style.backgroundColor = `rgba(0,127,127,${Math.random() * 0.7 + 0.25})`
        }
        element.appendChild(createElement('company', COMPANY))
        element.appendChild(createElement('name', user[2]))
        element.appendChild(createElement('details', `${user[0]}<br/>${user[1]}`))
        return element
    }

    const rotateBall = () => {
        return new Promise((resolve, reject) => {
            scene.current.rotation.y = 0
            new TWEEN.Tween(scene.current.rotation).to({
              y: Math.PI * 8
            }, rotateTime)
            .onUpdate(render)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start()
            .onComplete(() => {
                resolve()
            })
        })
    }

    /**
     * 随机抽奖
     * @param {*} num 
     * @returns 
     */
    const random = (num) => {
        return Math.floor(Math.random() * num)
    }

    const onWindowResize = () => {
        camera.current.aspect = window.innerWidth / window.innerHeight
        camera.current.updateProjectionMatrix()
        renderer.current.setSize(window.innerWidth, window.innerHeight)
        render()
    }

    // 为固定名牌添加高亮
    const addHighlight = () => {
        document.querySelectorAll('.lightitem').forEach(node => {
            node.classList.add('highlight')
        })
    }

    // 取消名牌高亮
    const removeHighlight = () => {
        document.querySelectorAll('.highlight').forEach(node => {
            node.classList.remove('highlight')
        })
    }

    // 设置当前获奖人员（未保存后端）
    const setCurrWinnerUsers = () => {
        let type = preSelectedCurr.current.type // 当前奖品type
        let subType = preSelectedCurr.current.subType
        let index = `${type}-${subType}`
        let savedWinners = winnerUsers[index] || [] // 当前奖品中奖人
        savedWinners.push.apply(savedWinners, selectedUsersCurr.current)
        winnerUsers[index] = savedWinners
        setWinnerUsers(...[winnerUsers])
    }

    const getEachLotteryCount = (selectedCurr, selectedIndexCurr) => {
        console.log(winnerUsers)
        let eachCount = EACH_COUNT[selectedIndexCurr.current]
        let index = `${selectedCurr.current.type}-${selectedCurr.current.subType}`
        let currLeft = prizeList[selectedIndexCurr.current].count - (winnerUsers[index] || []).length
        let currPrizeCount =  currLeft > eachCount ? eachCount : currLeft // 每次抽奖个数
        return currPrizeCount
    }

    const removeCurrWinnerUsers = () => {
        let type = preSelectedCurr.current.type // 当前奖品type
        let subType = preSelectedCurr.current.subType
        let index = `${type}-${subType}`
        let eachCount = preSelectedCurr.current.count
        let preCount = (winnerUsers[index] || []).length % eachCount
        let currPrizeCount = preCount === 0 ? eachCount : preCount
        let start = winnerUsers[index].length - currPrizeCount
        winnerUsers[index].splice(start, currPrizeCount)
        setWinnerUsers({...winnerUsers})
    }

    const saveData = () => {
        if (!preSelectedCurr.current) return
        let type = preSelectedCurr.current.type // 当前奖品type
        let subType = preSelectedCurr.current.subType
        let index = `${type}-${subType}`
        let savedWinners = winnerUsers[index] || [] // 当前奖品中奖人

        if (preSelectedCurr.current.count <= savedWinners.length) {
            dispatch({ type: actions.SET_SELECTED_INDEX, payload: selectedIndexCurr.current })
        }
        if (selectedUsersCurr.current.length > 0) {
            return setData({
                type,
                subType,
                data: selectedUsersCurr.current
            })
        }
        return Promise.resolve()
    }
    // 点击进入抽奖
    const toShowLottery = () => {
        setShowLottery(true)
        removeHighlight()
        showBubble('enter', {
            prize: selectedCurr.current.title
        })
        switchScreen('lottery')
    }
    const lottery = (isRelottery) => {
        rotateBall().then(() => {
            dispatch({ type: actions.CLEAR_SELECTD_USERS }) // 选中人数置空
            dispatch({ type: actions.CLEAR_SELECTED_CARD_INDEX }) // 选中名牌置空
            let currPrizeCount
            if (isRelottery) {
                console.log(preSelectedCurr, preSelectedIndexCurr)
                console.log(selectedCurr, selectedIndexCurr)
                currPrizeCount = getEachLotteryCount(preSelectedCurr, preSelectedIndexCurr)
            } else {
                currPrizeCount = getEachLotteryCount(selectedCurr, selectedIndexCurr)
            }
            console.log(currPrizeCount)
            let leftCount = remainUsers.length // 剩余抽奖个数
            for (let i = 0; i < currPrizeCount; i++) {
                let selectedId = random(leftCount) // 选中的人下标
                 // 选中用户
                dispatch({ type: actions.SET_SELECTD_USERS, payload: remainUsers.splice(selectedId, 1)[0] })
                leftCount--
                let cardIndex = random(TOTAL_CARDS)
                while(selectedCardIndexCurr.current.includes(cardIndex)) {
                    cardIndex = random(TOTAL_CARDS)
                }
                dispatch({ type: actions.SET_SELECTED_CARD_INDEX, payload: cardIndex })
            }
            selectCard()
            // if (!isRelottery) {
            //     setCurrWinnerUsers()
            //     getCurrentPrize()
            // }
            setCurrWinnerUsers()
            getCurrentPrize()
            if (!isStillHasPrize()) {
                saveData()
            }
        })
    }

    const selectCard = (duration = 600) => {
        let width = 140
        let tag = -(selectedUsersCurr.current.length - 1) / 2
        let users = selectedUsersCurr.current.map(item => item[2]) // 选中用户名字列表
        showBubble('congratulation', {
            user: users.join('、'),
            prize: selectedCurr.current.title,
            year: YEAR
        })
        
        selectedCardIndexCurr.current.forEach((cardIndex, index) => {
            changeCard(cardIndex, selectedUsersCurr.current[index])
            let object = threeDCards.current[cardIndex]
            new TWEEN.Tween(object.position).to({
                x: tag * width * resolution,
                y: 50 * resolution,
                z: 2200
            }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start()

            new TWEEN.Tween(object.rotation).to({
                x: 0,
                y: 0,
                z: 0
            }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start()
            object.element.classList.add('prize')
            tag++
        })

        new TWEEN.Tween(this)
        .to({}, duration * 2)
        .onUpdate(render)
        .start()
        .onComplete(() => {
            // 动画结束后可以操作
            isLottery = false
        })
    }

    const changeCard = (cardIndex, user) => {
        let card = threeDCards.current[cardIndex].element
        card.innerHTML = `<div class="company">${COMPANY}</div><div class="name">${user[2]}</div><div class="details">${user[0]}<br/>${user[1] || 'PSST'}</div>`
    }

    // 切换名牌背景
    const shine = (cardIndex, color) => {
        let card = threeDCards.current[cardIndex].element
        card.style.backgroundColor = color || 'rgba(0,127,127,' + (Math.random() * 0.7 + 0.25) + ')'
    }

    // 随机切换背景和人员信息
    const shineCard = () => {
        let maxCard = 15
        let maxUser = remainUsers.length
        let shineCards = random(maxCard)
        shineTimer.current = setInterval(() => {
            if (isLottery) {
                return
            }
            for (let i = 0; i < shineCards; i++) {
                let index = random(maxUser)
                let cardIndex = random(TOTAL_CARDS)
                if (selectedCardIndexCurr.current.includes(cardIndex) || !remainUsers[index]) {
                    continue
                }
                shine(cardIndex)
                changeCard(cardIndex, remainUsers[index] || [])
            }
        }, 500)
    }

    // 重置抽奖牌所有内容
    const resetCard = (duration = 500) => {
        if (selectedUsersCurr.current.length === 0) {
            return Promise.resolve()
        }
        selectedCardIndexCurr.current.forEach((index) => {
            let object = threeDCards.current[index]
            let target = sphere[index]
            new TWEEN.Tween(object.position).to({
                x: target.position.x,
                y: target.position.y,
                z: target.position.z
            }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start()
            new TWEEN.Tween(object.rotation).to({
                x: target.rotation.x,
                y: target.rotation.y,
                z: target.rotation.z
            }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start()
        })
        return new Promise((resolve) => {
            new TWEEN.Tween(this)
                .to({}, duration * 2)
                .onUpdate(render)
                .start()
                .onComplete(() => {
                    selectedCardIndexCurr.current.forEach((index) => {
                        let object = threeDCards.current[index]
                        object.element.classList.remove('prize')
                    })
                    resolve()
                })
        })
    }

    const isStillHasPrize = () => {
        let type = selectedCurr.current.type
        let subType = selectedCurr.current.subType
        let key = `${type}-${subType}`
        let prize = prizeList[selectedIndexCurr.current]
        if (prize.count === (winnerUsers[key] || []).length && selectedIndexCurr.current === 0) {
            return false
        }
        return true
    }

    const goLottery = (e) => {
        e.stopPropagation()
        if (isLottery) {
            showBubble('wait')
            return
        }
        if (!isStillHasPrize()) {
            return showBubble('finish')
        }
        isLottery = true
        saveData()
        dispatch({ type: actions.SET_PREV_SELECTED_INDEX, payload: selectedIndexCurr.current }) // 保存上一个选中prize index
        resetCard().then(_ => {
            lottery()
        })
    }
    
    const reLottery = async (e) => {
        e.stopPropagation()
        if (isLottery) {
            showBubble('wait')
            return
        }
        if (!isStillHasPrize()) {
            return showBubble('finish')
        }
        if (selectedUsersCurr.current.length === 0) {
            showBubble('tip')
            return
        }
        isLottery = true
        removeCurrWinnerUsers()
        saveNotArriveWinnerData({
            type: preSelectedCurr.current.type,
            subType: preSelectedCurr.current.subType,
            data: selectedUsersCurr.current
        })
        showBubble('relottery', {
            prize: preSelectedCurr.current.title
        })
        resetCard().then(_ => {
            lottery(true)
        })
    }

    const exportResult = (e) => {
        e.stopPropagation()
        if (isLottery) {
            showBubble('wait')
            return
        }
        exportData().then(() => {
            showBubble('reset')
        })
    }

    const resetData = (e) => {
        e.stopPropagation()
        if (isLottery) {
            showBubble('wait')
            return
        }
        let doREset = window.confirm('是否确认重置数据，重置后，当前已抽的奖项全部清空？')
        if (!doREset) {
            return;
        }
        showBubble('reset')
        addHighlight()
        resetCard().then(() => {
            // 重置所有数据
            dispatch({ type: actions.CLEAR_SELECTD_USERS })
            dispatch({ type: actions.CLEAR_SELECTED_CARD_INDEX })
            dispatch({ type: actions.RESET_PREV_SELECTED_INDEX })
            remainUsers = users
            reset() // 清空保存的json
            setShowLottery(false)
            switchScreen('enter')
        })
    }

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

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false
        }
        initThree()
        // 窗口改变时，改变全景图大小
        window.addEventListener('resize', onWindowResize, false)
        return () => {
            window.removeEventListener('resize', onWindowResize, false)
            clearInterval(shineTimer.current)
        }
    }, [])

    useEffect(() => {
        selectedIndexCurr.current = selectedIndex
        selectedCurr.current = selected
        selectedUsersCurr.current = selectedUsers
        selectedCardIndexCurr.current = selectedCardIndex
    }, [selectedIndex, selected, selectedUsers, selectedCardIndex])

    useEffect(() => {
        preSelectedIndexCurr.current = preSelectedIndex
        preSelectedCurr.current = preSelected
    }, [preSelectedIndex, preSelected])
    return (
        <>
            <div ref={container} className="lottery-container"></div>
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
