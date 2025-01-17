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
    pause: false
}

document.addEventListener('DOMContentLoaded', ()=>{
    game.grid = document.querySelector('.grid'); // gameBoard
    game.packman = document.querySelector('.pacman'); // pacman
    game.eye = document.querySelector('.eye'); // select pacman eye
    game.mouth = document.querySelector('.mouth'); // select pacman mouth
    game.ghost = document.querySelector('.ghost'); // select ghost object
    game.ghost.style.display = 'none';
    game.packman.style.display = 'none';
    createGame(); // initialize the game board
    console.log(game);
})

// add ghosts on the board
document.addEventListener('keydown', (e)=> {
    console.log(e.code); // Key presses
    if(e.code in keys){
        keys[e.code] = true;
    }
    if(!game.inplay && !player.pause){
        game.packman.style.display = 'block';
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
            console.log(cell);
            createSquare(cell);
    })
    for(let i=onabort;i<game.size;i++){
        game.x += `${game.h}px`;
    }
    game.grid.style.gridTemplateColumns = game.x;
    game.grid.style.gridTempateRows = game.x;

    for(let i=0;i<game.ghosts;i++){
        createGhost();
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

// Control ghost movement
function changeDir(g){
    g.dx = Math.floor(Math.random()*4);
    g.counter = (Math.random()*10)+ 2;
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
                if(ghost.counter < 0){
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
                let valGhost = myBoard[ghost.pos]; // future ghost position
                if(valGhost.t == 1){
                    ghost.pos=oldPos;
                    changeDir(ghost);
                }
                myBoard[ghost.pos].append(ghost);
            })

            // kayboard events
            
            let tempPos = player.pos;
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
            if(newPos.t == 1){
                console.log('wall');
                player.pos = tempPos;
            }
            if(newPos.t == 2){
                console.log('dot');
                myBoard[player.pos].innerHTML = '';
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
        myBoard[player.pos].append(game.packman);
        player.play = requestAnimationFrame(move);
    }
}