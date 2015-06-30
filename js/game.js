function worldMaster ( props ){
	this.update = function(time){}
	this.draw = function(){}
}

function gameMaster( props ){
	
	this.children = [];
	this.debugging = false;
	
	for (var attrname in props) { this[attrname] = props[attrname]; };
		
	this.addObject = function(object){		
		this.children.push(object);
	};	
	
	this.update = function(modifier){		
		
		var collisions = [];
		
		//update the camera DUH!
		this.camera.update();
		
		//update the children....
		for(var i = 0; i < this.children.length; i++) {	
			
			if( this.children[i].live == false){				
				this.children.splice(i,1);
				continue;
			}; 
	
			this.children[i].update(modifier);	
		};
		
		//Works out collisions
		//for the amount of objects in gameMaster.....
		for (var j = 0; j < this.children.length; j++) {		
			
			//if the object doesn't have a kitbox, skip it.
			if( this.children[j].hitboxCords == undefined ){ continue;};	
			
			//all of the objects hit boxes.
			var objectCords = this.children[j].hitboxCords ;
			
			
			//for the amount of objects in gameMaster.....
			for (var q = 0; q < this.children.length; q++) {		
				//skip if it's the smae object or undefined.
				if(j >= q || this.children[q].hitboxCords == undefined ){continue;}						
				
				//all of the targets hitboxes.
				var targetCords = this.children[q].hitboxCords;
				
				//how many hitboxes the object has				
				for( var y = 0; y < objectCords.length; y++ ){
					
					//how many hitboxes the target has
					for( var u = 0; u < targetCords.length; u++ ){
						var touch = touching( objectCords[y], targetCords[u] ); 
						if( touch[0] )	collisions.push( [ this.children[q] , this.children[j] , touch[1]  ] );	
					}
				}
			};	
		};
		//run the collisions
		for (var i = 0; i < collisions.length; i++) {	
						
			collisions[i][0].collide( collisions[i][1], collisions[i][2], modifier );
			collisions[i][1].collide( collisions[i][0], collisions[i][2], modifier );
		};
	};
	
	this.draw = function(){		
		
		if( this.camera.split ){
						
			for(var i = 0; i < this.camera.x.length; i++){
				
				this.camera.draw(i); //gives the camera who to draw for
				
				for (var j = 0; j < this.children.length; j++) {				
					this.children[j].draw();	
				}; 
				
				this.camera.end(i);
			}
			
		}else{ //draws avg cam!
			
			this.camera.draw(); //gives the camera who to draw for... MAY NOT BE NEEDED?
			
			for (var i = 0; i < this.children.length; i++) {	
				this.children[i].draw();	
			}; 
		};

	
		if( this.debugging ){			//doesn't work if split.
			
			ctx.beginPath();
			ctx.arc(0, 0, 2, 0, Math.PI*2, true); 
			ctx.closePath();
			ctx.fill();
			
			//for every child...
			for (var i = 0; i < this.children.length; i++) {	
				
				//skip if not boxes.
				if( this.children[i].hitboxCords == undefined ){ continue;};	
				
				//get the current boxes
				var boxes = this.children[i].hitboxCords;
					
				//for every box
				for( var k = 0; k < boxes.length; k++){
					
					ctx.save();	
					
					//get the current box
					var box = boxes[k];
						ctx.translate(box.x, box.y);	
						ctx.rotate( box.bearing * (Math.PI/180)  );
						ctx.rect(  box.xOffset,  box.yOffset, box.width, box.height);
						ctx.stroke();
						ctx.restore();				
				}
			}	
		}	
	};
};

