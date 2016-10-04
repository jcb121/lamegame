var AiPlayer = require(aiPlayer.js);

var zombieProps = {
	solid:true,
	spriteTorseSrc:"images/zomb.png",
	frameX:128,
	frameY:128,
	speed:50,
	height:64,
	width:64,
	health:128,
	damage:10,
	startSound:zombieSpawnSound,
	deathSound:zombieDyingSound,
	animations:zombieAnimations,
	collisions:{
		bullet:function(bullet){
			bulletHitBodySound.play();
			bullet.live = false;
			this.parent.takeDamage( 20 );
		},
		player:function( player ){
			if( this.parent.attackDelay.ready() ){
				
				zombieBiteSound.play();
				player.takeDamage( this.parent.damage );
			}
		},
		AiPlayer:dynamicCollide,
	},
};

function ZombieSpawner(){
	this.ready = true;
};

ZombieSpawner.prototype = {
	update:function(modifier){
		
		if( this.zombieDelay == undefined){
			this.incriment = 1;
			this.zombieDelay = new deBounce(10);
		};	
		
		this.zombieDelay.update(modifier);	
		if( this.zombieDelay.ready() ){
			for( var i = 0; i < this.incriment; i++){
				
				if( this.parent.children.length >40){	
					console.log("limit");
					continue;	
				} ;
								
				var zomb = new AiPlayer( zombieProps )
				
				zomb.parent = this.parent;
								
				this.parent.children.push( zomb );
				
			};
			this.incriment++;
		};
		
		
		if( this.weaponSpawnDelay == undefined){
			this.weaponSpawnDelay = new deBounce(50);
		};
		this.weaponSpawnDelay.update(modifier);
		if( this.weaponSpawnDelay.ready() ){
			
			var worldShotgun = new worldProp( shotgunWorldProps );
			var worldPistol = new worldProp( pistolWorldProps );
			var worldMachineGun = new worldProp( machineGunWorldProps );
			
			this.parent.children.push( worldShotgun );
			this.parent.children.push( worldPistol );
			this.parent.children.push( worldMachineGun );
			
		};
	},
	draw:function(){},
	
};
