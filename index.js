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

function update(){
    players.forEach( (p) => p.pos.add(p.vel) );
    io.sockets.emit('fs-update', players);
}
setInterval( update ,100 );

io.on('connection' , (socket) => {
    console.log(`${socket.id} socket connection established`);
    socket.on('fc-name', (msg) => {
	if(!(players.find( (p) => socket.id === p.id))){ 
	    players.push( { id:socket.id ,
			    name:msg ,
			    pos:new vec(0,0), vel:new vec(0.1,1),
			    color: '#'+(Math.random()*0xFFFFFF<<0).toString(16)
			  });
	    console.log(`player added ${findPlayerById(socket.id).name}`);
	}
    });
    socket.on('disconnect', () => {
	players = players.filter( (p) => socket.id !== p.id );
	console.log("player disconnected");
    });
});

const port = 3000;
server.listen( port , () => console.log(`Listening on port ${port}`));

function findPlayerById(id){
    return players.find( (p) => id === p.id);
}
