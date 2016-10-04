module.exports = function(){	
	
	if( this.x == undefined){
		this.x = (Math.random() * (	2000 - this.width/2));
	}
	if( this.y == undefined){
		this.y = (Math.random() * (	1000 - this.height/2));	
	}
	
	if( this.bearing == undefined){
		this.bearing = Math.random() * 360;
	}else if( typeof this.bearing === 'object'){
		
		if( this.bearing[0] == undefined ){
			
			this.bearing[0] = Math.random() * 360;
			this.bearing[1] = this.bearing[0];
		}	
	}
}; 