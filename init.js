function dynamicallyLoadScript(url) {
    var script = document.createElement("script");  // create a script DOM node
    script.src = url;  // set its src to the provided URL
    document.body.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
}

window.onload =function() {
    dynamicallyLoadScript("button_functions.js");
    welcome = document.getElementById("welcome");
    welcome.innerHTML = "Welocome to the Mine Sweeper!";
    //document.addEventListener("keypress",draw_path);
    document.oncontextmenu = onClick;
    canv=document.getElementById("gc");
    ctx = canv.getContext("2d");
    ctx.canvas.width  = window.innerWidth - 20;
    ctx.canvas.height = window.innerHeight - strap_height;
    init();
    
}


strap_height = 138;
height = width = 80;
seperate = 1;
squars = []; // square => [int]
x_squares = y_squares = 10;
board = [];
mines_number = 15;
flags_counter = mines_number;
const flagImage = new Image(width - 10, height - 10); // Using optional size for image
// Load an image of intrinsic size 300x227 in CSS pixels
flagImage.src = 'kisspng-red-flag-computer-icons-clip-art-flag-5ab891fa270012.8897476815220454341598.png';
let num_images = [
    new Image(width - 10, height - 10),
    new Image(width - 10, height - 10),
    new Image(width - 10, height - 10),
    new Image(width - 10, height - 10),
    new Image(width - 10, height - 10),
    new Image(width - 10, height - 10),
    new Image(width - 10, height - 10),
    new Image(width - 10, height - 10),
    new Image(width - 10, height - 10)
]
for(let i = 0;i<num_images.length;i++)
{
    num_images[i].src = "76px-Minesweeper_" + i + ".svg.png";
}
class square{
    constructor(number, show){
    this.number = number;
    this.show = show;
    this.redFlag = false;
    this.question = false;
    }
}
function check_duplicate_mines(bombs, x, y) {
    for (let index = 0; index < bombs.length; index++) {
        if (bombs[index][0] == x && bombs[index][1] == y) {
            return false;
        }
    }
    return true;
}
function mine_setter(bombs_number) {
    bombs = []; // bomb => [[x,y],[x,y]]
    for (let index = 0; index < bombs_number; index++) {
        do{
            x = Math.floor((Math.random() * x_squares) + 0);
            y = Math.floor((Math.random() * y_squares) + 0);
        }while(check_duplicate_mines(bombs,x,y) == false);
        squars[x][y].number = -1;
        bombs.push([x,y]);
    }
    return bombs;
}
// ----------------init functions--------------------
function init() {
    //makes the squars
    for (let i = 0; i < x_squares; i++) {
        tmp_squars_line = [];
        for (let j = 0; j < y_squares; j++) {
            tmp_squars_line.push(new square(0,false));
        } 
        squars.push(tmp_squars_line);      
    }
    bombs = mine_setter(mines_number);
    surround(squars, bombs);
    
    
    printSquares();
}
//for loop on every item and show it on the canvas
function printSquares() {
    x = y = 0;
    color = "grey";
    welcome.innerHTML = "Welocome to the Mine Sweeper! you got "+flags_counter+" flags / "+mines_number+" mines";

    for (let i = 0; i < squars.length; i++) {
        for (let j = 0; j < squars[i].length; j++) {
            //draw mines
            if (squars[i][j].number == -1 && squars[i][j].show) {
                color = "red";
            }
            ctx.fillStyle = color;
            ctx.fillRect(i*width, j*height, width-seperate, height-seperate);
            //draw flags
            if(squars[i][j].redFlag == true)
                ctx.drawImage(flagImage,i*width, j*height, width-seperate, height-seperate)
            //draw numbers
            else if (squars[i][j].number > -1 && squars[i][j].show == true) {
                ctx.drawImage(num_images[squars[i][j].number],i*width, j*height, width-seperate, height-seperate)

            }
            else{
                color = "grey";
            }
        }
    }
}
/*TODO: require doc!! */
function onClick(e) {
    square_animation_index = 0;
    clearInterval(animate_square);
    pageShift = 65;
    clicX = e.pageX;
    clicY = e.pageY-pageShift;
    for (let x = 0; x < squars.length; x++) {
        for (let y = 0; y < squars[x].length; y++) {
            if (clicX >= x*width && clicX <= x*width+width-seperate 
                && clicY >= y*height && clicY <= y*height+height-seperate) {
                    switch (e.button) {
                        case 0:
                            expand(squars,x,y);
                            break;
                        case 4:
                            squars[x][y].question = true;
                            break;
                        case 2:
                            if (squars[x][y].redFlag == true) {
                                flags_counter += 1;
                                squars[x][y].show = false;
                                squars[x][y].redFlag = false;
                            }
                            else if (squars[x][y].show || flags_counter == 0) {
                                break;
                            }
                            else {
                                squars[x][y].redFlag = true;
                                flags_counter -= 1;
                            }
                            if (checkWinByMines(squars)) {
                                alert("you won the game!!!");
                            } 
                            break;
                            
                        default:
                            break;
                    }
                    //update_square(new Point(x, y))
            }        
        }
    }
    printSquares();
    return false;
}
function expand(board,x,y)
{
    if(board[x][y].number == 0)//if zero - expand, check your borders and find out rather you can expand or not, use recursive method
    {
        board[x][y].show = true;
    
        if(x+1 < x_squares && board[x+1][y].show === false)
            expand(board,x+1,y);
        if(y+1 < y_squares && board[x][y+1].show === false)
            expand(board,x,y+1);
        if(x-1 >= 0 && board[x-1][y].show === false)
            expand(board,x-1,y);        
        if(y-1 >= 0 && board[x][y-1].show === false)
            expand(board,x,y-1);        
        if(x+1 < x_squares && y+1 < y_squares && board[x+1][y+1].show === false)
            expand(board,x+1,y+1);        
        if(x-1 >= 0 && y-1 >= 0 && board[x-1][y-1].show === false)
            expand(board,x-1,y-1);        
        if(x+1 < x_squares && y-1 >= 0 && board[x+1][y-1].show === false)
            expand(board,x+1,y-1);        
        if(x-1 >= 0 && y+1 < y_squares && board[x-1][y+1].show === false)
            expand(board,x-1,y+1);

    }
    else if(board[x][y].number == -1)//if land on a mine - you lost
    {
        alert("Im sorry but you are dead :]");
        bomb(board);
    }
    else//in case of more then zero just show
    {
        board[x][y].show = true;
    }

}
function bomb(board)//showing the location of all he mines
{
    for(let y = 0;y < board.length;y++){
        for(let x = 0;x < board[y].length;x++){
            if(board[x][y].number == -1)
            {
                board[x][y].show = true;
            }
        }
    }
}
//initiate the board and check how many mines exist around a cube
function surround(board,bombs)//the function going on the locations of the mines and add to the cubes that surrounding them 1
{
    for(let i = 0;i<bombs.length;i++)
    {
        let x = bombs[i][0];
        let y = bombs[i][1];
        if(x+1 < x_squares)
            board[x+1][y].number != -1 ?  board[x+1][y].number += 1 : board[x+1][y].number += 0 ;
        if(y+1 < y_squares)
            board[x][y+1].number != -1 ?  board[x][y+1].number += 1 : board[x][y+1].number += 0 ;
        if(x-1 >= 0)
            board[x-1][y].number != -1 ?  board[x-1][y].number += 1 : board[x-1][y].number += 0 ;
        if(y-1 >= 0)
            board[x][y-1].number != -1 ?  board[x][y-1].number += 1 : board[x][y-1].number += 0 ;
        if(x+1 < x_squares && y+1 < y_squares)
            board[x+1][y+1].number != -1 ?  board[x+1][y+1].number += 1 : board[x+1][y+1].number += 0 ;
        if(x-1 >= 0 && y-1 >= 0)
            board[x-1][y-1].number != -1 ?  board[x-1][y-1].number += 1 : board[x-1][y-1].number += 0 ;
        if(x+1 < x_squares && y-1 >= 0)
            board[x+1][y-1].number != -1 ?  board[x+1][y-1].number += 1 : board[x+1][y-1].number += 0 ;
        if(x-1 >= 0 && y+1 < y_squares)
            board[x-1][y+1].number != -1 ?  board[x-1][y+1].number += 1 : board[x-1][y+1].number += 0 ;
    }
    return board;
}


