var checkReady = require('./functions/checkReady');
var LoadScreen = require('./loadingScreen/loadScreen');

class WorldMaster{
	
	constructor(props){
		this.modes = {
			mainMenu: require('./props/mode-mainMenu'),
			classic: require('./props/mode-classic')
		};
		this.children = {};
		this.canvas = props.canvas;
		
		this.children[props.mode] = new this.modes[props.mode](this.canvas);
		this.children[props.mode].parent = this;
		this.mode = props.mode;
		
		this.ready = false;
		this.loadingScreen = new LoadScreen();
	}
	setMode(mode){
		if(typeof this.children[mode] === 'undefined'){
			this.children[mode] = new this.modes[mode](this.canvas);
		}
		this.mode = mode;
	}
	update( modifier ){ //does nothing really!
				
		if( this.ready){
			this.children[ this.mode ].update( modifier );
		}
		else{
			this.loadingScreen.update( modifier );
			this.checkReady( modifier ); //updates the children also
		}
		
		
	}
	draw(canvas){
		
		var ctx = canvas.getContext('2d');
		
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.save();
		
		if( this.ready ){
			this.children[ this.mode ].draw(canvas);
		} 
		else{
			this.loadingScreen.draw(canvas);
		}	
		
		ctx.restore();
	}	
}
WorldMaster.prototype.checkReady = checkReady; 
module.exports = WorldMaster;



