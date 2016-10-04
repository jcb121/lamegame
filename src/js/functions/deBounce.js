module.exports = function( time, initialDelay ){
	
	this.state = initialDelay;
	if( initialDelay == undefined) this.state = false;
	
	this.delay = time;
	this.currentTime = 0;
	
	this.update = function( time ){
		
		this.currentTime += time;
		if( this.currentTime > this.delay || this.state == true ){	
			this.state = true;
		}else{	
			this.state = false;
		}
	};
	
	this.ready = function(){
		
		if( this.state ){   //
			
			this.state = undefined;
			this.currentTime = 0;
			return true;
			
		}else{
			return this.state; //it return false.
		}
	};		
};