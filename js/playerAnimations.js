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
			[ { x:-18, y:-5 }, { x:-5, y:10 } ], //1
			[ { x:-5, y:-10 }, { x:5, y:10 } ], //2
			[ { x:5, y:-5 }, { x:18, y:10 } ], //3
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
			[ { x:-18, y:-5 }, { x:-5, y:10 } ], //1
			[ { x:-5, y:-10 }, { x:5, y:10 } ], //2
			[ { x:5, y:-5 }, { x:18, y:10 } ], //3
		],
		
	},
	
	twoHanded:{
		
		hitBoxes:[
			[ { x:-15, y:-5 }, { x:-5, y:10 } ], //1
			[ { x:-5, y:-20 }, { x:5, y:12 } ], //2
			[ { x:5, y:-5 }, { x:10, y:8 } ], //3
		],
		
		layerTime1:500,
		minTime1:80,
		importance1:2,
		layer1:[ [1,4] ],
	},
	
	twoHandedB:{
		
		hitBoxes:[
			[ { x:-15, y:-5 }, { x:-5, y:10 } ], //1
			[ { x:-5, y:-13 }, { x:5, y:10 } ], //2
			[ { x:5, y:-5 }, { x:10, y:10 } ], //3
		],
		
		layerTime1:500,
		minTime1:80,
		importance1:2,
		layer1:[ [3,4] ],
	},
	
	oneHanded:{
		
		hitBoxes:[
			[ { x:-18, y:0 }, { x:-5, y:17 } ], //1
			[ { x:-5, y:-10 }, { x:5, y:15 } ], //2
			[ { x:5, y:-20 }, { x:16, y:10 } ], //3
		],
		
		layerTime1:80,
		minTime1:80,
		importance1:2,
		layer1:[ [2,4] ],
	}
	
	
};