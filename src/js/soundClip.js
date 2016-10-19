var context;
var w = window;
var contextClass = (w.AudioContext || w.webkitAudioContext || w.mozAudioContext || w.oAudioContext || w.msAudioContext);
if (contextClass) {
	context = new contextClass();
} 
else {
	alert('upgrade your browser');
}
var DeBounce = require('./functions/debounce');

function SoundClip( props ){
	this.audioLoader( props.src );
	this.volume = props.volume;
	this.ready = false;
	
	this.gainNode = context.createGain();
	this.gainNode.connect( context.destination );
	this.gainNode.gain.value = this.volume;
	
	if( props.repeat ){
		this.loop = new DeBounce(64, true);
	}
	
}

SoundClip.prototype = {
	onload:function(callback){
		this.onloadCallback = callback;

		if(this.ready){
			callback(this);
		}

	},
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
		}
	},
	audioLoader:function( file ){
	
		if( file == undefined) return false;
		
		var url = window.location.href + file;
			
		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';
		
		var self = this;
			
		request.onload = function(e) {

			context.decodeAudioData( this.response, function(theBuffer) { 		
				self.sound = theBuffer;
				self.ready = true;
				if(typeof self.onloadCallback === 'function'){
					self.onloadCallback(self);
				}

			}, function(e){
				console.log(e);
			});
		};
		request.send();
	}
};

module.exports = SoundClip;