module.exports = function( modifier ){
	
	var checks = 0;
	for( var i = 0; i < this.children.length; i++){
	
		if( !this.children[i].ready ){			
		
			this.children[i].update( modifier );
			checks++;
		}
	}	
	if( checks == 0 ){
		this.ready = true;
	}
	else{
		this.ready = false;
	}
};