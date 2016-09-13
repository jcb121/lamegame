	var context;
	var contextClass = (window.AudioContext || 	  window.webkitAudioContext || 	  window.mozAudioContext || 	  window.oAudioContext || 	  window.msAudioContext);
	if (contextClass) {
		context = new contextClass();
	} 
	else {
		alert( "upgrade your browser" );
	}
	
	// Create the canvas
	var vCanvas = document.createElement("canvas");
	var vCtx = vCanvas.getContext("2d");
	
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");
	
	
	
	
	// Handle keyboard controls
	/* var keysDown = {};
	var mouse = { down:false,}; 
	addEventListener("keydown", function (e) {
		keysDown[e.keyCode] = true;
	}, false);
	addEventListener("keyup", function (e) {
		delete keysDown[e.keyCode];
	}, false); 
	addEventListener("gamepadconnected", function(e) { 
		//gamepadHandler(e, true); 

	}, false);
	addEventListener("gamepaddisconnected", function(e) { 		
		//gamepadHandler(e, false); 

	}, false); */
	
	
	