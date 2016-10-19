/*function CameraOld(following){
	
	var frame;
	
	this.following = following;
	
	this.x = []; //this is normaly the players XY...
	this.y = []; //array for each player....
	this.playerAngle = 0;
		
	//ok....
	this.draw = function(canvas, j){
		
		var x = canvas.width/2;
		var y = canvas.height/2;
		var ctx = canvas.getContext('2d');

		if(arguments.length > 1){
				
			x -= this.x;
			y -= this.y;

			ctx.translate( x, y);
				
		}else{
			
			x -= this.x[j];
			y -= this.y[j];
		
			ctx.translate( x, y);
		};
		
	}
	
	this.end = function(canvas, j){

		var ctx = canvas.getContext('2d');

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
			
		}
	}	
	
	this.drawCords = function(){
		ctx.fillText( "camera.x:" + this.x + " camera.y:" + this.y,50,100);	
				
	};
}
*/
var HitBox = require('./hitbox');
var collide = require('../functions/collisions').collide;

class Camera{
	constructor(canvas){
		this.ready = true;
		this.debug = true;

		this.collisions = {
			'mouseObject':{
				'action':"drag"
			}
		};

		this.x = 0;
		this.y = 0;
		this.height = canvas.height;
		this.width = canvas.width;
		this.scale = 1;
		this.bearing = 0;
		this.debug = true;

		this.state = 'default';
		let hitBox = {
			'default':{
				'hitBoxes':[{
					'x': 0-canvas.width / 2,
					'y': 0-canvas.height / 2,
					'width': canvas.width,
					'height': canvas.height
				}]
			}
		};
		this.hitBox = new HitBox(hitBox);
		this.hitBox.parent = this;

	}
	drag(mouse){

		if(mouse.down){
			this.x += mouse.x - mouse.lastX;
			this.y += mouse.y - mouse.lastY;
		}
	}
	update(modifier){

		console.log(this.x);
		this.following = this.parent.players;
		this.hitboxCords = this.hitBox.update();

		if(this.following > 0){
			console.log(this.following);
			//average all....
			var x = 0;
			var y = 0;

			this.following.forEach(function(child){
				x += child.x;
				y += child.y;
			});

			this.x = x / this.following.length;
			this.y = y / this.following.length;
		}
	}
	draw(canvas){
		var x = canvas.width/2;
		var y = canvas.height/2;
		var ctx = canvas.getContext('2d');

		x -= this.x;
		y -= this.y;

		ctx.font = "48px serif";
		ctx.fillText("world", 0, 0);

		this.hitBox.draw(ctx, 'green');

		ctx.translate( x, y);
		this.hitBox.draw(ctx, 'red');
	}

}
Camera.prototype.collide = collide;

module.exports = Camera;