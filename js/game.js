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
		
	},
	draw:function(){
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.save();
		this.children[ this.mode ].draw();	
		ctx.restore();
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
	this.camera.parent = this;
	
	this.pads = navigator.getGamepads();
	
	if( this.pads != undefined){
			
		for( var i = 0; i < this.pads.length; i++){
			
			if( this.pads[i] == undefined) continue;
			
			var hero = new player(heroProps);
			hero.controllerIndex = this.pads[i].index;
			this.children.push( hero );
			this.players.push( hero );
			hero.parent = this;
			
		}
	}	
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
	addObject:function(object){
		this.children.push(object);
	},
	update: function(modifier){		
		
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
		
		
		if( backgroundSound.ready ){
			if( this.bgLoop == undefined) this.bgLoop = new deBounce(64, true);
			this.bgLoop.update( modifier );
			
			if( this.bgLoop.ready() ){
				backgroundSound.play();
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
	},
	draw:function(){		
		
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

function ZombieSpawner(){
};

ZombieSpawner.prototype = {
	update:function(modifier){
		
		if( this.zombieDelay == undefined){
			this.incriment = 1;
			this.zombieDelay = new deBounce(10);
		};
		
		
		this.zombieDelay.update(modifier);
		if( this.zombieDelay.ready() ){
			for( var i = 0; i < this.incriment; i++){
				
				if( this.parent.children.length > 50){	
					console.log("limit");
					continue;	
				} ;
				
				//zombieProps.parent = this.parent;
				
				var zomb = new AiPlayer( zombieProps )
				
				zomb.parent = this.parent;
				zomb.key = Math.floor(Math.random() * 360);
				zomb.phaseClass();
				
				console.log( zomb.calcSpeed );
				
				this.parent.children.push( zomb );
				
			};
			this.incriment++;
		};
	},
	draw:function(){},
	
};



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
	
	
	var PlayerCollisions = {	
		player:dynamicCollide,
		AiPlayer:dynamicCollide,
		bullet:function(){
			
		},
	};
	var heroProps = {
		solid:true,
		spriteTorseSrc:"images/bkspr01.png",
		spriteLegsSrc:"images/bkspr01-legs.png",
		frameX:128, //used for sprite clipping
		frameY:128, //used for sprite clipping
		speed:128,
		height:64, //
		width:64,  //
		health:128,
		animations:heroAnimations,
		collisions:PlayerCollisions,
	};
	
	var zombieProps = {
		solid:true,
		spriteTorseSrc:"images/torsoRed.png",
		frameX:128,
		frameY:128,
		speed:50,
		height:64,
		width:64,
		health:128,
		startSound:zombieSpawnSound,
		deathSound:zombieDyingSound,
		animations:zombieAnimations,
		collisions:{
			bullet:function(bullet){
				bulletHitBodySound.play();
				bullet.live = false;
				this.parent.takeDamage( 20 );
			},
			player:function( player ){
				if( this.parent.attackDelay.ready() ){
					zombieBiteSound.play();
				}
			},
			AiPlayer:dynamicCollide,
		},
	};
	
	var mainMenuProps = {
		image:"images/menuBack.jpg",
		music:"",
		items:[
			{	
				text:"START",
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
							startGame();
						}
					},
				}
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
		
	