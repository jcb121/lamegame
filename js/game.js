function WorldMaster ( props ){
		
	this.ready = false;
	
	debugging = props.debugging;
	this.debugging = props.debugging;
	
	this.mode = props.mode;
	this.children = props.children;

	for( var i = 0; i < this.children.length; i++ ){
		this.children[i].parent = this;
	};
	
};



WorldMaster.prototype = {
	update:function( modifier ){ //does nothing really!
		this.children[ this.mode ].update( modifier );	
		
		var gamepads = navigator.getGamepads();
		
		for (var i = 0; i < gamepads.length; ++i){	
			
			var pad = gamepads[i];			
			
			if( pad != undefined){
				
				//console.log( pad.axes[1] );
				
				/* for( var j = 0; j < pad.buttons.length; j++){
					
					if( pad.buttons[j].pressed){
						console.log( pad, j);
					}
				} */
			};
			
			
		}
	},
	draw:function(){
		this.children[ this.mode ].draw();
	},
	checkReady:function(){
		var checks = 0;
		for( var i = 0; i < this.children.length; i++){
			if( this.children[i].ready == undefined || this.children[i].ready == false){
				checks++
			};
		}
		if( checks == 0 ){
			return true;
		}else{
			return false;
		}
	},
}

function gameMaster( props ){
	
	this.ready = false;
	
	this.children = [];
	this.debugging = false;
	
	for (var attrname in props) { this[attrname] = props[attrname]; };
		
	this.addObject = function(object){		
		this.children.push(object);
	};	
	
	for( var i = 0; i < this.children.length; i++ ){
		this.children[i].parent = this;
	};
	
	this.update = function(modifier){		
			
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
		
		getCollisions( this.children, modifier);
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

gameMaster.prototype = {
	
	checkReady:function(){
		var checks = 0;
		for( var i = 0; i < this.children.length; i++){
			if( this.children[i].ready == undefined || this.children[i].ready == false){
				checks++
			};
		}
		if( checks == 0 ){
			return true;
		}else{
			return false;
		}
	},
	
	
};

function Camera(following){
	
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


// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);
addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);






//works for new controllers only....
addEventListener("gamepadconnected", function(e) { 

	console.log(e);

	gamepadHandler(e, true); 
}, false);



addEventListener("gamepaddisconnected", function(e) { 
	
	console.log(e);
	
	gamepadHandler(e, false); 
	
}, false); 

var mouse = { down:false,};

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


var gamepads = [];
function gamepadHandler(event, connecting) {
  
	//console.log( "connecting" );
  
  var gamepad = event.gamepad;
  // Note:
	gamepad = navigator.getGamepads()[gamepad.index];
	
	//console.log( gamepad );
	
	if (connecting) {	
		gamepads[gamepad.index] = gamepad;
	} else {
		gamepads.splice( gamepad.index, 1);
	}
}




//----------------------------------------------------------------------------------------------------------------------------------
// Update game objects
var update = function (modifier) {
	
	//
	/* if( Game.ready ){	
		Game.update(modifier);
	}else{
		
	} */

	
	
	
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
	//Game.draw();	
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

//----------------------------------------------------------------------------------------------------------------------------------

// The main game loop
var main = function () {
	
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	world.update(delta / 1000);
	
	render();	
	world.draw();
	
	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};
//----------------------------------------------------------------------------------------------------------------------------------	
	
	
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
	
	var mainMenuProps = {
		image:"images/menuBack.jpg",
		music:"",
		items:[
			{	
				text:"Single Player",
				textColor:"white",
				boxColor:"black",
				fontSize:20,
				font: "Arial",
				y:200,
				height:50,
				width:150,
				bearing:0,
				collisions:{
					mouseObject:function( mouse ){
												
						if( mouse.down != false ){
							
							if( mouse.clickDelay.ready()  == false) return false;
							
							var bgImage = new worldProp( bgProps );							
							var worldShotgun = new worldProp( shotgunWorldProps );
							
							//models
							var worldShotgun = new worldProp( shotgunWorldProps );
							var worldShotgun2 = new worldProp( shotgunWorldProps );
							var worldPistol = new worldProp( pistolWorldProps );
							
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
							//var hero2 = new player( hero2Props );

							//camera
							var camera = new Camera([hero]); // , hero2]);
							
							var gameMasterProps = {
								camera:camera,
								children:[ bgImage, worldShotgun, worldShotgun2, worldPistol, tankArea,rocketArea, scoutArea, topWall, bottomWall,leftWall, rightWall, hero,  ], //hero2
							};
							
							var Game = new gameMaster( gameMasterProps ); //level Not the World!! 
							
							world.children.push( Game );
							world.mode = world.children.indexOf( Game );
							
						}
					},
				}
			},
			{
				text:"Multi-Player",
				textColor:"white",
				boxColor:"black",
				fontSize:20,
				font: "Arial",
				y:300,
				height:50,
				width:150,
				bearing:0,
			},
			{
				text:"Sound",
				textColor:"white",
				boxColor:"black",
				fontSize:20,
				font: "Arial",
				x:200,
				y:0,
				height:50,
				width:150,
				bearing:0,
			},
			{
				text:"Credits",
				textColor:"white",
				boxColor:"black",
				fontSize:20,
				font: "Arial",
				x:0,
				y:0,
				height:50,
				width:150,
				bearing:0,
			},
		],
		
	};

	var mainMenu = new MenuScreen( mainMenuProps  );
	
	var worldMasterProps = {
		debugging:true,
		mode : 0,
		children : [ mainMenu ],
	};
	
	var world = new WorldMaster( worldMasterProps );
	
	// Cross-browser support for requestAnimationFrame
	var w = window;
	requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

	// Let's play this game!
	var then = Date.now();
	main();
