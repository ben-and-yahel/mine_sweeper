function star_algorithm()
{
    let startNode = new Node(start,null);
    //checking if the start is a neighbore of the end
    if(haveReachTheEnd(startNode))
        return null
    let NodesArray = []
    let tempNodeArray = [];
    let tmp_stage = [];
    let temp = ExpandStarArray(startNode);//initiate the nodews array with the start point
    NodesArray.push.apply(NodesArray,temp[0]);
    tmp_stage.push.apply(tmp_stage,temp[1]);
    algorithem_mind.push([tmp_stage]);

    // startNode => start || NodesArray => [up, down, left, right]
    let bestTrace = null; 
    var exit = true;
    NodesArray.forEach(n => {//checking if the start is one step from the end
        if(haveReachTheEnd(n)){
            bestTrace = new Node(end,n);
            exit = false;
        }
    });

    while(exit)
    {
        if(NodesArray.length == 0){
            exit = false;
            squars[end.x][end.y] = "yellow"
            squars[start.x][start.y] = "yellow"
            alert("no path avalible!");
            continue;
        }
       //let removed = removeRepeaters(NodesArray);
        tempNodeArray = [];
        tmp_stage = [];
        NodesArray.forEach(n => {//checking if the start is a neighbore of the end
            temp = ExpandStarArray(n);
            tempNodeArray.push.apply(tempNodeArray,temp[0]);
            tmp_stage.push.apply(tmp_stage,temp[1]);
        });
        algorithem_mind.push([tmp_stage]);
        NodesArray = tempNodeArray;
        removeRepeaters(NodesArray);
        NodesArray.forEach(n => {//making progress, sign it and check if finish
            if(haveReachTheEnd(n)){
                bestTrace = new Node(end,n);
                exit = false;
            }
        });
    }
    for (let i = 0; i < squars.length; i++) {
        for (let j = 0; j < squars[i].length; j++) {
            if(squars[i][j] == "pink")
                squars[i][j] = "grey";
        }
    }
    //alert("time took: "+(time2.getMilliseconds()-time1.getMilliseconds())+" mill sec");
    return bestTrace;
    //return bestTrace;
}

/*
 expanding searching area
 return an array of nodes
 */
function ExpandStarArray(ExpendedNode)
{
    let NodesArray = [];
    let width = squars.length;
    let height = squars[0].length;
    let x = ExpendedNode.point.x;
    let y = ExpendedNode.point.y;
    if (debug_mode) {
       h = document.getElementById("welcome");
       h.innerHTML  = "y:"+y+" x:"+x+" F: "+Math.floor(ExpendedNode.point.F_cost)+" H: "+Math.floor(ExpendedNode.point.H_cost);
   }
    //check if posible to go there and then create and push a new node
    if(x-1 >= 0 && squars[x-1][y] != "black" && squars[x-1][y] != "pink" && haventBeenThere(x-1,y,ExpendedNode))
        NodesArray.push(new Node(new Point(x-1,y,"green"),ExpendedNode));
    if(x+1 < width && squars[x+1][y] != "black" && squars[x+1][y] != "pink" && haventBeenThere(x+1,y,ExpendedNode))
        NodesArray.push(new Node(new Point(x+1,y,"green"),ExpendedNode));
    if(y-1 >= 0 && squars[x][y-1] != "black" && squars[x][y-1] != "pink" && haventBeenThere(x,y-1,ExpendedNode))
        NodesArray.push(new Node(new Point(x,y-1,"green"),ExpendedNode));
    if(y+1 < height && squars[x][y+1] != "black" && squars[x][y+1] != "pink" && haventBeenThere(x,y+1,ExpendedNode))
        NodesArray.push(new Node(new Point(x,y+1,"green"),ExpendedNode));
  let tmp_stage = [];
    for (let index = 0; index < NodesArray.length; index++) {
        x = NodesArray[index].point.x;
        y = NodesArray[index].point.y;

        squars[x][y] = "pink";
        tmp_stage.push(NodesArray[index].point);//mark the way:)
    }
    //for the visualtion
        
    return [NodesArray,tmp_stage];
}