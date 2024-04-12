const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')


canvas.width = 1024
canvas.height = 576
c.fillRect(0, 0, canvas.width, canvas.height)
const grafity = 0.7


const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imagSrc: './img/background.png',
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    scale: 2.75,
    framsMax: 6,
    imagSrc: './img/shop.png',
})

// console.log(shop.image.width / 6)

const player = new Fighter({
    position: {
        x: 50,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offSet: {
        x: 200,
        y: 160
    },
    imagSrc: './img/samuraiMack/Idle.png',
    scale: 2.5,
    framsMax: 8,
    sprites: {
        idle: {
            imagSrc: './img/samuraiMack/Idle.png',
            framsMax: 8,
        },
        run: {
            imagSrc: './img/samuraiMack/Run.png',
            framsMax: 8,
        },
        jump: {
            imagSrc: './img/samuraiMack/Jump.png',
            framsMax: 2,
        },
        fall: {
            imagSrc: './img/samuraiMack/Fall.png',
            framsMax: 2,
        },
        attack1: {
            imagSrc: './img/samuraiMack/Attack1.png',
            framsMax: 6,
        },
        attack2: {
            imagSrc: './img/samuraiMack/Attack2.png',
            framsMax: 6,
        },
        takeHit: {
            imagSrc: './img/samuraiMack/Take Hit - white silhouette.png',
            framsMax: 4,
        },
        death: {
            imagSrc: './img/samuraiMack/Death.png',
            framsMax: 6,
        }
    },
    attackBox: {
        offSet: { x: 100, y: 50 },
        width: 150,
        height: 50,
    }

})
const enemy = new Fighter({
    position: {
        x: canvas.width - 100,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    imagSrc: './img/kenji/Idle.png',
    offSet: {
        x: 215,
        y: 167
    },
    scale: 2.5,
    framsMax: 4,
    sprites: {
        idle: {
            imagSrc: './img/kenji/Idle.png',
            framsMax: 4,
        },
        run: {
            imagSrc: './img/kenji/Run.png',
            framsMax: 8,
        },
        jump: {
            imagSrc: './img/kenji/Jump.png',
            framsMax: 2,
        },
        fall: {
            imagSrc: './img/kenji/Fall.png',
            framsMax: 2,
        },
        attack1: {
            imagSrc: './img/kenji/Attack1.png',
            framsMax: 4,
        },
        attack2: {
            imagSrc: './img/kenji/Attack2.png',
            framsMax: 4,
        },
        takeHit: {
            imagSrc: './img/kenji/Take hit.png',
            framsMax: 3,
        },
        death: {
            imagSrc: './img/kenji/Death.png',
            framsMax: 7,
        }
    },
    attackBox: {
        offSet: { x: -170, y: 50 },
        width: 170,
        height: 50,
    }
})

decreaseTimer()

const keys = {
    a: { pressed: false },
    d: { pressed: false },
    s: { pressed: false },
    w: { pressed: false },
    ArrowRight: { pressed: false },
    ArrowLeft: { pressed: false }

}
let dead = false
function animate() {
    window.requestAnimationFrame(animate)

    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255,255,255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()
    player.velocity.x = 0
    enemy.velocity.x = 0

    // player movment
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.swichSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.swichSprite('run')
    } else {
        player.swichSprite('idle')
    }

    // jumpping
    if (player.velocity.y < 0) {
        player.swichSprite('jump')
    } else if (player.velocity.y > 0) {
        player.swichSprite('fall')
    }

    // enemy movment
    if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.swichSprite('run')
    } else if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.swichSprite('run')
    } else {
        enemy.swichSprite('idle')
    }

    // jumpping
    if (enemy.velocity.y < 0) {
        enemy.swichSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.swichSprite('fall')
    }

    // detect for collision

    if (rectanglerCollision({ rectangler1: player, rectangler2: enemy })
        && player.isAttacking && player.framsCrrnt === 4) {
        enemy.takeHit()
        // document.querySelector("#enemyHealth").style.width = `${enemy.health}%`
        gsap.to('#enemyHealth', {
            width: `${enemy.health}%`
        })
    }
    // if player misses
    if (player.isAttacking && player.framsCrrnt === 4) {
        player.isAttacking = false
    }

    if (rectanglerCollision({ rectangler1: enemy, rectangler2: player })
        && enemy.isAttacking && enemy.framsCrrnt === 1) {
        player.takeHit()
        // document.querySelector("#playerHealth").style.width = `${player.health}%` 
        gsap.to('#playerHealth', {
            width:`${player.health}%`
        })
    }
    // if enemy misses
    if (enemy.isAttacking && enemy.framsCrrnt === 1) {
        enemy.isAttacking = false
    }

    if (player.health <= 0 || enemy.health <= 0) {
        determineWinner({ player, enemy, timeId })
    }
}

animate()
window.addEventListener('gamepadconnected', (e) => {
    console.log(e.key)
})

window.addEventListener('keydown', (event) => {
    // console.log(event.key)
    if (!player.dead) {
        switch (event.key) {
            case 'k':
                player.attack()
                break;

            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'

                break;
            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
                break;
            case 's':
                keys.s.pressed = true
                break;
            case 'w':
                player.velocity.y = -20
                break;
        }
    }
    if (!enemy.dead) {
        switch (event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                break;
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break;
            case 'ArrowUp':
                enemy.velocity.y = -20
                break
            case 'l':
                enemy.attack()
                break;
        }
    }
})


window.addEventListener('keyup', (event) => {
    // console.log(event.key)
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break;
        case 'a':
            keys.a.pressed = false
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break;
    }
})

document.getElementById('playAgian').addEventListener("click",() => {
    location.reload()
})



