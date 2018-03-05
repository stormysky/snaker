console.log("happy")
var scores = document.getElementById("scores");

var canvas = document.getElementById("drawenv");
var context = canvas.getContext("2d");

var radius = 7;
var startX=radius;
var startY=radius;

var snakeColor = ["#FF3030","#EEC900","#6495ED"];
var snakeArray = [];

var candy = {};
var iscandy = false;

var Defaultdirection = 1;

var key=0;//按键值
var ActID = 0;//Act函数ID

function drawcircle(centerX, centerY, size, color, isclear = false) {

	if(isclear)
		context.clearRect(0,0,canvas.width,canvas.height);
	
	context.beginPath();
	context.strokeStyle = context.fillStyle = color;
	context.arc(centerX,centerY,size,0,2*Math.PI);
	context.fill();//和stroke任意一个即可
}

function clearArea(){
	context.clearRect(0,0,canvas.width,canvas.height);
}

//绘制蛇
function drawSnake(){
	clearArea();

	for (var i = 0; i < snakeArray.length; i++) {
		var s = snakeArray[i];
		drawcircle(s.x,s.y,radius,s.color);
	}

}

function snakeInit(){
	snakeArray = [];
	Defaultdirection = 1;
	var xt = startX;
	var yt = startY;
	for (var i = 0; i < 3; i++) {
		snakeArray[2-i] = {x:xt,y:yt,color:snakeColor[i]};
		xt = xt + radius*2;
	}
	drawSnake();
}

function circleDistance(x1,y1,x2,y2){
	return Math.sqrt(Math.pow((x1-x2),2) + Math.pow((y1-y2),2));
}

//碰撞
function isCracked(){
	var r = circleDistance(snakeArray[0].x,snakeArray[0].y,candy.x,candy.y);
	if(r < 2*radius)
		return true;
	else
		return false;
}
//结束
function isDead(){
	var x = snakeArray[0].x;
	var y = snakeArray[0].y;
	if(x < radius || x > canvas.width-radius || y > canvas.height-radius || y < radius ){
		return true;
	}

	for (var i = 1; i < snakeArray.length; i++) {
		var r = circleDistance(x,y,snakeArray[i].x,snakeArray[i].y);
		if(r < 2*radius){
			return true;
		}
	}

	return false;
}

//随机数
function createCandy(){
	if(!iscandy){
		var diameter = 2*radius;
		var width = canvas.width;
		var height = canvas.height;
		candy.x = Math.ceil(radius + Math.random()*(width-diameter));
		candy.y = Math.ceil(radius + Math.random()*(height-diameter));
		candy.color = snakeColor[Math.floor(Math.random()*snakeColor.length)];
		// console.log(candy.x ,candy.y);
		drawCandy();
		iscandy = true;
	}
}
function drawCandy(){
	drawcircle(candy.x,candy.y,radius,candy.color);
}

function directionJudge(obj,direction){
	var o = JSON.parse(JSON.stringify(obj));
	if(direction == 0){
		o.y = obj.y + 2*radius;//down
	}
	else if(direction == 1){
		o.x = obj.x + 2*radius;//right
	}
	else if(direction == 2){
		o.y = obj.y - 2*radius;//up
	}
	else if(direction == 3){
		o.x = obj.x - 2*radius;//left
	}
	return o;
}

function snakeMove(direction){

	var obj = directionJudge(snakeArray[0],direction);

	var lastColor;
	length = snakeArray.length;
	for (var i = 0; i < length-1; i++) {
		snakeArray[i].color = snakeArray[i+1].color;
	}
	if(isCracked()){
		scores.innerHTML = snakeArray.length - 3 + 1;
		lastColor = candy.color;
		iscandy = false;
	}
	else{
		lastColor = snakeArray[length-1].color; 
		snakeArray.pop();
	}
	snakeArray[snakeArray.length-1].color = lastColor;


	snakeArray.unshift(obj);

}

function dataInit(){
	startX = radius;
	startY = radius;
	snakeArray = [];
	candy = {};
	iscandy = false;
	Defaultdirection = 1;
	key = 0;//按键值
	ActID = 0;
}

//绘制初始状态
function init(){
	snakeInit();
	createCandy();
}

function Act(key){

	//结束
	if(isDead()){
		clearInterval(ActID);
		dataInit();

		reply = confirm("your snake is dead, continued game?");
		init();
		if(reply == true){
			ActID = setInterval(function(){Act(39)},500);
		}
		return;
	}

	//防止反方向
	if(key >= 37 && key <= 40){
		//left:37 up:38 right:39 down:40
		if(Math.abs(40 - key - Defaultdirection) != 2)
			Defaultdirection = 40-key;
	}
	// console.log(key);
	snakeMove(Defaultdirection);
	drawSnake(true);
	if(!iscandy){
		createCandy();
	}
	else{
		drawCandy();
	}
}

//addEventListener
window.addEventListener(
	"keydown",
	function(event){
		key = event.keyCode;
		if(key == 32){
			if(ActID == 0) ActID = setInterval(function(){Act(key)},500);
		}
	}
);

init();


