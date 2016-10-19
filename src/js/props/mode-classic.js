var WorldProp = require('../worldProp');
var WorldArea = require('../game/worldArea');
var Camera = require('../game/camera');
var ZombieSpawner = require('../game/zombieSpawner');

var mapConf = require('./road');
var shotgunWorldProps = require('./props/shotgun');
var pistolWorldProps = require('./props/pistol');
var machineGunWorldProps = require('./props/machineGun');
var Mouse = require('../mouse');
var checkReady = require('../functions/checkReady');
var SoundClip = require('../soundClip');
var LoadScreen = require('../loadingScreen/loadScreen');

var Player = require('../game/player');
var heroProps = require('../props/player/player-config');

var getCollisions = require('../functions/getCollisions');


class Classic{
	constructor(canvas){
		this.type = '';
		this.children = [];
		this.players = [];
		this.debug = false;
		this.ready = false;

		//this.camera = new Camera(canvas);
		this.mouse = new Mouse(canvas);


		this.loadingScreen = new LoadScreen();

		this.children = [];

		//this.children.push(this.camera);
		this.children.push(this.mouse);
		//this.children.push(new WorldProp(mapConf));


		//mapConf.walls.forEach(function(wall){
		//	this.children.push(new WorldArea(wall));
		//}.bind(this));
		//this.children.push(new SoundClip({volume:0.5, src: 'sounds/Musical_beat_and_loop_full_band_hard_rock_groove_BLASTWAVEFX_20928.mp3', repeat:true }));
		//this.children.push(new WorldProp( shotgunWorldProps));
		//this.children.push(new WorldProp( shotgunWorldProps));
		//this.children.push(new WorldProp( pistolWorldProps));
		//this.children.push(new WorldProp( machineGunWorldProps));

		//this.children.push(new ZombieSpawner());




		this.children.forEach(function(child){
			child.parent = this;
		}.bind(this))


	}

	addObject(object){
		this.children.push(object);
	}

	update(modifier){
		if( this.ready ){

			// START OF GAME PADS CODE
			var pads = navigator.getGamepads();
			var count = [];
			for( let i = 0; i < pads.length; i++){
				if( pads[i] != undefined ){
					count.push( pads[i] );
				}
			}

			//more cons then people....
			if( this.players.length < count.length ){

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
			// END OF GAME PADS CODE


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

			(getCollisions( this.children, modifier));
		}
		else{
			this.loadingScreen.update( modifier );
			this.checkReady();	//updates children also.
		}
	}

	draw(canvas){

		if( this.ready ){
			//this.camera.draw(canvas);
			this.children.forEach(function(child){
				child.draw(canvas);
			});

			/*if( this.camera.split ){
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
			}*/
		}
		else{
			this.loadingScreen.draw(canvas);
		}
	}
}

Classic.prototype.checkReady = checkReady;


module.exports = Classic;