var AiPlayer = require('./aiPlayer.js');
var WorldProp = require('../worldProp');
var zombieProps = require('./aiPlayer/ai-config.json');
var DeBounce = require('../functions/deBounce');


class ZombieSpawner{
	constructor(){
		this.ready = true;
	}
	update(modifier){
		if( this.zombieDelay == undefined){
			this.incriment = 1;
			this.zombieDelay = new DeBounce(10);
		};

		this.zombieDelay.update(modifier);
		if( this.zombieDelay.ready() ){
			for( var i = 0; i < this.incriment; i++){

				if( this.parent.children.length >40){
					console.log("limit");
					continue;
				}

				var zombie = new AiPlayer( zombieProps );
				zombie.parent = this.parent;
				this.parent.children.push( zombie );

			};
			this.incriment++;
		};


		if( this.weaponSpawnDelay == undefined){
			this.weaponSpawnDelay = new DeBounce(50);
		}
		this.weaponSpawnDelay.update(modifier);
		if( this.weaponSpawnDelay.ready() ){

			var worldShotgun = new WorldProp( shotgunWorldProps );
			var worldPistol = new WorldProp( pistolWorldProps );
			var worldMachineGun = new WorldProp( machineGunWorldProps );

			this.parent.children.push( worldShotgun );
			this.parent.children.push( worldPistol );
			this.parent.children.push( worldMachineGun );

		}
	}
	draw(){}
}


module.exports = ZombieSpawner;