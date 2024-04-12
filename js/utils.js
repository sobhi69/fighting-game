
function rectanglerCollision({ rectangler1, rectangler2 }) {
    return (
        rectangler1.attackBox.position.x + rectangler1.attackBox.width >= rectangler2.position.x &&
        rectangler1.attackBox.position.x <= rectangler2.position.x + rectangler2.width &&
        rectangler1.attackBox.position.y + rectangler1.attackBox.height >= rectangler2.position.y &&
        rectangler1.attackBox.position.y <= rectangler2.position.y + rectangler2.height
    )
}

function determineWinner({player,enemy,timeId}) {
    clearTimeout(timeId)
    document.getElementById('playAgian').style.display = 'flex'
    document.getElementById("displayText").style.display = 'flex'
    if (enemy.health === player.health) {
        document.getElementById("displayText").innerText = 'Tie'   
    } else if (player.health > enemy.health) {
        document.getElementById("displayText").innerText = 'player 1 wins!'
    } else {
        document.getElementById("displayText").innerText = 'player 2 wins!'
    }
}
let time = 60
let timeId
function decreaseTimer() {
    if (time > 0) {
        timeId = setTimeout(decreaseTimer, 1000)
        time--
        document.getElementById("timer").innerText = time
    }
    if (time === 0) {
     determineWinner({player,enemy,timeId})
    }
}