function camera(following){
	
	var frame;
	
	this.following = following;
	
	this.x = []; //this is normall the players XY...
	this.y = []; //array for each player....
	this.playerAngle = 0;
		
	//ok....
	this.draw = function( j ){
		
		var x = canvas.width/2;
		var y = canvas.height/2;
				
		if(arguments.length == 0){
				
			x -= this.x;
			y -= this.y;

			ctx.translate( x, y);
				
		}else{
			
			x -= this.x[j];
			y -= this.y[j];
		
			ctx.translate( x, y);
		};
		
	}
	
	this.end = function( j ){

		if( j == 0 ){
			
			//get the canvas...
			
			//clear and reset canvas...
			ctx.setTransform(1, 0, 0, 1, 0, 0);
		
			//this should be working...
			frame = ctx.getImageData( 0,0, canvas.width, canvas.height );
			
			ctx.clearRect(0,0,canvas.width,canvas.height);
						
		} else if( j == this.x.length-1){
			
			ctx.setTransform(1, 0, 0, 1, 0, 0);		
			//canvas 0,0
			ctx.save();
								
				var borderAngle = this.playerAngle + 90;
				if( borderAngle > 360){
					borderAngle -= 360;
				}else if (borderAngle < 0){
					borderAngle += 360;
				};
				
		
				var keyAngle =  Math.atan( (canvas.height/2) / (canvas.width/2) )  * 180 / Math.PI;
				var oppAngle = 90 - keyAngle;
				
				//top  //p1 on right //34 when stops working
				
				 if( ( -oppAngle < borderAngle && borderAngle < oppAngle) || ( 270 + keyAngle < borderAngle && borderAngle < 360 + keyAngle )  ){
					
					var tan = Math.tan( ( borderAngle ) * (Math.PI / 180) );
					
					var b = canvas.height/2
					var a = b * tan;
					
					ctx.beginPath();
					
					ctx.moveTo( canvas.width, 0  );						
					ctx.lineTo( canvas.width /2 +a, 0 );
					ctx.lineTo( canvas.width /2 -a, canvas.height );		//ok		
					ctx.lineTo( canvas.width , canvas.height ); //ok	
					
					
					ctx.closePath();		
					ctx.stroke();
					
					ctx.clip();	
					
					ctx.clearRect(0,0,canvas.width,canvas.height); // clips wrong side....
					
					vCtx.putImageData( frame, 0, 0 );		
					ctx.drawImage( vCanvas, 0, 0 );
										
					ctx.restore(); // canvas 0,0. 
					
				} 
				
				//this works.....
				if( ( 180 + oppAngle  < borderAngle) && (borderAngle < 270 + keyAngle)){ //  works for 270 degrees.
				
					var tan = Math.tan( (270 - borderAngle ) * (Math.PI / 180) );
					
	
					var b = canvas.width/2
					var a = b * tan;

					ctx.beginPath();					
					ctx.moveTo( 0, 0  );
					ctx.lineTo( 0 , canvas.height/2 + a ); //ok		
					ctx.lineTo( canvas.width, canvas.height/2 -a );		//ok		
					ctx.lineTo( canvas.width, 0 );
					
					
					ctx.closePath();		
					ctx.stroke();
					
					ctx.clip();	
					
					ctx.clearRect(0,0,canvas.width,canvas.height); // clips wrong side....
					
					vCtx.putImageData( frame, 0, 0 );		
					ctx.drawImage( vCanvas, 0, 0 );
										
					ctx.restore(); // canvas 0,0. 
				
				}
				 
				 
				 //works.....
				if( 90 + keyAngle < borderAngle && borderAngle < 180 + oppAngle){
				
					var tan = Math.tan( ( borderAngle ) * (Math.PI / 180) );
					
					var b = canvas.height/2
					var a = b * tan;
					
					ctx.beginPath();		
					ctx.moveTo( 0, 0  );						
					ctx.lineTo( canvas.width /2 +a, 0 );
					ctx.lineTo( canvas.width /2 -a, canvas.height );		//ok		
					ctx.lineTo( 0 , canvas.height ); //ok	
					
					
					ctx.closePath();		
					ctx.stroke();
					
					ctx.clip();	
					
					ctx.clearRect(0,0,canvas.width,canvas.height); // clips wrong side....
					
					vCtx.putImageData( frame, 0, 0 );		
					ctx.drawImage( vCanvas, 0, 0 );
										
					ctx.restore(); // canvas 0,0. 

				}
				
				//left
				if( oppAngle  < borderAngle && borderAngle < 90 + keyAngle){
					
					var tan = Math.tan( (  180 - 90 - borderAngle   ) * (Math.PI / 180) );
					
					var b = canvas.width/2
					var a = b * tan;
					
					ctx.beginPath();		
					ctx.moveTo( 0, canvas.height  ); //bott left
					ctx.lineTo( canvas.width , canvas.height ); //bottom right
					ctx.lineTo( canvas.width, canvas.height/2 - a ); //
					ctx.lineTo( 0, canvas.height/2 + a ); //
					
					ctx.closePath();		
					ctx.stroke();
					
					ctx.clip();	
					
					ctx.clearRect(0,0,canvas.width,canvas.height); // clips wrong side....
					
					vCtx.putImageData( frame, 0, 0 );		
					ctx.drawImage( vCanvas, 0, 0 );
										
					ctx.restore(); // canvas 0,0.
					
				}
				
				
		};	
	};
	
	this.update = function(){
		
		this.split = false;
				
		//following 1p? move the camera to 1p
		if( this.following.length == 1){
			
			this.x = this.following[0].x;
			
			this.y = this.following[0].y;	
		}
		else if( this.following.length == 2){
			//2 things it's following......
			
			//distance between the two cords.
			var xDistance = this.following[0].x - this.following[1].x;
			var yDistance = this.following[0].y -this.following[1].y;
			
			
			
			//the angle in degrees.
			this.playerAngle = Math.atan( yDistance / xDistance ) * 180 / Math.PI;
			var playerDistance = Math.sqrt( xDistance * xDistance + yDistance * yDistance );
			
			
			var a = canvas.width/4;
			var b = canvas.height/4;
	
			
			var alpha = this.playerAngle * (Math.PI / 180);
			var sinalpha = Math.sin(alpha);
			var cosalpha = Math.cos(alpha);
			
			var boundryX = (a * cosalpha * 1);
			var boundryY = (b * sinalpha * 1);
			 
			var boundryDistance = Math.sqrt( boundryX * boundryX + boundryY * boundryY ) * 2;
			
			//fix the angles.
			if( xDistance > 0 && yDistance > 0 ){
					
					this.playerAngle +=270;
			}
			else if( xDistance > 0 && yDistance < 0 ){
					
				this.playerAngle += 270; 
			}
			else if( xDistance < 0 && yDistance > 0 ){
					
				this.playerAngle += 90;
					
			}
			else if( xDistance < 0 && yDistance < 0 ){
				
				this.playerAngle +=90;
			}
					
			
			// boundry distance is like the current diameter.
			if( playerDistance > boundryDistance){
							
				// translats etc.
				this.x = [];
				this.y = [];
				
				
				//p2 is on the right....
				if(  0 < this.playerAngle && this.playerAngle < 90 ){
					
					this.x[0] = this.following[0].x + boundryX; 
					this.y[0] = this.following[0].y + boundryY;	

					this.x[1] = this.following[1].x - boundryX;
					this.y[1] = this.following[1].y - boundryY;
					
				}
				else if(  90 < this.playerAngle && this.playerAngle < 180 ){
					
					this.x[0] = this.following[0].x + boundryX;
					this.y[0] = this.following[0].y + boundryY;	

					this.x[1] = this.following[1].x - boundryX;
					this.y[1] = this.following[1].y - boundryY;	
					
				}
				else if(  180 < this.playerAngle && this.playerAngle < 270 ){
					
					this.x[0] = this.following[0].x - boundryX; 
					this.y[0] = this.following[0].y - boundryY;	

					this.x[1] = this.following[1].x + boundryX;
					this.y[1] = this.following[1].y + boundryY;	
					
				}
				else if(  270 < this.playerAngle && this.playerAngle < 360 ){
					
					this.x[0] = this.following[0].x - boundryX; 
					this.y[0] = this.following[0].y - boundryY;	

					this.x[1] = this.following[1].x + boundryX;
					this.y[1] = this.following[1].y + boundryY;
				}
				else{
					debugger;
				}
				
				
				this.split = true;
				
				
			}else{
				
				var x = 0;
				var y = 0;
				
				for (var i = 0; i < this.following.length; i++) {
								
					x += this.following[i].x;
					y += this.following[i].y; 
				}
			
				this.x = x / this.following.length;
				this.y = y / this.following.length; 
				
			};
			
		}
		else{
			//average all....
			var x = 0;
			var y = 0;
			
			for (var i = 0; i < this.following.length; i++) {
							
				x += this.following[i].x;
				y += this.following[i].y; 
			}
		
			this.x = x / this.following.length;
			this.y = y / this.following.length; 
				
		};
	};
	
	//for debugging, ignore....
	this.drawTarget = function(){
		
		ctx.beginPath();
		ctx.arc(this.x, this.y, 5 , 0, 2 * Math.PI, false);
		ctx.fillStyle = 'black';
		ctx.fill();
		ctx.lineWidth = 5;
		ctx.strokeStyle = '#003300';
		ctx.stroke();
		
		 var arrayLength = this.following.length;
		for (var i = 0; i < arrayLength; i++) {
			
			var x = this.following[i].x + this.following[i].width/2;
			var y = this.following[i].y + this.following[i].height/2; 
			
			
			ctx.beginPath();
			ctx.arc(x, y, 5 , 0, 2 * Math.PI, false);
			ctx.fillStyle = 'black';
			ctx.fill();
			ctx.lineWidth = 5;
			ctx.strokeStyle = '#003300';
			ctx.stroke();
			
		}
	}	
	
	this.drawCords = function(){
		ctx.fillText( "camera.x:" + this.x + " camera.y:" + this.y,50,100);	
				
	};
}

