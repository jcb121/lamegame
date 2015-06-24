var heroAnimations ={
	
	standing:{
		
		layerTime0:500,
		minTime0:80,
		importance0:1,
		layer0:[ [1,1],[2,2] ],
		
		layerTime1:500,
		minTime1:80,
		importance1:1,
		layer1:[ [1,1],[2,2] ],
			
		hitBoxes:[
			{ x:-15, y:-5, width:10, height:10 },
			{ x:-5, y:-15, width:10, height:25 },
			{ x:5, y:-5, width:10, height:10 }
		],
	},
	
	walking:{
	
		layerTime0:80,
		minTime0:80,
		importance0:0,
		layer0:[ [2,1],[1,2],[1,3],[2,3] ],
		
		layerTime1:80,
		minTime1:80,
		importance1:0,
		layer1:[ [2,1],[1,2],[1,3],[2,3] ],
		
		hitBoxes:[
			{ x:-15, y:-5, width:10, height:10 },
			{ x:-5, y:-15, width:10, height:25 },
			{ x:5, y:-5, width:10, height:10 }
		],
		
	},
	
	twoHanded:{
		
		hitBoxes:[
			{ x:-15, y:-5, width:10, height:10 },
			{ x:-5, y:-15, width:10, height:25 },
			{ x:5, y:-5, width:10, height:10 }
		],
		
		layerTime1:500,
		minTime1:80,
		importance1:2,
		layer1:[ [1,4] ],
	},
	
	twoHandedB:{
		
		hitBoxes:[
			{ x:-15, y:-5, width:10, height:10 },
			{ x:-5, y:-15, width:10, height:25 },
			{ x:5, y:-5, width:10, height:15 }
		],
		
		layerTime1:500,
		minTime1:80,
		importance1:2,
		layer1:[ [3,4] ],
	},
	
	oneHanded:{
		
		hitBoxes:[
			{ x:-15, y:-5, width:10, height:20 },
			{ x:-5, y:-10, width:10, height:25 },
			{ x:5, y:-20, width:10, height:25 }
		],
		
		layerTime1:80,
		minTime1:80,
		importance1:2,
		layer1:[ [2,4] ],
	}
	
	
};