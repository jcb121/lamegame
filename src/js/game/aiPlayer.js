var startRand = require('../functions/startRand');
var collide = require('../functions/collisions').collide;
var move = require('../functions/movement').move;
var takeDamage = require('../functions/health').takeDamage;
var getDistance = require('../functions/math').getDistance;
var DeBounce = require('../functions/deBounce');
var SoundClip = require('../soundClip');
var Animation = require('./animation');
var HitBox = require('./hitbox');

var getBearing = require('../functions/math').getBearing;

class AiPlayer{
	constructor(props){

		this.debug = true;
		this.type  = "AiPlayer";

		for (let attr in props) {
			this[attr] = props[attr];
		}

		this.hitBox = new HitBox(props.animations);
		this.hitBox.parent = this;

		this.animation = new Animation(props);
		this.animation.parent = this;
		this.animation.onReady(function(ani){
			console.log('animation ready', this, ani);
		}.bind(this));

		var zombieDyingSound = new SoundClip(this.deathSound);
		zombieDyingSound.onload(function(sound){
			console.log('death sound ready', this, sound);
		}.bind(this));

		var zombieSpawnSound = new SoundClip(this.startSound);
		zombieSpawnSound.onload(function(sound){
			console.log('start sound ready', this, sound);
			sound.play();
		}.bind(this));

		this.startRand();
		this.attackDelay = new DeBounce(1);

	}

	update(modifier){


		this.travel = this.speed * modifier;

		this.tracking = this.parent.players;
		if( this.tracking.length == 0){
			if( this.turnDelay == undefined) this.turnDelay = new DeBounce(1);
			this.turnDelay.update( modifier );
			if( this.turnDelay.ready() ){
				this.bearing += Math.floor(Math.random() * 90);
				this.bearing -= 45;
			}
		}
		else if( this.tracking.length ==1 ){

			var changeX = this.x - this.tracking[0].x;
			var changeY = this.y - this.tracking[0].y;

			var bearing = getBearing( changeX, changeY);
			bearing += 180;
			if( bearing >= 360) bearing -= 360;

			this.bearing = bearing;



		}
		else{
			// compelling AI - go to the closest player...
			var following = 0;
			var shortest = -1;

			for( var i = 0; i < this.tracking.length; i++ ){

				var dist = getDistance( this.x, this.y, this.tracking[i].x , this.tracking[i].y );

				if(  shortest == -1 || dist < shortest  ){
					shortest = dist;
					following = i;
				};
			};


			var changeX = this.x - this.tracking[ following ].x;
			var changeY = this.y - this.tracking[ following ].y;

			var bearing = getBearing( changeX, changeY);
			bearing += 180;
			if( bearing >= 360) bearing -= 360;

			this.bearing = bearing;
		}

		this.state = "walking";
		this.attackDelay.update( modifier );
		this.move( this.travel, this.bearing );
		this.hitboxCords = this.hitBox.update();
		this.animation.update(modifier);

	}

	draw(canvas){
		if(typeof this.ready !== 'undefined' && this.ready !== true) return false;

		let ctx = canvas.getContext('2d');
		ctx.save();

		ctx.translate(this.x, this.y);
		ctx.rotate( this.bearing * Math.PI/180);
		this.animation.draw(ctx);
		this.hitBox.draw(ctx);

		ctx.restore();
	}
}

AiPlayer.prototype.startRand = startRand;
AiPlayer.prototype.collide = collide;
AiPlayer.prototype.move = move;
AiPlayer.prototype.takeDamage = takeDamage;
AiPlayer.prototype.getDistance = getDistance;


module.exports = AiPlayer;