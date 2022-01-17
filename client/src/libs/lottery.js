import initHightlightCell from '@/libs/initHighlightCell'
import { ROW_COUNT, COLUMN_COUNT, COMPANY, YEAR } from '@/constant/prize'
import * as WinnerUserApi from '@/api/winnerUser'
import { setRemainUsers, setWinnerUsers, removeWinnerUsers, setPreSelected } from '@/reducers/actions'

class Lottery {
    constructor (container, basicData, fns) {
        this.resolution = 1
        this.rotateTime = 2000
        this.scene = null
        this.camera = null
        this.controls = null
        this.renderer = null
        this.highlightCell = initHightlightCell(YEAR)
        this.container = container
        this.basicData = basicData
        this.winnerUsers = basicData.winnerUsers
        this.remainUsers = basicData.remainUsers
        this.selected = basicData.selected
        this.selectedIndex = basicData.selectedIndex
        this.setShowLottery = fns.setShowLottery
        this.showBubble = fns.showBubble
        this.getCurrentPrize = fns.getCurrentPrize
        this.dispatch = fns.dispatch
        this.showTable = this.basicData.users.length === this.basicData.remainUsers.length
        this.table = []
        this.sphere = []
        this.threeDCards = []
        this.TOTAL_CARDS = ROW_COUNT * COLUMN_COUNT
        this.isLottery = false
        this.shineTimer = null
        this.selectedCardIndex = []
        this.selectedUsers = []
    }

    init () {
        this.initScene()
        this.initCamera()
        this.initContent()
        this.initRender()
        this.initControls()
        if (this.showTable) {
            this.setShowLottery(false)
            this.switchScreen('enter')
        } else {
            this.setShowLottery(true)
            this.switchScreen('lottery')
        }
        this.animate()
        this.shineCard()
    }

    initScene () {
        this.scene = new THREE.Scene() 
    }