square_animation_index = 0;
animate_square = undefined;
animation_rate = 70;
cornerRadius = 15;
isAnimate = true;
//make the animation of sqaure been choosen
function draw_square(point) {
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.fillRect((point.x*width+width/4)-square_animation_index/2,
                (point.y*height+height/4)-square_animation_index/2,
                (width-seperate)/2+square_animation_index,
                (height-seperate)/2+square_animation_index);
    square_animation_index +=1;
    if (square_animation_index > (height/2)-seperate-6) {
        square_animation_index = 0;

        // ctx.strokeRect(point.x*width+(cornerRadius/2), point.y*height+(cornerRadius/2), width-cornerRadius-seperate, height-cornerRadius-seperate);
        // ctx.fillRect(point.x*width+(cornerRadius/2), point.y*height+(cornerRadius/2), width-cornerRadius-seperate, height-cornerRadius-seperate);
        ctx.fillRect(point.x*width, point.y*height, width-seperate, height-seperate);
        clearInterval(animate_square);
        return;
    }
}
function update_square(point) {
    animate_square = setInterval(draw_square,1000/animation_rate,point);
}
function checkWin(board)//check for 2 kinds of win
{
    return checkWinByMines(board) || checkWinBySquares(board);
}
function checkWinByMines(board)//checks if al of the mines are flaged
{
    for(let y = 0;y < board.length;y++){
        for(let x = 0;x < board[y].length;x++){
            if(board[x][y].number == -1 && board[x][y].redFlag == false)
            {
                return false;
            }
        }
    }
    return true;
}
function checkWinBySquares(board)//checks if all of the squares are shown
{
    for(let y = 0;y < board.length;y++){
        for(let x = 0;x < board[y].length;x++){
            if(board[x][y].number != -1 && board[x][y].show == false)
            {
                return false;
            }
        }
    }
    return true;
}