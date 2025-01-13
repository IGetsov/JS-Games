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
    pos:20,
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
    createGame(); // initialize the game board
    console.log(game);
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
}