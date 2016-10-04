function AssetLoader( assets ){
	
	this.loading = [];
	var self = this;
	this.limit = assets.length + 0;
	this.count = 0;
	this.ready = false;
	
	for( var i = 0; i < assets.length; i++ ){
		
		this.loading[i] = new Image();
		this.loading[i].src = assets[i];
		this.loading[i].onload = function(){
			self.count++;
		};
		
	};
	
}

AssetLoader.prototype = {
	update:function( modifier ){
		if( this.ready ){
			
		}
		else{

			if( this.count == this.limit ){
				this.ready = true;
			};
			
		};		
	},
	draw:function(){
		
	},
};