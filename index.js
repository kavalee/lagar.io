const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
app.use(express.static('public'));
const vec = require('./vector');
app.get('/', (req, res) => {
    console.log(`${req.connection.remoteAddress} connected`);
    res.sendFile(__dirname + "/index.html");
});
//fix socket id security lol
let players = [];
let food = [];
const worldSize = 1000;
const maxFood = 30;
const baseSize = 10;
let GFID = 1;
for(let i = 0; i < maxFood; i++){
    food.push(new Food());
}

setInterval(update, 1/60);
io.on('connection' , (socket) => {
    console.log(`${socket.id} socket connection established`);
    socket.on('fc-name', (msg) => {
	if(!(players.find( (p) => socket.id === p.id))){ 
	    players.push( { id:socket.id ,
			    name:msg ,
			    pos:new vec(Math.random() * worldSize, Math.random() * worldSize), vel:new vec(1,1),
			    color: '#'+(Math.random()*0xFFFFFF<<0).toString(16),
			    size: baseSize,
			    dead: false
			  });
	    console.log(`player added ${findPlayerById(socket.id).name}`);
	}
    });
    socket.on('disconnect', () => {
	players = players.filter( (p) => socket.id !== p.id );
	console.log("player disconnected");
    });
    socket.on('mouse', (pos) => {
	let player = findPlayerById(socket.id);
	let v = new vec(pos.x,pos.y);
	v.norm();
	const baseSpeed = 2;
	v.scl(baseSpeed/player.size);
	player.vel = v ;
    });
});

const port = 3000;
server.listen( port , () => console.log(`Listening on port ${port}`));

function findPlayerById(id){
    return players.find( (p) => id === p.id);
}
function Food(){
    this.color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
    this.pos = new vec(Math.random() * worldSize,Math.random() * worldSize);
    this.eaten = false;
}
function update(){
    players.forEach( (p) => {
	p.pos.add(p.vel);
	p.pos.constrain(0,0,worldSize,worldSize);
	food.forEach( (f) => {
	    let tpPos = new vec(p.pos.x,p.pos.y);
	    let tfPos = new vec(f.pos.x,f.pos.y);
	    let dPos = tpPos.sub(tfPos);
	    if(dPos.len() < p.size){
		p.size += 1;
		f.eaten = true;
	    }
	});
	
    });
    players.forEach( (p) => {
	players.forEach( (e) => {
	    let tePos = new vec(e.pos.x,e.pos.y);
	    let tpPos = new vec(p.pos.x,p.pos.y);
	    let dPos = tePos.sub(tpPos);
	    let largerP = (p.size >= e.size)? p : e;
	    let smallerP = (p.size <= e.size)? p : e;
	    if(dPos.len() < largerP.size && largerP.size != smallerP.size && smallerP.size != baseSize){
		largerP.size += smallerP.size;
		smallerP.size = baseSize;
		smallerP.dead = true;
	    }
	});
    });
    food = food.filter( f => !f.eaten );
    for(let i = food.length ; i < maxFood; i++){
	food.push(new Food());
    }
    io.sockets.emit('fs-update', {players:players, food:food});
    
}
