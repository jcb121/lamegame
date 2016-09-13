function WorldMaster ( props ){
		
	this.ready = false;
	this.debugging = false; //props.debugging;
	
	this.mode = props.mode;
	this.children = props.children;
	
	for( var i = 0; i < this.children.length; i++ ){ //gives children a parent
		this.children[i].parent = this;
	};
	
	this.loadingScreen = new LoadScreen();
	
};

WorldMaster.prototype = {
	update:function( modifier ){ //does nothing really!
				
		if( this.ready){
			this.children[ this.mode ].update( modifier );
		}
		else{
			this.loadingScreen.update( modifier );
			this.checkReady( modifier ); //updates the children also
		};
		
		
	},
	draw:function(){
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.save();
		
		if( this.ready ){
			this.children[ this.mode ].draw(); //draws the main menu....		
		} 
		else{
			this.loadingScreen.draw();
		}	
		
		ctx.restore();
	},
	checkReady,
}






//----------------------------------------------------------------------------------------------------------------------------------

function gameMaster( props ){
	
	this.ready = false;
	
	this.children = [];
	this.players = [];
	this.debugging = false;
	
	for (var attrname in props) { 
		this[attrname] = props[attrname]; 
	};
		
	for( var i = 0; i < this.children.length; i++ ){
		this.children[i].parent = this;
	};
	
	this.children.push( new SoundClip( { volume:0.5, src: "sounds/Musical_beat_and_loop_full_band_hard_rock_groove_BLASTWAVEFX_20928.mp3", repeat:true } ) );
	
	this.camera.parent = this;
	this.loadingScreen = new LoadScreen();	
	
};

gameMaster.prototype = {
	
	checkReady,
	addObject:function(object){
		this.children.push(object);
	},
	update: function(modifier){		
		
		if( this.ready ){
			
			// Game PADS CODE	
			var pads = navigator.getGamepads();
			var count = [];
			for( var i = 0; i < pads.length; i++){	
				if( pads[i] != undefined ){
					count.push( pads[i] );
				};
			}; 
		
			if( this.players.length < count.length ){ //more cons then people....
				
				var takenCons = [];
				
				for( var i = 0; i < this.players.length; i++){
					takenCons.push( this.players[i].controllerIndex  );
				}
				
				//loop through VALID controllers...
				for( var i = 0; i < count.length; i++ ){
									
					if( takenCons.indexOf( count[i].index) == -1 ){
												
						if( count[i].buttons[0].pressed ){

							var hero = new player(heroProps);
							hero.controllerIndex = count[i].index;
							this.children.push( hero );
							this.players.push( hero );
							hero.parent = this;
		
						}
					}
				}
			}		
				
			this.camera.update();
			
			//update the children....
			for(var i = 0; i < this.children.length; i++) {	
				
				if( this.children[i].live == false){				
					
					
					if( this.children[i].type == "player"){
					
						var temp = this.players.indexOf( this.children[i] );
						this.players.splice( temp, 1 );
						
					};

					this.children.splice(i,1);
					
					continue;
				}; 
				this.children[i].update(modifier);	
			};
			
			getCollisions( this.children, modifier);
			
		}
		else{
			this.loadingScreen.update( modifier );						
			this.checkReady();	//updates children also.		
		};
	
	},
	draw:function(){				
		if( this.ready ){
			
			if( this.camera.split ){
						
				for(var i = 0; i < this.camera.x.length; i++){
					
					this.camera.draw(i); //gives the camera who to draw for
					
					for (var j = 0; j < this.children.length; j++) {				
						this.children[j].draw();	
					}; 
					
					this.camera.end(i);
				}
				
			}
			else{ //draws avg cam!
				
				this.camera.draw();
				
				for (var i = 0; i < this.children.length; i++) {	
					this.children[i].draw();	
				}; 
			};			
					
		} 
		else{
			this.loadingScreen.draw();
		}	
	},	
};

//----------------------------------------------------------------------------------------------------------------------------------

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
		
		this.following = this.parent.players;
		
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
		
		/* ctx.beginPath();
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
			
		} */
	}	
	
	this.drawCords = function(){
		ctx.fillText( "camera.x:" + this.x + " camera.y:" + this.y,50,100);	
				
	};
}


//----------------------------------------------------------------------------------------------------------------------------------

// The main game loop
var main = function () {
	
	var now = Date.now();
	var delta = now - then;
	world.update(delta / 1000);
	world.draw();
	then = now;
	requestAnimationFrame(main);	
	
};

//----------------------------------------------------------------------------------------------------------------------------------	
	

	
	
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
var then;


jQuery( document ).ready(function() {
		
	document.getElementById("lameGame").appendChild(canvas);
	
	var width = document.getElementById("lameGame").offsetWidth;
	var height =  window.innerHeight;
	
	
	if( height > width){
		
		height = (width /4 ) * 3;
		
	};
	
	canvas.width = width;
	canvas.height = height;
	vCanvas.width = width;
	vCanvas.height = height;
	
	then = Date.now();
	main();
	
});