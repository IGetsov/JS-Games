const board = ['pink', 'blue', 'green', 'red', 'purple', 'orange'];
const myBoard = [];
const gameBoard = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 2, 3, 2, 2, 2, 2, 2, 2, 1,
    1, 2, 1, 1, 1, 1, 1, 1, 2, 1,
    1, 2, 2, 2, 2, 2, 2, 2, 2, 1,
    1, 2, 1, 1, 1, 1, 1, 1, 2, 1,
    1, 2, 2, 2, 2, 2, 2, 2, 2, 1,
    1, 2, 1, 1, 1, 1, 1, 1, 2, 1,
    1, 2, 2, 2, 2, 2, 2, 2, 2, 1,
    1, 2, 2, 2, 2, 2, 2, 2, 2, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1
];
const keys = {
    ArrowRight: false, 
    ArrowLeft: false, 
    ArrowUp: false, 
    ArrowDown: false
};
const ghosts = [];
const game = {
    x:'', 
    y:'', 
    h:100, 
    size:10, 
    ghosts:6, 
    inplay: false
}
const player = {
    pos:84,
    speed: 4,
    cool: 0,
    pause: false,
    score: 0,
    lives: 5
}

document.addEventListener('DOMContentLoaded', ()=>{
    game.grid = document.querySelector('.grid'); // gameBoard
    game.packman = document.querySelector('.pacman'); // pacman
    game.eye = document.querySelector('.eye'); // select pacman eye
    game.mouth = document.querySelector('.mouth'); // select pacman mouth
    game.ghost = document.querySelector('.ghost'); // select ghost object
    game.ghost.style.display = 'none';
    game.score = document.querySelector('.score'); // select game score
    game.lives = document.querySelector('.live'); // select game lives
    createGame(); // initialize the game board
   
})

// add ghosts on the board
document.addEventListener('keydown', (e)=> {
    console.log(e.code); // Key presses
    if(e.code in keys){
        keys[e.code] = true;
    }
    if(!game.inplay && !player.pause){
        player.play = requestAnimationFrame(move);
        game.inplay = true;
    }
})

document.addEventListener('keyup', (e)=>{
    if(e.code in keys){
        keys[e.code] = false;
    }
})


function createGame(){
    gameBoard.forEach(
        (cell)=>{
            createSquare(cell);
    })
    for(let i=onabort;i<game.size;i++){
        game.x += `${game.h}px`;
    }
    game.grid.style.gridTemplateColumns = game.x;
    game.grid.style.gridTempateRows = game.x;

    startPos();

    for(let i=0;i<game.ghosts;i++){
        createGhost();
    }
}

function gameReset(){
    console.log('Paused');
    window.cancelAnimationFrame(player.play);
    game.inplay = false;
    player.pause = true;
    setTimeout(startPos, 3000);
}

function startPos(){
    player.pause = false;
    let firstStartPos = 84;
    player.pos = startPosPlayer(firstStartPos);
    myBoard[player.pos].append(game.packman);
    ghosts.forEach((ghost, ind)=>{
        let temp = (game.size + 1) + ind;
        ghost.pos = startPosPlayer(temp);
        myBoard[ghost.pos].append(ghost);
    })
}

function startPosPlayer(val){
    if(myBoard[val].t !=1){
        return val
    }
    return startPosPlayer(val+ 1);
}

function updateScore(){
    if(player.lives ==0){
        console.log('Game over');
        game.lives.innerHTML = 'GAME OVER'
    }else{
        game.score.innerHTML = `Score : ${player.score}`;
        game.lives.innerHTML = `Lives : ${player.lives}`;
    } 
}

function createSquare(val){
    const div = document.createElement('div');
    div.classList.add('box');
    if(val == 1){ div.classList.add('wall');} // render wall
    if(val == 2){ 
        const dot = document.createElement('div');
        dot.classList.add('dot');
        div.append(dot);} // render dot
    if(val == 3){ 
        const dot = document.createElement('div');
        dot.classList.add('superdot');
        div.append(dot);} // render superdot
    if(val == 1){ div.classList.add('wall');}

    game.grid.append(div);
    myBoard.push(div);
    div.t = val; // check element type
    div.idVal = myBoard.length;
}

