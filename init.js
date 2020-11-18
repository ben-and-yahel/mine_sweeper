function dynamicallyLoadScript(url) {
    var script = document.createElement("script");  // create a script DOM node
    script.src = url;  // set its src to the provided URL
    document.body.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
}

window.onload =function() {
    dynamicallyLoadScript("button_functions.js");

    document.addEventListener("keypress",draw_path);
    document.oncontextmenu = onClick;
    canv=document.getElementById("gc");
    ctx = canv.getContext("2d");
    ctx.canvas.width  = window.innerWidth - 20;
    ctx.canvas.height = window.innerHeight - strap_height;
    init();
    
}

class Point{
    constructor(x, y, color="grey"){
        this.x = x;
        this.y = y;
        this.color = color;
        this.H_cost = 0; //distance between the end point and another point
        this.G_cost = 0;//distance between the start point and another point
        this.F_cost = 0;// the sum of g cost and h cost
    }
    upgrade(depth) {
        this.H_cost = calculateHcost(this);
        this.G_cost = calculateGcost(this);
        this.G_cost = (this.G_cost + depth*100) / 2.0;
        this.F_cost = this.H_cost*0.7 + this.G_cost*0.3;
    }
}
class Node{
    constructor(p,n){
        this.point = p;
        this.node = n;
        this.depth = 0;
        if(n != null)
        {
            this.depth = n.depth + 1;
        }
    }
    upgrade() {
        this.point.upgrade(this.depth);
    }

}
strap_height = 138;
height = width = 100;
algorithem_mind = []; // mind => [[stage],[stage]], stage => [[x,y],[x,y]]
seperate = 1;
squars = []; // square => [int]
startExist = false;
start = end = undefined;
isAnimate = true;
algorithem_number = 1;
stage_index = 0;
full_line_mark = false;
square_animation_index = 0;
animate_square = undefined;
animation_rate = 70;
cornerRadius = 15;

