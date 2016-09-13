	
	
	function SoundClip( props ){
		this.audioLoader( props.src );
		this.volume = props.volume;
		
		this.ready = false;
		
		this.gainNode = context.createGain();
		this.gainNode.connect( context.destination );
		this.gainNode.gain.value = this.volume;
		
		if( props.repeat ){
			this.loop = new deBounce(64, true);
		};
		
	}

	SoundClip.prototype = {
		update:function( modifier ){
			
			if( this.ready ){
				this.loop.update( modifier );
				if( this.loop.ready() ){
					this.play();
				}	
			}
		},
		draw:function(){
			//no need to draw.
		},
		play:function(){	
			
			if( this.ready){				
				var source = context.createBufferSource();
				source.buffer = this.sound;
				source.connect(	this.gainNode	);
				source.start(0);		
			};	
		},
		audioLoader:function( file ){
		
			if( file == undefined) return false;
			
			var url = window.location.href + file;
			url = url.replace("?fullScreen=yes", "");
				
			var request = new XMLHttpRequest();
			request.open('GET', url, true);
			request.responseType = 'arraybuffer';
			
			var self = this;
				
			request.onload = function() {
				context.decodeAudioData( this.response, function(theBuffer) { 		
					self.sound = theBuffer;	
					self.ready = true;
				}, onError);
						
				var onError = function( e ){
					console.log(e);
				};
			} ;	
			request.send();			
		}
	};
	
	//BAD!
	var bulletHitBodySound = new SoundClip( { volume:0.4, src: "sounds/Bullet-Hit-Body-Flesh 06.mp3" } );
	var zombieBiteSound = new SoundClip( { volume:0.75, src: "sounds/Goosh_Bite_Demonic_Fienup_001.mp3" } );
	var zombieDyingSound = new SoundClip( { volume:0.1, src: "sounds/Breath_long_BLASTWAVEFX_17722.mp3" } );
	var zombieSpawnSound = new SoundClip( { volume:0.1, src: "sounds/Zombie_Growl_Single_Fienup_004.mp3" } );

	