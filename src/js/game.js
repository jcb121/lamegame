var w = window;
var then;

var requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
// Create the canvas
var vCanvas = document.createElement('canvas');
var canvas = document.createElement('canvas');
document.getElementById('lameGame').appendChild(canvas);
var width = document.getElementById('lameGame').offsetWidth;
var height =  window.innerHeight;
canvas.width = width;
canvas.height = height;
vCanvas.width = width;
vCanvas.height = height;

/* var SoundClip = require('./soundClip');
var bulletHitBodySound = new SoundClip( { volume:0.4, src: 'sounds/Bullet-Hit-Body-Flesh 06.mp3' } );
var zombieBiteSound = new SoundClip( { volume:0.75, src: 'sounds/Goosh_Bite_Demonic_Fienup_001.mp3' } );
 */
	
var worldMasterProps = {
	debugging:true,
	mode:'mainMenu',
	canvas
};
var WorldMaster = require('./worldMaster');
var world = new WorldMaster( worldMasterProps );

then = Date.now();
main();
	
function main() {
	var now = Date.now();
	var delta = now - then;
	world.update(delta / 1000);
	world.draw(canvas);
	then = now;
	requestAnimationFrame(main);
}