function map(imageLoc){
	
	this.ready = false;
	this.height;
	this.width;
	this.x = 0;
	this.y = 0;
	
	this.image = new Image();
	this.image.src = imageLoc;
	
	 this.image.onload = (function(map){
		map.ready = true;	
	})(this);
	
	
	this.update = function(){
				
	};
	
	this.draw = function(x,y){	
		if (this.ready) {
			if(arguments.length == 0){
				ctx.drawImage(this.image, this.x, this.y);
			}else{
				ctx.drawImage(this.image, x, y);			
			}
		}
	}	
};

// Handle keyboard controls
var keysDown = {};


addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);
addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);
addEventListener("gamepadconnected", function(e) { 
	gamepadHandler(e, true); 
}, false);
addEventListener("gamepaddisconnected", function(e) { 
	gamepadHandler(e, false); 
}, false); 

var mousedown = false;
var mousemove = false;

addEventListener("mousedown", function(e) { 
	mousedown = e;
}, false); 
addEventListener("mouseup", function(e) { 
	
	mousedown = false;
	
}, false); 
addEventListener("mousemove", function(e) { 	
	mousemove = e;
}, false); 

var gameReady = false;

var init = function () {	
	if(hero.ready && gameReady == false){

		/* if(hero.start()){
			
			gameReady = true;
			//monster.startRand();
			//lameHero.startRand();
		} */
	}
};





