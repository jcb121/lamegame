function takeDamage( amount, toughness ){	
	if( toughness != undefined ){	
		this.health -= amount * toughness;		
	}else{
		if( this.toughness != undefined ){		
			this.health -= amount * this.toughness;
		}else{			
			this.health -= amount;	
		}
	}
	
	if( this.health < 0){		
		this.live = false;
		if( this.deathSound != undefined) this.deathSound.play() ;
	}
}
module.exports = {
	takeDamage
};