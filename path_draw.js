// ---------------draw_path functions----------------
function animation_interval() {
    if (path_result.node == null || stage_index != -1) {
        return false;
    }
    clearInterval(animate_square);
    squars[path_result.point.x][path_result.point.y] = "#00ff99";  
    path_result = path_result.node;
    printSquares();
}
function draw_animation() {
    /*if(algorithem_number != 2)
        algorithem_mind.splice(-1,1);*/
    let light_tmp_stage = [];
    let dark_tmp_stage = [];
    var draw = setInterval(function () {
        algorithem_mind[stage_index].forEach(stage => {
            stage.forEach(point =>{
                squars[point.x][point.y] = "#003366";
            });
            dark_tmp_stage.forEach(point =>{
                squars[point.x][point.y] = "#0099cc";
            });
            light_tmp_stage.forEach(point =>{
                squars[point.x][point.y] = "#00ccff";
            });
            light_tmp_stage = dark_tmp_stage;
            dark_tmp_stage = stage;
        });

        //the end of the interval
        if (stage_index >= algorithem_mind.length-1) {
            dark_tmp_stage.forEach(point =>{
                squars[point.x][point.y] = "#00ccff";
            });
            light_tmp_stage.forEach(point =>{
                squars[point.x][point.y] = "#00ccff";
            });
            stage_index = -1;
            setInterval(animation_interval, 1000/15);
            clearInterval(draw);
            return;
        }
        stage_index +=1;
        printSquares();
    }, 1000/12);

}