var gamepads = [];
function gamepadHandler(event, connecting) {
  
  var gamepad = event.gamepad;
  // Note:
  //gamepad = navigator.getGamepads()[gamepad.index];

	if (connecting) {	
		gamepads[gamepad.index] = gamepad;
	} else {
		gamepads.splice( gamepad.index, 1);
	}
}







// Update game objects
var update = function (modifier) {
	
	Game.update(modifier);
	
	
	/* for( var i = 0; i < gamepads.length; i++){
		
		////console.log( gamepads[i] );
		
		for( var j = 0; j < gamepads[i].buttons.length; j++ ){	
			if( gamepads[i].buttons[j].pressed ){
				////console.log( "button" + j, gamepads[i].buttons[j] );
			};
		}
		
		for( var j = 0; j < gamepads[i].axes.length; j++ ){
			////console.log( "button" + j, gamepads[i].axes[j] );
		}	
	} */
	
	
};

// Draw everything
var render = function () {
	
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0,0,canvas.width,canvas.height);
	
	ctx.save();
	Game.draw();	
	ctx.restore();
	
	/* var ellipse = calculateEllipse( canvas.width/2, canvas.height /2 , canvas.width/4, canvas.height/4, 0, 36);

	ctx.beginPath();
	ctx.lineWidth="1";
	ctx.strokeStyle="blue"; // blue path	
													
	for( var h = 0; h < ellipse.length; h++){							
		if( h == 0){
			
			ctx.moveTo( ellipse[h].x, ellipse[h].y );
			
		}else if( h == ellipse.length -1){
			
			ctx.lineTo( ellipse[h].x, ellipse[h].y);
				
		}else{
				ctx.lineTo( ellipse[h].x, ellipse[h].y);
		}		
	}
			
	ctx.closePath();
	ctx.stroke(); // Draw it  */

};

