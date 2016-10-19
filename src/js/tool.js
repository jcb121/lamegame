var Bullet = require('./game/bullet');
var SoundClip = require('./SoundClip');
var deBounce = require('./functions/deBounce');

class Tool{
	constructor(props){
		this.type = 'tool';
		this.bulletSize = 3; //Defaults
		this.bulletsPerFire = 1; //Defaults
		this.bulletSpread = 0; //Defaults

		for (var attrName in props) {
			this[attrName] = props[attrName];
		}

		this.image = new Image();
		this.image.src = props.gunHeldSrc;
		this.image.onload = function(){
			this.imageReady = true;
		}.bind(this);

		console.log(this);

		this.startSound = new SoundClip( this.startSound );
		this.fireSound = new SoundClip( this.fireSound );

		this.weaponDelay = new deBounce( 1 / this.useRate );
		this.reloadDelay = new deBounce( this.reloadTime );


		this.clipAmmo = this.clip;

		//this.ammo -= this.clip; // be nice
	}

	update(modifier){
		if( this.ready ){
			this.weaponDelay.update( modifier );

			if( this.reloadDelay.state == false){
				this.reloadDelay.update( modifier );
			}
		}
		else{
			this.checkAssetsLoaded();
		}
	}

	draw(canvas){
		if( this.ready ){
			var ctx = canvas.getContext('2d');
			ctx.drawImage(this.image, this.xOffset, this.yOffset, this.width, this.height );

			var percentageAmmo;

			if( this.ammo > 100){
				percentageAmmo = 2;
			}
			else if( this.ammo <= 0){
				percentageAmmo = 0;
			}
			else{
				percentageAmmo = (this.ammo / 100) *2;
			}

			ctx.rotate( -90*Math.PI/180);

			ctx.strokeStyle = '#DF0101'; //red
			ctx.lineWidth = 2;

			ctx.beginPath();
			ctx.arc(0,0,52,0, percentageAmmo * Math.PI);
			ctx.stroke();

			var percentageClip = (this.clipAmmo / this.clip) *2;


			//Something wrong with clipAmmo and Ammo management.
			//console.log( this.clipAmmo /*  99 */, this.clip /* 100 */, this.ammo /* 0 */, percentageClip /* 1.98 */ );

			ctx.strokeStyle = '#0101DF'; //Blue
			ctx.lineWidth = 2;

			ctx.beginPath();
			ctx.arc(0,0,50,0, percentageClip * Math.PI);
			ctx.stroke();


			if( this.reloadDelay.state == false){

				var percentage = ( this.reloadDelay.currentTime /  this.reloadDelay.delay) * 2;

				ctx.strokeStyle = '#0101DF'; //yellow
				ctx.lineWidth = 2;

				ctx.beginPath();
				ctx.arc(0,0,50,0, percentage * Math.PI);
				ctx.stroke();

			}

			ctx.rotate( 90*Math.PI/180);
		}
	}

	fire(){
		if( this.ready ){

			if(  this.weaponDelay.ready() ){ //ready to shoot

				if( this.clipAmmo <= 0 ){ //needs a reload!


					if( this.reloadDelay.state == undefined){
						//play reload
						this.reloadDelay.state = false;
					}


					if( this.reloadDelay.ready() ){

						this.clipAmmo = this.clip;
						this.ammo -= this.clip;

						this.shoot();
						this.fireSound.play();

					}
				}
				else if( this.ammo <= 0){ //needs ammo!
					//play click?
				}
				else{
					this.shoot();
					this.fireSound.play();
				}
			}
		}
	}

	shoot(){
		// this. x & this .y... No hit box only needed for bullet fire.
		this.x = this.parent.x;
		this.y = this.parent.y;
		this.bearing = this.parent.bearing['1']; // torso layer
		var a = this.bulletOffsetX * this.parent.scale;
		var b = this.bulletOffsetY * this.parent.scale * -1; //this is negative.
		var toolDistance = Math.sqrt(a*a + b*b);
		var toolAngle = Math.atan( b / a ) * 180 / Math.PI;
		var worldToToolAngle = this.bearing + 90 - toolAngle; //fine.
		worldToToolAngle -= 90;
		worldToToolAngle *= -1;
		var sin = Math.sin( worldToToolAngle * Math.PI / 180  ); //0.874
		var cos = Math.cos( worldToToolAngle * Math.PI / 180  ); //0.485
		var x = cos * toolDistance;
		var y = sin * toolDistance;
		this.x += x;
		this.y -= y;

		var gap = this.bulletSpread / ( this.bulletsPerFire +1 ); // =1
		var incriment= 0;
		var orignalDirection = this.bearing;

		this.clipAmmo--;

		for (var i = 0; i < this.bulletsPerFire ; i++) {
			incriment += gap;
			this.bearing += incriment;
			this.bearing -= this.bulletSpread;
			this.bearing += this.bulletSpread / 2;

			var rand = Math.floor((Math.random() * this.accuracy) + 1);
			this.bearing += rand - this.accuracy/2;

			var bullet = new Bullet(this);
			this.bearing = orignalDirection;

			this.parent.parent.addObject(bullet);
		}
	}

	checkAssetsLoaded(){
		if( this.startSound.ready && this.fireSound.ready && this.imageReady ){
			this.ready = true;
		}
	}
}

module.exports = Tool;