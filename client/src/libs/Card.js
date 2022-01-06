class Card {
  constructor (rowCount, colCount, highlightCell, users) {
    this.camera = null
    this.rowCount = rowCount
    this.colCount = colCount
    this.highlightCell = highlightCell
    this.users = users
  }

  init () {
    this.camera = new window.THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000)
    this.camera.position.z = 3000
    this.scene = new window.THREE.Scene()
    let isBold = false
    let index = 0
    let len = this.users.length
    let showTable = true

    let position = {
      x: (140 * this.colCount - 20) / 2,
      y: (180 * this.rowCount - 20) / 2
    }

    for (let i = 0; i < this.rowCount; i++) {
      for (let j = 0; j < this.colCount; j++) {
        isBold = this.highlightCell.includes(`${i}-${j}`)
        let element = this.createCard(this.users[index % len], isBold, index, showTable)
        let object = new window.THREE.CSS3Object(element)
        object.position.x = Math.random() * 4000 - 2000
        object.position.y = Math.random() * 4000 - 2000
        object.position.z = Math.random() * 4000 - 2000
        this.scene.add(object)
        this.threeDCards.push(object)
        object = new window.THREE.Object3D();
        object.position.x = (j * 140) - position.x;
        object.position.y = -(i * 180) + position.y;
        this.targets.table.push(object);
        index++;
      }
    }
  }

  createCard () {}
}

export default Card