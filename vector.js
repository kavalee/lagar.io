function Vector( x, y ) {
    this.x = x;
    this.y = y;
}

Vector.prototype= {
    add: function (v) {
	this.x += v.x;
	this.y += v.y;
	return this;
    },
    sub: function (v) {
	this.x -= v.x;
	this.y -= v.y;
	return this;
    },
    scl: function(scl){
	this.x *= scl;
	this.y *= scl;
	return this;
    },
  
    norm: function(){
	let len = Math.sqrt( this.x * this.x + this.y * this.y);
	if(len === 0){
	    this.x = 0;
	    this.y = 0;
	}
	else{
	    this.x /= len;
	    this.y /=len;
	}
    },
    constrain: function(lowx, lowy, highx, highy){
	if(this.x < lowx){
	    this.x = lowx;
	}
	if(this.x > highx){
	    this.x = highx;
	}
	if(this.y < lowy){
	    this.y = lowy;
	}
	if(this.y > highy){
	    this.y = highy;
	}
    },
    len: function(){
	return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    copy: function(){
	return new vec(this.x,this.y);
    }
}

module.exports = Vector;
