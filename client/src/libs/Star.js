/**
 * @description 背景星星生成
 * @param el canvas dom节点
 */
class Stars {
  constructor (el) {
    this.element = el
    this.starNums = 1500
    this.radius = `0.${Math.floor(Math.random() * 9) + 1}`
    this.wrap = 0
    this.animate = true
    this.stars = []
    this.ctx = null
  }

  init () {
    if (!this.element) return
    this.ctx = this.element.getContext('2d')
    this.focalLength = this.element.width * 2
    for (let i = 0; i < this.starNums; i++) {
      this.stars.push({
        x: Math.random() * this.element.width,
        y: Math.random() * this.element.height,
        z: Math.random() * this.element.width,
        o: '0.' + Math.floor(Math.random() * 99) + 1
      })
    }
    this.execute()
  }

  moveStars () {
    for (let i = 0; i < this.starNums; i++) {
      let star = this.stars[i]
      star.z--
      if (star.z <= 0) {
        star.z = this.element.width
      }
    }
  }

  drawStars () {
    if (this.element.width !== window.innerWidth || this.element.width !== window.innerWidth) {
      this.element.width = window.innerWidth
      this.element.height = window.innerHeight
      this.init()
    }

    if (this.wrap === 0) {
      this.ctx.fillStyle = 'rgba(0, 10, 20, 1)'
      this.ctx.fillRect(0, 0, this.element.width, this.element.height)
    }
    this.ctx.fillStyle = `rgba(209, 255, 255, ${this.radius})`
    let centerX = this.element.width / 2
    let centerY = this.element.height / 2
    for (let i = 0; i < this.starNums; i++) {
      let star = this.stars[i]
      let pixelX = (star.x - centerX) * (this.focalLength / star.z)
      pixelX += centerX
      let pixelY = (star.y - centerY) * (this.focalLength / star.z)
      pixelY += centerY
      let pixelRadius = 1 * (this.focalLength / star.z)
      this.ctx.fillRect(pixelX, pixelY, pixelRadius, pixelRadius)
      this.ctx.fillStyle = `rgba(209, 255, 255, ${star.o})`
    }
  }

  execute () {
    if (this.animate) {
      window.requestAnimationFrame(() => {
        this.execute()
      })
      this.moveStars()
      this.drawStars()
    }
  }
}

export default Stars
