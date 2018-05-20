
let players = [];
let food = [];
console.log("started");
var socket = io.connect();
socket.on('connect', () => {
    console.log('connected');
});
$("#submit-username").click( function(){
    let username = $('#username').val();
    socket.emit('fc-name', username);
});
$("#game-canvas").mousemove( function( e){
    if(findPlayerById(socket.id)){
	let cpos = $(this).position();
	let px = e.clientX - cpos.left;
	let py = e.clientY - cpos.top;
	let wx = px - canvas.width/2;
	let wy = py - canvas.height/2;
	//console.log(wx + " " +wy);
	socket.emit("mouse", { x: wx, y : wy});
    }
});
socket.on('fs-update', (msg) => {
    players = msg.players;
    food = msg.food;
    //console.log(players);
});


let canvas = document.getElementById("game-canvas");
let ctx = canvas.getContext("2d");
setInterval( render, 30);
function findPlayerById(id){
    return players.find( (p) => id === p.id );
}
function render(){
    ctx.fillStyle = "#FFFF6F";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    if(findPlayerById(socket.id)){
	player = findPlayerById(socket.id);
	
	ctx.save();
	ctx.translate(-player.pos.x,-player.pos.y);
	ctx.translate(canvas.width/2,canvas.height/2);
	const worldSize = 1000;
	for(let y = 0; y < worldSize + 1; y+=50){
	    ctx.beginPath();
	    ctx.moveTo(0,y);
	    ctx.lineTo(worldSize,y);
	    ctx.stroke();
	    ctx.beginPath();
	    ctx.moveTo(y,0);
	    ctx.lineTo(y,worldSize);
	    ctx.stroke();
	}
	food.forEach( (f) => {
	    ctx.fillStyle = f.color;
	    ctx.beginPath();
	    ctx.arc(f.pos.x, f.pos.y , 3 , 0, Math.PI * 2);
	    ctx.fill();
	});
	players.forEach( (p) => {
	    ctx.fillStyle = p.color;
	    ctx.beginPath();
	    ctx.arc( p.pos.x , p.pos.y , p.size, 0 , 2 * Math.PI);
	    ctx.fill();
	});
	
	
	ctx.fillStyle = "#00FF00"
	ctx.font = "20px Times New Roman";
	ctx.textAlign = "center";
	ctx.beginPath();
	players.forEach( (p) => {
	    ctx.strokeText(p.name, p.pos.x, p.pos.y);
	});
	ctx.fill();
	ctx.restore();
    }
    else{
	ctx.font = "30px Times New Roman";
	ctx.strokeText("Submit A Username to Play!",0,canvas.height);
    }
};
