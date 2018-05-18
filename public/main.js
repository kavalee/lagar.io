
let players = [];


$(document).ready( function (){
    console.log("started");
    var socket = io.connect();
    socket.on('connect', () => {
	console.log('connected');
    });
    $("#submit-username").click( function(){
	let username = $('#username').val();
	socket.emit('fc-name', username);
    });
    socket.on('fs-update', (msg) => {
	players = msg;
	//console.log(players);
    });

});
let canvas = document.getElementById("game-canvas");
let ctx = canvas.getContext("2d");
setInterval( render, 30);

function render(){
    console.log(players);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    
    players.forEach( (p) => {
	ctx.fillStyle = p.color;
	ctx.beginPath();
	ctx.arc( p.pos.x , p.pos.y , 100, 0 , 2 * Math.PI);
	ctx.fill();
    });
    
    
    ctx.fillStyle = "#00FF00"
    ctx.font = "10px Times New Roman";
    ctx.beginPath();
    players.forEach( (p) => {
	ctx.strokeText(p.name, p.pos.x, p.pos.y);
    });
    ctx.fill();
};
