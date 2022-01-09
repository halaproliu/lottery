class Card {
  constructor (props, basicData, element, fns) {
    this.camera = null
    this.rowCount = props.ROW_COUNT
    this.colCount = props.COLUMN_COUNT
    this.highlightCell = props.HIGHLIGHT_CELL // 默认高亮的人名
    this.company = props.COMPANY
    this.eachCount = props.EACH_COUNT
    this.totalCards = this.rowCount * this.colCount
    this.rotateTime = 3000 // 旋转时间
    this.winnerUsers = basicData.winnerUsers // 已中奖用户
    this.remainUsers = basicData.remainUsers // 剩余未抽取用户
    this.users = basicData.users // 全部用户
    this.container = element
    this.threeDCards = []
    this.setBarWidth = fns.setBarWidth
    this.showBubble = fns.showBubble
    this.targets = {
      table: [],
      sphere: []
    }
    this.selected = basicData.selected
    this.selectedIndex = basicData.selectedIndex
    this.isLotting = false // 是否正在抽奖
    this.selectedCardIndex = [] // 选中的奖牌
    this.currentWinners = [] // 当前抽中的数据
  }

  init () {
    this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000)
    this.camera.position.z = 3000
    this.scene = new THREE.Scene()
    let isBold = false
    let index = 0
    let len = this.users.length
    let showTable = this.users.length === this.remainUsers.length
    let Resolution = 1 // 当前的比例

    let position = {
      x: (140 * this.colCount - 20) / 2,
      y: (180 * this.rowCount - 20) / 2
    }

    for (let i = 0; i < this.rowCount; i++) {
      for (let j = 0; j < this.colCount; j++) {
        isBold = this.highlightCell.includes(`${i}-${j}`)
        let element = this.createCard(this.users[index % len], isBold, index, showTable)
        let object = new THREE.CSS3DObject(element)
        object.position.x = Math.random() * 4000 - 2000
        object.position.y = Math.random() * 4000 - 2000
        object.position.z = Math.random() * 4000 - 2000
        this.scene.add(object)
        this.threeDCards.push(object)

        object = new THREE.Object3D()
        object.position.x = (j * 140) - position.x
        object.position.y = -(i * 180) + position.y
        this.targets.table.push(object)
        index++;
      }
    }

    // sphere
    let vector = new THREE.Vector3()
    for (let i = 0, l = this.threeDCards.length; i < l; i++) {
      var phi = Math.acos(-1 + (2 * i) / l)
      var theta = Math.sqrt(l * Math.PI) * phi
      var object = new THREE.Object3D()
      object.position.setFromSphericalCoords(800 * Resolution, phi, theta)
      vector.copy(object.position).multiplyScalar(2)
      object.lookAt(vector)
      this.targets.sphere.push(object)
    }

    this.renderer = new THREE.CSS3DRenderer()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.container.current.appendChild(this.renderer.domElement)

    this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement)
    this.controls.rotateSpeed = 0.5
    this.controls.minDistance = 500
    this.controls.maxDistance = 6000
    this.controls.addEventListener('change', this.render)
    if (showTable) {
        this.switchScreen('enter');
    } else {
        this.switchScreen('lottery');
    }
    this.animate()
    this.shineCard()
  }

  createElement (css, text) {
    let dom = document.createElement('div')
    dom.className = css || ''
    dom.innerHTML = text || ''
    return dom
  }

  // 创建名牌
  createCard (user, isBold, id, showTable) {
    let element = this.createElement()
    element.id = `card-${id}`
    if (isBold) {
      element.className = 'element lightitem'
      if (showTable) {
        element.classList.add('highlight')
      }
    } else {
      element.className = 'element'
      element.style.backgroundColor = `rgba(0, 127, 127, ${Math.random() * 0.7 * 0.25})`
    }
    element.appendChild(this.createElement('company', this.company))
    element.appendChild(this.createElement('name', user[1]))
    element.appendChild(this.createElement('details', `${user[0]}<br/>${user[2]}`))
    return element
  }

  // 绘制地球
  transformEarth (targets, duration) {
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

  // 为固定名牌添加高亮
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

  render () {
    if (this.renderer) {
      this.renderer.render(this.scene, this.camera)
    }
  }

  random(num) {
    // Math.floor取到0-num-1之间数字的概率是相等的
    return Math.floor(Math.random() * num)
  }

  animate () {
    window.requestAnimationFrame(() => {
      this.animate()
    })
    TWEEN.update()
    this.controls.update()
  }

  shine (cardIndex, color) {
    let card = this.threeDCards[cardIndex].element
    card.style.backgroundColor = color || `rgba(0, 127, 127, ${Math.random() * 0.7 + 0.25})`
  }

  changeCard (cardIndex, user) {
    let card = this.threeDCards[cardIndex].element
    card.innerHTML = `<div class="company">${this.company}</div><div class="name">${user[1]}</div><div class="details">${user[0]}<br/>${user[2] || 'PSST'}</div>`;
  }

  // 随机切换背景和人员信息
  shineCard () {
    let maxCard = 15
    let maxUser
    let shineCard = this.random(maxCard)
    setInterval(() => {
      // 正在抽奖停止闪烁
      if (this.isLotting) return
      maxUser = this.remainUsers.length
      for (let i = 0; i < shineCard; i++) {
        let index = this.random(maxUser)
        let cardIndex = this.random(this.totalCards)
        // if (this.selectedIndex.includes(cardIndex)) {
        //   continue
        // }
        this.shine(cardIndex)
        this.changeCard(cardIndex, this.remainUsers[index])
      }
    }, 500)
  }

  switchScreen (type) {
    if (type === 'enter') {
      this.transformEarth(this.targets.table, 2000)
    } else {
      this.transformEarth(this.targets.sphere, 2000)
    }
  }

  rotateBall () {
    return new Promise((resolve, reject) => {
      console.log(333)
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

  selectCard (duration = 600) {
    this.rotate = false
    let width = 140
    let tag = -(this.currentWinners.length - 1) / 2
    let txt = this.currentWinners.map(item => item[1])
    this.showBubble(`恭喜${txt.join('、')}获得${this.selected.title}, 2019年必定旺旺旺。`)
    this.selectedCardIndex.forEach((cardIndex, index) => {
      this.changeCard(cardIndex, this.currentWinners[index])
      let object = this.threeDCards[cardIndex]
      new TWEEN.Tween(object.position).to({
        x: tag * width * this.Resolution,
        y: 50 * this.Resolution,
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
      tag++
    })
    new TWEEN.Tween(this)
      .to({}, duration * 2)
      .onUpdate(this.render)
      .start()
      .onComplete(() => {
          // 动画结束后可以操作
          this.setLotteryStatus()
      })
  }

  resetCard () {
    if (this.currentWinners.length === 0) {
      return Promise.resolve()
    }
  }

  setLotteryStatus (status = false) {
    this.isLotting = status
  }

  lottery () {
    this.setLotteryStatus(true)
    console.log('lottery')
    // Lottery.saveData()
    // this.changePrize()
    // let prize = this.winnerUsers[this.selected.type] || []
    // let count = prize.length + this.eachCount[this.selectedIndex]
    // let percent = (count / prize.count) + '%'
    // this.setBarWidth(percent)
    this.rotateBall().then(() => {
      // 每次抽奖人数
      // let perCount = this.eachCount[this.selectedIndex]
      // let remainUsers = this.remainUsers.length
      // if (remainUsers === 0) {
      //   this.showBubble('人员已抽完，现在重新设置所有人员可以进行二次抽奖！')
      //   this.remainUsers = this.users
      //   remainUsers = this.remainUsers.length
      // }
      // for (let i = 0; i < perCount; i++) {
      //   let winnerId = this.random(remainUsers)
      //   this.currentWinners.push(this.remainUsers.splice(winnerId, 1)[0])
      //   remainUsers--
      //   let cardIndex = this.random(this.totalCards)
      //   while(this.selectedCardIndex.includes(cardIndex)) {
      //     cardIndex = this.random(this.totalCards)
      //   }
      //   this.selectedCardIndex.push(cardIndex)
      // }
      // this.selectCard()
      // this.showBubble(`正在抽取[${this.selected.title}],调整好姿势`)
    })
  }

  reLottery () {

  }

  reset () {}

  save () {}

  exportResult () {}
}

export default Card
