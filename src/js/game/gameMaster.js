var checkReady = require('../functions/checkReady');
var SoundClip = require('../soundClip');
var LoadScreen = require('../loadingScreen/loadScreen');

var Player = require('./player');
var heroProps = require('./player/player-config');

var getCollisions = require('../functions/getCollisions');


function gameMaster( props ){
	
	this.ready = false;
	
	this.children = [];
	this.players = [];
	this.debugging = false;
	
	for (var attrname in props) { 
		this[attrname] = props[attrname]; 
	}
		
	for( var i = 0; i < this.children.length; i++ ){
		this.children[i].parent = this;
	}
	
	this.children.push( new SoundClip( { volume:0.5, src: 'sounds/Musical_beat_and_loop_full_band_hard_rock_groove_BLASTWAVEFX_20928.mp3', repeat:true } ) );
	
	this.camera.parent = this;
	this.loadingScreen = new LoadScreen();	
	
}

gameMaster.prototype = {
	
	checkReady,
	addObject:function(object){
		this.children.push(object);
	},
	update: function(modifier){		
		
		if( this.ready ){
			
			// Game PADS CODE	
			var pads = navigator.getGamepads();
			var count = [];
			for( let i = 0; i < pads.length; i++){	
				if( pads[i] != undefined ){
					count.push( pads[i] );
				}
			}
		
			if( this.players.length < count.length ){ //more cons then people....
				
				var takenCons = [];
				
				for( let i = 0; i < this.players.length; i++){
					takenCons.push( this.players[i].controllerIndex  );
				}
				
				//loop through VALID controllers...
				for( let i = 0; i < count.length; i++ ){
									
					if( takenCons.indexOf( count[i].index) == -1 ){
												
						if( count[i].buttons[0].pressed ){

							var hero = new Player(heroProps);
							hero.controllerIndex = count[i].index;
							this.children.push( hero );
							this.players.push( hero );
							hero.parent = this;
		
						}
					}
				}
			}		
				
			this.camera.update();
			
			//update the children....
			for(var i = 0; i < this.children.length; i++) {	
				
				if( this.children[i].live == false){				
					
					
					if(this.children[i].type == 'player'){
					
						var temp = this.players.indexOf( this.children[i] );
						this.players.splice( temp, 1 );
						
					}

					this.children.splice(i,1);
					
					continue;
				}
				this.children[i].update(modifier);	
			}
			
			getCollisions( this.children, modifier);
			
		}
		else{
			this.loadingScreen.update( modifier );
			this.checkReady();	//updates children also.		
		}
	
	},
	draw:function(canvas){
		if( this.ready ){

			if( this.camera.split ){
						
				for(var i = 0; i < this.camera.x.length; i++){
					
					this.camera.draw(canvas, i); //gives the camera who to draw for
					
					for (var j = 0; j < this.children.length; j++) {
						this.children[j].draw(canvas);
					}
					
					this.camera.end(i);
				}
				
			}
			else{ //draws avg cam!
				
				this.camera.draw(canvas);
				
				for (let i = 0; i < this.children.length; i++) {
					this.children[i].draw(canvas);
				}
			}
					
		} 
		else{
			this.loadingScreen.draw(canvas);
		}	
	},	
};

module.exports = gameMaster;