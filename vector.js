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
    },
    scl: function(s){
	this.x *= scl;
	this.y *= scl;
    },
    comp: function(){
	return({x:this.x,y:this.y});
    }
}

module.exports = Vector;