    initCamera () {
        this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000)
        this.camera.position.z = 3000
    }

    initContent () {
        let index = 0
        let len = (this.basicData.users || []).length
        let position = {
            x: (140 * COLUMN_COUNT - 20) / 2,
            y: (180 * ROW_COUNT - 20) / 2
        }
        for (let i = 0; i < ROW_COUNT; i++) {
            for (let j = 0; j < COLUMN_COUNT; j++) {
                // 获取高亮名牌
                let isHighlight = this.highlightCell.includes(`${i}-${j}`)
                let element = this.createCard(this.basicData.users[index % len], isHighlight, index, this.showTable)
                let threeDObject = new THREE.CSS3DObject(element)
                threeDObject.position.x = Math.random() * 4000 - 2000
                threeDObject.position.y = Math.random() * 4000 - 2000
                threeDObject.position.z = Math.random() * 4000 - 2000
                this.scene.add(threeDObject)
                this.threeDCards.push(threeDObject)
                // 创建三维物体
                let object = new THREE.Object3D()
                object.position.x = (j * 140) - position.x
                object.position.y = -(i * 180) + position.y
                this.table.push(object)
                this.index++
            }
        }
        // sphere
        let vector = new THREE.Vector3()
        for (let i = 0, l = this.threeDCards.length; i < l; i++) {
            let phi = Math.acos(-1 + (2 * i) / l)
            let theta = Math.sqrt(l * Math.PI) * phi
            let object = new THREE.Object3D()
            object.position.setFromSphericalCoords(800 * this.resolution, phi, theta)
            vector.copy(object.position).multiplyScalar(2)
            object.lookAt(vector)
            this.sphere.push(object)
        }
    }

    initRender () {
        // 创建渲染器
        this.renderer = new THREE.CSS3DRenderer()
        // 设置渲染器的大小
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.container.current.appendChild(this.renderer.domElement)
    }

    initControls () {
        // 轨迹球控件
        this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement)
        this.controls.rotateSpeed = 0.5 // 旋转速度
        this.controls.minDistance = 500 // 最小视角
        this.controls.maxDistance = 6000 // 最大视角
        this.controls.addEventListener('change', () => {
            this.render()
        })
    }

    createElement (css, text) {
        let dom = document.createElement('div')
        dom.className = css || ''
        dom.innerHTML = text || ''
        return dom
    }

    createCard (user, isHighlight, id, showTable) {
        let element = this.createElement()
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
        element.appendChild(this.createElement('company', COMPANY))
        element.appendChild(this.createElement('name', user.nickName))
        element.appendChild(this.createElement('details', `${user.code}<br/>${user.username}`))
        return element
    }

    /**
     * 随机抽奖
     * @param {*} num 
     * @returns 
     */
    random (num) {
        return Math.floor(Math.random() * num)
    }

    /**
     * @description 切换名牌背景
     * @param {@} cardIndex 
     * @param {*} color 
     */
    shine (cardIndex, color) {
        let card = this.threeDCards[cardIndex].element
        card.style.backgroundColor = color || 'rgba(0,127,127,' + (Math.random() * 0.7 + 0.25) + ')'
    }

    changeCard (cardIndex, user) {
        let card = this.threeDCards[cardIndex].element
        card.innerHTML = `<div class="company">${COMPANY}</div><div class="name">${user.nickName}</div><div class="details">${user.code}<br/>${user.username || 'PSST'}</div>`
    }

    selectCard (duration = 600) {
        let width = 140
        let tag = -(this.selectedUsers.length - 1) / 2
        console.log(this.selectedUsers)
        let users = this.selectedUsers.map(item => item.nickName) // 选中用户名字列表
        this.showBubble('congratulation', {
            user: users.join('、'),
            prize: this.selected.title,
            year: YEAR
        })
        
        this.selectedCardIndex.forEach((cardIndex, index) => {
            this.changeCard(cardIndex, this.selectedUsers[index])
            let object = this.threeDCards[cardIndex]
            new TWEEN.Tween(object.position).to({
                x: tag * width * this.resolution,
                y: 50 * this.resolution,
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
            .onUpdate(this.render)
            .start()
            .onComplete(() => {
                // 动画结束后可以操作
                this.isLottery = false
            })
    }

    resetCard (duration = 500) {
        if (this.selectedUsers.length === 0) {
            return Promise.resolve()
        }
        this.selectedCardIndex.forEach((index) => {
            let object = this.threeDCards[index]
            let target = this.sphere[index]
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
                .onUpdate(this.render)
                .start()
                .onComplete(() => {
                    this.selectedCardIndex.forEach((index) => {
                        let object = this.threeDCards[index]
                        object.element.classList.remove('prize')
                    })
                    resolve()
                })
        })
    }

    shineCard () {
        let maxCard = 15
        let maxUser = this.basicData.remainUsers.length
        let shineCards = this.random(maxCard)
        this.shineTimer = setInterval(() => {
            if (this.isLottery) {
                return
            }
            for (let i = 0; i < shineCards; i++) {
                let index = this.random(maxUser)
                let cardIndex = this.random(this.TOTAL_CARDS)
                if (this.selectedCardIndex.includes(cardIndex) || !this.basicData.remainUsers[index]) {
                    continue
                }
                this.shine(cardIndex)
                this.changeCard(cardIndex, this.basicData.remainUsers[index] || [])
            }
        }, 500)
    }

    render () {
        this.renderer && this.renderer.render(this.scene, this.camera)
    }

    update () {
        TWEEN.update()
        this.controls.update()
    }

    animate () {
        requestAnimationFrame(() => {
            this.animate()
        })
        this.render()
        this.update()
    }

    transform (targets, duration) {
        for (let i = 0; i < this.threeDCards.length; i++) {
            let object = this.threeDCards[i]
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
        new TWEEN.Tween(this).to({}, duration * 2).onUpdate(this.render).start()
    }

    switchScreen (type) {
        if (type === 'enter') {
            this.transform(this.table, 2000)
        } else {
            this.transform(this.sphere, 2000)
        }
    }

    onWindowResize () {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.render()
    }

    // 添加名牌高亮
    addHighlight () {
        document.querySelectorAll('.lightitem').forEach(node => {
            node.classList.add('highlight')
        })
    }

    // 取消名牌高亮
    removeHighlight () {
        document.querySelectorAll('.highlight').forEach(node => {
            node.classList.remove('highlight')
        })
    }

    /**
     * @description 旋转抽奖ball
     * @returns 
     */
    rotateBall () {
        return new Promise((resolve, reject) => {
            this.scene.rotation.y = 0
            new TWEEN.Tween(this.scene.rotation).to({
              y: Math.PI * 8
            }, this.rotateTime)
            .onUpdate(this.render)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start()
            .onComplete(() => {
                resolve()
            })
        })
    }

    getCurrentWinners (obj) {
        return (this.basicData.winnerUsers || []).filter(user => user.type === obj.type && user.title === obj.title) || []
    }

    // 获取每次抽奖个数
    getEachCount () {
        let eachCount = this.selected.eachCount
        let currPrizeTotalCount = this.selected.count
        console.log(this.selectedIndex, this.selected)
        let currPrizeCount = currPrizeTotalCount - this.getCurrentWinners(this.selected).length
        console.log(eachCount, currPrizeTotalCount, currPrizeCount)
        currPrizeCount = currPrizeCount > eachCount ? eachCount : currPrizeCount
        return currPrizeCount
    }

    async saveData () {
        if (this.selectedUsers.length === 0) return
        const { type, title } = this.selected
        let opts = {
            users: this.selectedUsers,
            type,
            title
        }
        await WinnerUserApi.saveMultiWinnerUser(opts)
    }

    async lottery (relottery) {
        await this.rotateBall()
        this.selectedCardIndex = []
        this.selectedUsers = []
        let currPrizeCount = this.getEachCount()
        let leftCount = this.remainUsers.length // 剩余抽奖个数
        for (let i = 0; i < currPrizeCount; i++) {
            let selectedId = this.random(leftCount)
            let selectUser = this.remainUsers.splice(selectedId, 1)[0]
            selectUser.status = 1
            selectUser.type = this.selected.type
            selectUser.title = this.selected.title
            this.selectedUsers.push(selectUser)
            this.dispatch(setRemainUsers(this.remainUsers))
            leftCount--
            let cardIndex = this.random(this.TOTAL_CARDS)
            while(this.selectedCardIndex.includes(cardIndex)) {
                cardIndex = this.random(this.TOTAL_CARDS)
            }
            this.selectedCardIndex.push(cardIndex)
        }
        if (relottery) {
            this.dispatch(removeWinnerUsers())
        }
        this.winnerUsers.push.apply(this.winnerUsers, this.selectedUsers)
        this.dispatch(setWinnerUsers(this.winnerUsers))
        this.saveData()
        this.selectCard()
    }

    isStillHasPrize () {
        if (this.selected.count === (this.winnerUsers || []).length && this.selectedIndex === 0) {
            return false
        }
        return true
    }

    toShowLottery () {
        this.setShowLottery(true)
        this.removeHighlight()
        this.showBubble('enter', {
            prize: this.selected.title
        })
        this.switchScreen('lottery')
    }

    async goLottery () {
        if (this.isLottery) {
            this.showBubble('wait')
            return
        }
        if (!this.isStillHasPrize()) {
            return this.showBubble('finish')
        }
        this.dispatch(setPreSelected({ index: this.selectedIndex, value: this.selected }))
        this.isLottery = true
        // this.saveData()
        this.getCurrentPrize()
        await this.resetCard()
        this.lottery()
    }
}

export default Lottery

