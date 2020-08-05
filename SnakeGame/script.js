/* eslint-disable no-debugger, no-console, no-unused-vars */
var c = document.getElementById("maincanvas");
//c.width = 512; c.height = 340; //set this always according to canvas BG pic
c.width = 649; c.height = 548; //set this always according to canvas BG pic
// resizing of the whole canvas can be done from CSS
var cs = 50;

var img = document.createElement("img");
img.src = "media/wood_bg.jpg";

var snake_skin = document.createElement("img");
snake_skin.src = "media/snake_skin4.png";

var snake_blood = document.createElement("img");
snake_blood.src = "media/blood.png";

var happy_rat = document.createElement("img");
happy_rat.src = "media/happy_rat2_t.png";

var food_rat = document.createElement("img");
food_rat.src = "media/food_rat2_t.png";

var pat_head_left = document.createElement("img");
pat_head_left.src = "media/snake_head2_left.png";

var pat_head_right = document.createElement("img");
pat_head_right.src = "media/snake_head2_right.png";

var pat_head_up = document.createElement("img");
pat_head_up.src = "media/snake_head2_up.png";

var pat_head_down = document.createElement("img");
pat_head_down.src = "media/snake_head2_down.png";

var pen = c.getContext("2d");

window.onload = function() {
}

var go_on,resetall,gameend;

var snake,food,score;
function init(){
    snake = {
        length:3,
        dx:0,
        dy:1,
        cells:[], //contains coord of top left vertex of each square
        createSnake:function () {
            this.length=3;
            for(let i=0; i<this.length; ++i){
                this.cells.push({x:0,y:i*cs});
            }
        },
        drawSnake:function () {
            for(let i=0; i<this.length-1; ++i){
                pen.drawImage(snake_skin,this.cells[i].y,this.cells[i].x,cs,cs);
            }
            var lastx = this.cells[this.length-1].x;
            var lasty = this.cells[this.length-1].y;
            if(this.dx==1 && this.dy==0){
                pen.drawImage(pat_head_down,lasty,lastx,cs,cs);
            }
            else if(this.dx==0 && this.dy==1){
                pen.drawImage(pat_head_right,lasty,lastx,cs,cs);
            }
            else if(this.dx==0 && this.dy==-1){
                pen.drawImage(pat_head_left,lasty,lastx,cs,cs);
            }
            else if(this.dx==-1 && this.dy==0){
                pen.drawImage(pat_head_up,lasty,lastx,cs,cs);
            }
        },
        shiftSnake:function (){
            if(this.collide()){
                gameend=true;
                return;
            }
            this.eatFood();
            var last = this.cells[this.length-1];
            console.log(last);
            var newlast = {x:last.x+(cs*this.dx), y:last.y+(cs*this.dy)};
            console.log(newlast);
            for(let i=0; i<this.length-1; ++i){
                console.log(this.cells[i]);
                this.cells[i] = this.cells[i+1];
            } 
            this.cells[this.length-1] = newlast; 
        },
        eatFood:function (){
            var last = this.cells[this.length-1];
            if(last.x+(this.dx*cs)==food.fx && last.y+(this.dy*cs)==food.fy){
                food.eaten=true;
                this.cells.push({x:food.fx,y:food.fy});
                this.length++;
            }
        },
        insideSnake:function (fx,fy){
            for(let i=0; i<this.length; ++i){
                if(this.cells[i].x==fx && this.cells[i].y==fy){
                    return true;
                }
            }
            return false;
        },
        die:function (){
            for(let i=0; i<this.length; ++i){
                pen.drawImage(snake_blood,this.cells[i].y,this.cells[i].x,1.1*cs,1.1*cs);
            }
        },
        collide:function (){
            
            //head with 4 wall
            var last = this.cells[this.length-1];
            console.log(last.x);
            console.log(last.y);
            //if(last.x!=-1) return false; 

            var secondlast = this.cells[this.length-2];
            if( last.y+(this.dy*cs)>=c.width ||
                last.y+(this.dy*cs)<0 ||
                last.x+(this.dx*cs)>=c.height ||
                last.x+(this.dx*cs)<0){
                return true;
            }

            //head with rest of body.
            var nx = last.x+(this.dx*cs);
            var ny = last.y+(this.dy*cs);

            for(let i=0; i<this.length-1; ++i){
                if(nx==this.cells[i].x && ny==this.cells[i].y){
                    return true;
                }
            }

            return false;
        }

    };
    snake.createSnake();

    food = {
        fx:0,
        fy:0,
        eaten:false,
        newfood:function (){
            this.fx = Math.floor(Math.random() * 11)*cs;
            this.fy = Math.floor(Math.random() * 13)*cs;
            while(snake.insideSnake(this.fx,this.fy))
            {
                this.fx = Math.floor(Math.random() * 11)*cs;
                this.fy = Math.floor(Math.random() * 13)*cs;
            }
            this.eaten = false; 
        },
        drawFood:function (){
            pen.drawImage(food_rat,this.fy,this.fx,cs,cs);
        },
        happy:function (){
            pen.drawImage(happy_rat,this.fy,this.fx,cs,cs);
        }
    };
    food.newfood();
    score = snake.length;

    go_on = true;
    resetall = false;
    gameend = false;

    document.getElementById("result").innerHTML = "WILL THE SNAKE WIN?";
}

function update() {
    //console.log(snake.cells);
    document.addEventListener('keydown', function(event){
        if(event.defaultPrevented){
            return;
        }
        switch(event.key){
            case "ArrowDown":
                if(snake.dx==-1 && snake.dy==0)
                    gameend = true;
                snake.dx=1; snake.dy=0;
                break;
            case "ArrowUp":
                if(snake.dx==1 && snake.dy==0)
                    gameend = true;
                snake.dx=-1; snake.dy=0;
                break;
            case "ArrowLeft":
                if(snake.dx==0 && snake.dy==1)
                    gameend = true;
                snake.dx=0; snake.dy=-1;
                break;
            case "ArrowRight":
                if(snake.dx==0 && snake.dy==-1)
                    gameend = true;
                snake.dx=0; snake.dy=1;
                break;
            //case "p":
            //    if(go_on==true) go_on=false;
            //    else go_on=true;
            //    break;
            case "r":
                resetall = true;
                break;
            //case "f":
            //    food.eaten=true;
            //    break;
            //case "x":
            //    gameend = true;
            //    break;
            default:
                return;
        }
        event.preventDefault();
    },true);

    if(resetall) return;
    if(gameend==true) return;
    if(go_on==true){
        snake.shiftSnake();
        if(gameend==true) return;
        if(food.eaten==true) food.newfood();
        score = snake.length;
    }
}

function draw() {
    pen.clearRect(0,0,c.width,c.height);
    pen.drawImage(img,0,0); //draw BG
    if(!gameend){
        snake.drawSnake(); //draw Snake
        food.drawFood(); //draw food
    }else{
        snake.die();
        food.happy();
        document.getElementById("result").innerHTML = "Not today! Mice Win Again!!";
        go_on = false;
    }
    document.getElementById("scoreval").innerHTML = score;
}

function gameloop(){
    if(resetall) init();
    update();
    draw();
}

init();
setInterval(gameloop,140); //make variable interval ?

