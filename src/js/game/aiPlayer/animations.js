module.exports = {
	standing:{
		layerTime:500,
		minTime:80,
		layer:[ [1,1],[2,2] ],	
		hitBoxes:[
			{ x:-15, y:-3, width:10, height:10 },
			{ x:-5, y:-10, width:10, height:20 },
			{ x:5, y:-3, width:10, height:10 }
		],
	},
	
	walking:{
		layerTime:80,
		minTime:80,
		layer:[ [2,1],[1,2],[1,3],[2,3] ],
		hitBoxes:[
			{ x:-15, y:0, width:10, height:10 },
			{ x:-5, y:-10, width:10, height:25 },
			{ x:5, y:0, width:10, height:10 }
		],
	}
};