class Animation{
	constructor(props){

		for (let attr in props) {
			this[attr] = props[attr];
		}

		this.currentFrames = {};
		this.layerFrameTime = 0;
		this.layerCurrentFrame =0;

		this.image = new Image();
		this.image.src = props.spriteTorseSrc;
		this.image.onload = function(){
			if(typeof this.onReadyCallback !== 'function') return;
			this.ready = true;
			this.onReadyCallback(this);
		}.bind(this)();

	}
	draw(ctx){
		ctx.drawImage(this.image,
			this.frameX * (this.currentFrames.y - 1),
			this.frameY * (this.currentFrames.x - 1),
			this.frameX, //frameSize
			this.frameY,  //frameSize
			0 -this.width/2, //x
			0 -this.height/2, //y
			this.width ,  //output size
			this.height  //output size
		);
	}
	onReady(callback){
		this.onReadyCallback = callback;

		if(this.ready === true){
			this.onReadyCallback(this);
		}

	}
	update(modifier){
		this.chooseFrame(modifier);
	}
	chooseFrame(modifier){

		modifier *=1000;

		var animation = this.animations[this.parent.state]; //walking normally!

		this.layerEachFrameTime = animation["layerTime"];
		if (this.layerFrameTime > this.layerEachFrameTime ){

			this.layerFrameTime = 0;

			if(this.layerCurrentFrame > animation["layer"].length -2){

				this.layerCurrentFrame = 0;
				this.currentFrames.x = animation["layer"][ this.layerCurrentFrame ][1];
				this.currentFrames.y = animation["layer"][ this.layerCurrentFrame ][0];

			}
			else{

				this.layerCurrentFrame++;

				this.currentFrames.x = animation["layer"][ this.layerCurrentFrame ][1];
				this.currentFrames.y = animation["layer"][ this.layerCurrentFrame ][0];

			}
		}
		else{
			this.layerFrameTime += modifier;
		}
	}
}
module.exports = Animation;