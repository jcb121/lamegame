	var context;
	var contextClass = (window.AudioContext || 	  window.webkitAudioContext || 	  window.mozAudioContext || 	  window.oAudioContext || 	  window.msAudioContext);
	if (contextClass) {
		context = new contextClass();
	} 
	else {
		alert( "upgrade your browser" );
	}
	
	var audioLoader = function( file ){
		
		if( file == undefined) return false;
		
		var url = window.location.href + file;
		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';
		
		var me = this; //SUPER HACK
			
		request.onload = function() {
			context.decodeAudioData( this.response, function(theBuffer) { 		
				me.sound = theBuffer;	
				me.ready = true;
				
			}, onError);
					
			var onError = function(){
				me.ready = false;
			};
		} ;	
		request.send();			
	};
	
	function SoundClip( props ){
		this.src = props.src;
		this.audioLoader( this.src );
		this.volume = props.volume;
		
		this.gainNode = context.createGain();
		this.gainNode.connect( context.destination );
		this.gainNode.gain.value = this.volume;
	}
	SoundClip.prototype = {
		play:function(){	
			
			if( this.ready == true){
					
					var source = context.createBufferSource();
					source.buffer = this.sound;
					source.connect(	this.gainNode	);
					source.start(0);
				
			};	
		},
		audioLoader,
	};
	
	//loads all audio.
	var bulletHitBodySound = new SoundClip( { volume:0.4, src:"sounds/Bullet-Hit-Body-Flesh 06.mp3" } );
	var shotGunSound = new SoundClip( { volume:1, src:"sounds/12_gauge_SPAS-12_shotgun_single_shot_close_perspective_05_SFXBible_ss06854.mp3" } );
	var pistolSound = new SoundClip( { volume:1, src:"sounds/9MM_Luger_p08_semi_automatic_single_shot_pistol_BLASTWAVEFX_09388.mp3" } );
	var machineGunSound = new SoundClip( { volume:1, src:"sounds/M60_machine_gun_single_shot_close_perspective_01_SFXBible_ss06806.mp3" } );
	var zombieBiteSound = new SoundClip( { volume:0.75, src:"sounds/Goosh_Bite_Demonic_Fienup_001.mp3" } );
	var zombieDyingSound = new SoundClip( { volume:0.1, src:"sounds/Breath_long_BLASTWAVEFX_17722.mp3" } );
	var zombieSpawnSound = new SoundClip( { volume:0.1, src:"sounds/Zombie_Growl_Single_Fienup_004.mp3" } );
	var shotgunCockSound = new SoundClip( { volume:0.5, src:"sounds/Shotgun_cock_movement_BLASTWAVEFX_09296.mp3" } );
	var pistolCockSound = new SoundClip( { volume:0.5, src:"sounds/Gun_cock_04_SFXBible_ss06662.mp3" } );
	var backgroundSound = new SoundClip( { volume:0.5, src:"sounds/Musical_beat_and_loop_full_band_hard_rock_groove_BLASTWAVEFX_20928.mp3" } );
	
	
	
	// Create the canvas
	var vCanvas = document.createElement("canvas");
	var vCtx = vCanvas.getContext("2d");
	vCanvas.width = 1000;
	vCanvas.height = 700;

	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");
	canvas.width = 1000;
	canvas.height = 700;
	
	document.getElementById("lameGame").appendChild(canvas);
	
	// Handle keyboard controls
	var keysDown = {};
	var mouse = { down:false,}; 
	addEventListener("keydown", function (e) {
		keysDown[e.keyCode] = true;
	}, false);
	addEventListener("keyup", function (e) {
		delete keysDown[e.keyCode];
	}, false);
	 addEventListener("gamepadconnected", function(e) { 
		//gamepadHandler(e, true); 
		console.log("blip");
	}, false);
	addEventListener("gamepaddisconnected", function(e) { 		
		//gamepadHandler(e, false); 
		console.log("blip");
	}, false); 
	addEventListener("mousedown", function(e) { 	
		mouse.down = e;
	}, false); 
	addEventListener("mouseup", function(e) { 
		mouse.down = false;	
	}, false); 
	addEventListener("mousemove", function(e) { 	
		var rect = canvas.getBoundingClientRect();
		mouse.x =  e.clientX - rect.left;
		mouse.y = e.clientY - rect.top; 
	}, false); 