function createGhost(){
    let newGhost = game.ghost.cloneNode(true);
    newGhost.pos = 12 + ghosts.length;
    newGhost.style.display = 'block';
    newGhost.counter = 0;
    newGhost.dx = Math.floor(Math.random()*4);
    // Iterate board list with colors with each newly added ghost
    newGhost.style.backgroundColor = board[ghosts.length];
    newGhost.name = board[ghosts.length] + 'y';
    ghosts.push(newGhost); 
    console.log(newGhost);
}
// take an object and return row, col values
function findDirection(obj){
    let val = [obj.pos % game.size, Math.ceil(obj.pos / game.ghosts.size)];
    return val;
}
// Control ghost movement
function changeDir(gh){
    let gg = findDirection(gh);
    let pp = findDirection(player);
    let ran = Math.floor(Math.random()*2);
    if(ran ==0){
        gh.dx = (gg[0] < pp[0]) ? 2: 3; // rows
    } else {
        gh.dx = (gg[1] < pp[1]) ? 1: 0; // cols
    }
    gh.counter = (Math.random()*2)+ 2;
}

function move(){
    if(game.inplay){
        player.cool--; // player cooldown move speed
        if(player.cool < 0){
            // movement of ghosts on screen
            ghosts.forEach((ghost)=>{
                myBoard[ghost.pos].append(ghost);
                ghost.counter--;
                let oldPos = ghost.pos; // original ghost pos
                if(ghost.counter <= 0){
                    changeDir(ghost);
                }else{
                    if(ghost.dx==0){
                        ghost.pos -=game.size;
                    }
                    else if(ghost.dx==1){
                        ghost.pos += game.size;
                    }
                    else if(ghost.dx==2){
                        ghost.pos += 1;
                    }
                    else if(ghost.dx==3){
                        ghost.pos -= 1;
                    }
                }
                // check for ghost collision with pacman
                if(player.pos == ghost.pos){
                    console.log('Ghost got you '+ ghost.name);
                    player.lives--;
                    updateScore();
                    gameReset();
                }
                let valGhost = myBoard[ghost.pos]; // future ghost position
                if(valGhost.t == 1){
                    ghost.pos=oldPos;
                    changeDir(ghost);
                }
                myBoard[ghost.pos].append(ghost);
            })

            let tempPos = player.pos;

            // kayboard events
            if(keys.ArrowRight){
                player.pos+=1;
                game.eye.style.left = '20%';
                game.mouth.style.left = '60%';
            }
            else if(keys.ArrowLeft){
                player.pos -=1;
                game.eye.style.left = '60%';
                game.mouth.style.left = '0%';
            }
            else if(keys.ArrowUp){
                player.pos -=game.size;
            }
            else if(keys.ArrowDown){
                player.pos +=game.size;
            }
            let newPos = myBoard[player.pos]; // new position
            // check for wall colision
            if(newPos.t == 1){
                console.log('wall');
                player.pos = tempPos;
            }
            // check if dot is eaten and update score and animation
            if(newPos.t == 2){
                console.log('dot');
                myBoard[player.pos].innerHTML = '';
                player.score++;
                updateScore();
                newPos.t = 0;
            }
            if(player.pos != tempPos){
                // Open / close mouth
                if(player.tog){
                    game.mouth.style.height = '30%';
                    player.tog = false;
                } else {
                    game.mouth.style.height = '10%';
                    player.tog = true;
                }
            }
            player.cool = player.speed; // set cool off
            console.log(newPos.t);
        }
        if(!player.pause){
            myBoard[player.pos].append(game.packman);
            player.play = requestAnimationFrame(move);
        }
    }
}