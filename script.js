
const container = document.getElementById('game-container');;

const player = document.getElementById('player');

const scoreEl = document.getElementById('score');

const healthFill = document.getElementById('health-fill');

const startScreen = document.getElementById('start-screen');

const gameOverScreen = document.getElementById('game-over');

const finalScoreEl = document.getElementById('final-score');

const deathReason = document.getElementById('death-reason');

const startBtn = document.getElementById('start-btn');

let score = 0;
let health = 100;
let gameActive = false;
let entities = [];
let lastSpawnTime = 0;
let spawnRate = 1000;

const movePlayer = (clientX) => {
    if(!gameActive) 
        return;

    const rect = container.getBoundingClientRect();
    let x = clientX - rect.left;
    const half = player.offsetWidth /2;
    x = Math.max(half, Math.min(x, container.offsetWidth - half));
    player.style.left = x + 'px';
}

container.addEventListener('mousemove', (e) => movePlayer(e.clientX));

container.addEventListener('touchmove', (e) => {
    e.preventDefault();
    movePlayer(e.touches[0].clientX);

}
,
{
    passive: false

}
);

function spawnEntity() {
    
    const isBomb = Math.random() < 0.5;
    const entity = {
        type: isBomb ? 'bomb' : 'flower', 
        x: Math.random() * (container.offsetWidth - 40) + 20, 
        y: -50,
        speed: 5 + Math.random() * 3 + (score / 300),
        element: document.createElement('div')
    };

    entity.element.className = `entity ${entity.type}`;

    entity.element.innerText = isBomb ? '💣' : '🌺';

    entity.element.style.left = entity.x + 'px';

    container.appendChild(entity.element);

    entities.push(entity);

}

    
function update(timestamp) {

    if(!gameActive) return;

    if(timestamp - lastSpawnTime > spawnRate) {
        spawnEntity();
        lastSpawnTime = timestamp;
        if(spawnRate > 350) spawnRate -= 2;
    }

    for(let i = entities.length - 1; i >= 0; i--) {

        let e = entities[i]; 

        e.y += e.speed;

        e.element.style.transform = `translateY(${e.y}px)`;


        const pRect = player.getBoundingClientRect();

        const eRect = e.element.getBoundingClientRect();

        if(eRect.bottom > pRect.top && eRect.right > pRect.left &&

            eRect.left < pRect.right && eRect.top < pRect.bottom) {

                if(e.type === 'bomb') {
                    endGame('💣 DESTROYED your🪣');
                    return;
                }
                else {
                    score += 10;
                    health = Math.min(100, health + 5);
                    scoreEl.innerText = score;
                    removeEntity(e, i) ;
                    ;
                }   
            }
            else if (e.y > container.offsetHeight) {

                if(e.type === 'flower') {
                    health -= 10;
                    updateHealthUI();
                }
                removeEntity(e, i);
            }
    }

    if(health <= 0) endGame('You Lost The Game! 🤯 ');

    if(gameActive) requestAnimationFrame(update);
}

function removeEntity(e, index) {

    e.element.remove();
    entities.splice(index, 1);
    ;

}

function updateHealthUI() {

    healthFill.style.width = health + '%';
    healthFill.style.backgroundColor = health < 40 ? 'rgb(99, 25, 25)' : 'rgb(27, 86, 25)' ;

}

function endGame(reason) {
    gameActive = false;
    gameOverScreen.style.display = 'flex';
  deathReason.innerText = reason;
 finalScoreEl.innerText = score;

}
startBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameActive = true;
    requestAnimationFrame(update);
});




