


class Sprite {
    constructor({ position, imagSrc, scale = 1, framsMax = 1, offSet = { x: 0, y: 0 } }) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imagSrc
        this.scale = scale
        this.framsMax = framsMax
        this.framsCrrnt = 0
        this.offSet = offSet
        this.timePassed = 0
        this.framsHold = 5
    }

    draw() {
        c.drawImage(
            this.image,
            this.framsCrrnt * (this.image.width / this.framsMax),
            0,
            this.image.width / this.framsMax,
            this.image.height,
            this.position.x - this.offSet.x,
            this.position.y - this.offSet.y,
            (this.image.width / this.framsMax) * this.scale,
            this.image.height * this.scale)
    }

    animateFrams() {
        this.timePassed++
        if (this.timePassed % this.framsHold === 0) {
            if (this.framsCrrnt < this.framsMax - 1) {
                this.framsCrrnt += 1
            } else {
                this.framsCrrnt = 0
            }
        }
    }

    update() {
        this.draw()
        this.animateFrams()

    }
}


class Fighter extends Sprite {
    constructor({
        position,
        velocity,
        color = 'red',
        imagSrc,
        scale = 1,
        offSet = { x: 0, y: 0 },
        attackBox = { offSet: {}, width: undefined, height: undefined },
        framsMax = 1,
        sprites
    },) {
        super({
            position,
            imagSrc,
            scale,
            framsMax,
            offSet
        })

        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.isAttacking = false
        this.health = 100
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offSet: attackBox.offSet,
            width: attackBox.width,
            height: attackBox.height,
        }
        this.framsCrrnt = 0
        this.framsElapsed = 0
        this.framsHold = 5
        this.color = color
        this.dead = false
        this.sprites = sprites

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imagSrc
        }
    }


    update() {
        this.draw()
        if (!this.dead) {
            this.animateFrams()
        }

        // attack box
        this.attackBox.position.x = this.position.x + this.attackBox.offSet.x
        this.attackBox.position.y = this.position.y + this.attackBox.offSet.y

        // c.fillRect(
        //     this.attackBox.position.x,
        //     this.attackBox.position.y,
        //     this.attackBox.width,
        //     this.attackBox.height
        // )


        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 97) {
            this.velocity.y = 0
            this.position.y = 330
        } else this.velocity.y += grafity
    }

    attack() {
        this.swichSprite('attack1')
        this.isAttacking = true
    }

    takeHit() {
        this.health -= 10
        if (this.health <= 0) {
            this.swichSprite('death')
        } else this.swichSprite('take-hit')
    }
    swichSprite(sprite) {
        if (this.image === this.sprites.death.image) {
            if (this.framsCrrnt === this.sprites.death.framsMax - 1) {
                this.dead = true
            }
            return
        }
        // overwrting all other animations with the attack animation
        if (
            this.image === this.sprites.attack1.image &&
            this.framsCrrnt < this.sprites.attack1.framsMax - 1
        )
            return
        // kinda same thing with the takeHit animation 
        if (
            this.image === this.sprites.takeHit.image &&
            this.framsCrrnt < this.sprites.takeHit.framsMax - 1
        )
            return
        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image
                }
                this.framsMax = this.sprites.idle.framsMax
                break
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image
                }
                this.framsMax = this.sprites.run.framsMax
                this.framsCrrnt = 0
                break
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image
                }
                this.framsMax = this.sprites.jump.framsMax
                this.framsCrrnt = 0
                break
            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image
                }
                this.framsMax = this.sprites.fall.framsMax
                this.framsCrrnt = 0
                break
            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image
                }
                this.framsMax = this.sprites.attack1.framsMax
                this.framsCrrnt = 0
                break
            case 'take-hit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image
                }
                this.framsMax = this.sprites.takeHit.framsMax
                this.framsCrrnt = 0
                break
            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image
                }
                this.framsMax = this.sprites.death.framsMax
                this.framsCrrnt = 0
                break
        }
    }
}