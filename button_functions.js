//-----------------button functions-------------------
function animation() {
    let txt = "Animation &#973";
    isAnimate = !isAnimate;
    document.getElementById("animation").innerHTML = !isAnimate? txt+"4;":  txt+"3;";
}
function template() {
    color = "black";
    if (start != undefined) {
        squars[start.x][start.y] = "grey";
    }
    if (end != undefined) {
        squars[end.x][end.y] = "grey";
    }
    for (let x = 0; x < squars.length; x+=3) {
        for (let y = 0; y < squars[x].length-1; y+=3) {
            squars[x][y] = color;
        }
    }
    squars[1][0] = "blue";
    start = new Point(1, 0);
    squars[7][6] = "red";
    end = new Point(7, 6);
    printSquares();
}
function algorithem(number) {
    h = document.getElementById("algorithms");
    switch (number) {
        case 1:
            h.innerHTML = "A* algorithm&#9773";
            break;
        case 2:
            h.innerHTML = "Star algorithm";
            break;
        default:
            break;
    }
    //alert("you choose algorithem number "+number);
    algorithem_number = number;
}
function row() {
    full_line_mark = !full_line_mark;
} 