// The main game loop
var main = function () {
	
	//setup the game / check assets
	init();
	
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};
	
	
	
	var PlayerCollisions = {
		
		player:dynamicCollide,
		
	};
	
	
	var heroProps = {
		
		name:"hero",
		solid:true,
		ai:false,
		style:"topDown",
		spriteTorseSrc:"images/bkspr01.png",
		spriteLegsSrc:"images/bkspr01-legs.png",
		frameX:128, //used for sprite clipping
		frameY:128, //used for sprite clipping
		speed:128,
		height:64, //
		width:64,  //
		health:128,
		animations:heroAnimations,
		controls:heroControls,
		collisions:PlayerCollisions,
	};
	var hero2Props = {
		
		name:"hero2",
		solid:true,
		ai:false,
		style:"topDown",
		spriteTorseSrc:"images/torsoRed.png",
		spriteLegsSrc:"images/bkspr01-legs.png",
		frameX:128,
		frameY:128,
		speed:150,
		height:64,
		width:64,
		health:128,
		animations:heroAnimations,
		controls:hero2Controls,
		collisions:PlayerCollisions,
		
	};
	
	//create background
	var bgImage = new map( "images/map1.png" );	
	
	//models
	var worldShotgun = new worldProp( shotgunWorldProps );
	var worldShotgun2 = new worldProp( shotgunWorldProps );
	var worldPistol = new worldProp( pistolWorldProps );
	
	//areas
	var tankArea = new worldArea( tankAreaProps );
	var rocketArea = new worldArea( rocketAreaProps );
	var scoutArea = new worldArea( scoutAreaProps );
	
	//walls
	var topWall = new worldArea( topWallProps );
	var bottomWall = new worldArea( bottomWallProps );
	
	var leftWall = new worldArea( leftWallProps );
	var rightWall = new worldArea( rightWallProps );
	
	//players
	var hero = new player( heroProps );
	var hero2 = new player( hero2Props );

	//camera
	var camera = new camera([hero, hero2]);
	
	var gameMasterProps = {
		camera:camera,
		children:[ bgImage, worldShotgun, worldShotgun2, worldPistol, tankArea,rocketArea, scoutArea, topWall, bottomWall,leftWall, rightWall, hero, hero2 ], 
	};
	var Game = new gameMaster( gameMasterProps );

	// Cross-browser support for requestAnimationFrame
	var w = window;
	requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

	// Let's play this game!
	var then = Date.now();
	main();