x_squares = y_squares = 10;
board = [];
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
    mine_setter(20);
    squars = surround(squars, bombs);
    printSquares();
}
//for loop on every item and show it on the canvas
function printSquares() {
    x = y = 0;
    color = "grey";
    for (let i = 0; i < squars.length; i++) {
        for (let j = 0; j < squars[i].length; j++) {
            if (squars[i][j].number == -1) {
                color = "red";
            }
            else if (squars[i][j].number == 1) {
                color = "blue";
            }
            else{
                color = "grey";
            }
            ctx.fillStyle = color;
            ctx.fillRect(i*width, j*height, width-seperate, height-seperate);
        }
    }
}
//make the animation of sqaure been choosen
function draw_square(point) {
    squars[point.x][point.y] = point.color;
    ctx.fillStyle = point.color;
    ctx.strokeStyle = point.color;
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
//check colum if all black
function row_color(x) {
        for (let y = 0; y < squars[x].length; y++) {
            if(squars[x][y] != "black"){
                return false;
            }
        }
    return true;
}
function clearBoard() {
    for (let i = 0; i < squars.length; i++) {
        for (let j = 0; j < squars[i].length; j++) {
            if (squars[i][j] != "black" && squars[i][j] != "grey"  && squars[i][j] != "blue"  && squars[i][j] != "red" ) {
                squars[i][j] = "grey";
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
    isChanged = false;
    for (let x = 0; x < squars.length; x++) {
        let is_grey_row = row_color(x);
        for (let y = 0; y < squars[x].length; y++) {
            if (e.button==2 && (squars[x][y] == "blue" || squars[x][y] == "red")) {
                if (squars[x][y] == "blue" && !startExist) {
                    squars[x][y] = "grey";
                }
                else if (squars[x][y] == "red" && startExist) {
                    squars[x][y] = "grey";
                }
            }
            //draw a full row of squares
            else if(full_line_mark && clicX >= x*width && clicX <= x*width+width-seperate && e.button!=2)
            {
                //update_square(new Point(x, y, "black"))
                if (is_grey_row) {
                    squars[x][y] = "grey";
                }
                else
                {
                    squars[x][y] = "black";
                }
                
                continue;
            }
            if (clicX >= x*width && clicX <= x*width+width-seperate 
                && clicY >= y*height && clicY <= y*height+height-seperate) {
                    if (e.button == 2) {
                        //if there is start so it gone to red for end
                        if (startExist) {
                            end = new Point(x, y, "red");
                            update_square(end);
                        }
                        else
                        {
                            start = new Point(x, y, "blue");
                            update_square(start);
                        }
                        isChanged = true;// if endpoint is set we update it in the end of the func
                    }
                    else if (squars[x][y] != "grey") {
                        update_square(new Point(x, y, "grey"));
                    }
                    //the squre is grey and about to be black
                    else{
                        
                        //calc_HGF_cost(x,y);
                        update_square(new Point(x, y, "black"));
                    }
                    
            }        
        }
    }
    printSquares();
    isChanged ? startExist = !startExist : false;
    isChanged = false;
    return false;
}
function update_square(point) {
    animate_square = setInterval(draw_square,1000/animation_rate,point);
}


function draw_path() {

    if (end == undefined) {
        alert("please enter start and end point(right mouse click)!");
        return;
    }
    stage_index = 0;
    clearBoard();
    algorithem_mind = [];
    let result = [];
    var t0 = performance.now()
    switch (algorithem_number) {
        case 1:
            result = A_algorithm();
            break;
        case 2:
            result = star_algorithm();
            break;
        default:
            break;
    }
    var t1 = performance.now()
    if(result != null){
        result = result.node;
    squars[end.x][end.y] = "red";
    squars[start.x][start.y] = "blue";
    path_result = result;
    }
    //alert("Call to doSomething took " + (t1 - t0)/1000 + " seconds.");
    
    
    if (isAnimate) {
        draw_animation(result);
    }
    else{
        while(result.node)
        {
            squars[result.point.x][result.point.y] = "#00ffcc";  
            result = result.node;
        }
        printSquares();
    }
}
function expand(board,x,y)
{

    if(board[x][y].number == 0)
    {
        board[x][y].show = true;
        if(board[x+1][y].show === false && board[x+1][y] != -1)
            board[x+1][y] == 0 ? expand(board,x+1,y) : board[x+1][y].show = true;
        if(board[x-1][y].show === false && board[x-1][y] != -1)
            board[x-1][y] == 0 ? expand(board,x-1,y) : board[x-1][y].show = true;
        if(board[x][y+1].show === false && board[x][y+1] != -1)
            board[x][y+1] == 0 ? expand(board,x,y+1) : board[x][y+1].show = true;
        if(board[x][y-1].show === false && board[x][y-1] != -1)       
            board[x][y-1] == 0 ? expand(board,x,y-1) : board[x][y-1].show = true;
    }
    else if(board[x][y] == -1)
    {
        bomb();
    }
    else
    {
        board[x][y].show = true;
    }

}
function bomb()
{
    for(let y = 0;y < board.length;y++){
        for(let x = 0;x < board[y].length;x++){
            if(board[x][y] == -1)
            {
                board[x][y].show = true;
            }
        }
    }
}
function surround(board,bombs)
{
    for(let b in bombs)
    {
        let x = b[0];
        let y = b[1];
        if(x+1 < x_squares)
            board[x+1][y] != -1 ?  board[x+1][y].number += 1 : board[x+1][y].number += 0 ;
        if(y+1 < y_squares)
            board[x][y+1] != -1 ?  board[x][y+1].number += 1 : board[x][y+1].number += 0 ;
        if(x-1 >= 0)
            board[x-1][y] != -1 ?  boardboard[x-1][y].number += 1 : board[x-1][y].number += 0 ;
        if(y-1 >= 0)
            board[x][y-1] != -1 ?  board[x][y-1].number += 1 : board[x][y-1].number += 0 ;
        if(x+1 < x_squares && y+1 < y_squares)
            board[x+1][y+1] != -1 ?  board[x+1][y+1].number += 1 : board[x+1][y+1].number += 0 ;
        if(x-1 >= 0 && y-1 >= 0)
            board[x-1][y-1] != -1 ?  board[x-1][y-1].number += 1 : board[x-1][y-1].number += 0 ;
        if(x+1 < x_squares && y-1 >= 0)
            board[x+1][y-1] != -1 ?  board[x+1][y-1].number += 1 : board[x+1][y-1].number += 0 ;
        if(x-1 >= 0 && y+1 < y_squares)
            board[x-1][y+1] != -1 ?  board[x-1][y+1].number += 1 : board[x-1][y+1].number += 0 ;
    }
    return board;
}