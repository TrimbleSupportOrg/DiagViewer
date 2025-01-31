function plotMachine(plotId, machine) {

  var elemWidth = document.getElementById('contentFrame').offsetWidth - 520;
  var elemHeight = document.getElementById('contentFrame').offsetHeight - 155;
 /* 
  var dataX = machine.x;
  var dataY = machine.y;
  var dataZ = machine.z;
  var dataL = machine.name;
	
  for (p of points) {
 	dataL.push(p.name);
 	dataX.push(p.x);
 	dataY.push(p.y);
 	dataZ.push(p.z);
  }
  */
  // get min and max
  var xMin = Math.min.apply(Math,machine.x);
  var xMax = Math.max.apply(Math,machine.x);
  var xMean = (xMin + xMax) / 2;
  var xDiff = xMax - xMin;
  var yMin = Math.min.apply(Math,machine.y);
  var yMax = Math.max.apply(Math,machine.y);
  var yMean = (yMin + yMax) / 2;
  var yDiff = yMax - yMin;
  var zMin = Math.min.apply(Math,machine.z);
  var zMax = Math.max.apply(Math,machine.z);
  var zMean = (zMin + zMax) / 2;
  var zDiff = zMax - zMin;
  
  var vRange = Math.max(xDiff,yDiff,zDiff);
  var xRange = [ xMean - (vRange / 2) , xMean + (vRange / 2) ];
  var yRange = [ yMean - (vRange / 2) , yMean + (vRange / 2) ];
  var zRange = [ zMean - (vRange / 2) , zMean + (vRange / 2) ];
  
  var colorText = window.getComputedStyle(document.documentElement).getPropertyValue('--content-color');
  var colorSurf = window.getComputedStyle(document.documentElement).getPropertyValue('--content-header-active-background');

  var plot3d = {
    x: machine.x,
    y: machine.y,
    z: machine.z,
    mode: 'markers+text',
    type: 'scatter3d',
    text: machine.name,
    textposition: 'top center',
	textfont: {
	  color: colorText
	},
    marker: { size: 6 },
  };
  
  var layout3d = {
    paper_bgcolor: "rgba(0,0,0,0)",
	autosize: false,
	margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0,
      pad: 0
    },
	height: elemHeight,
    width: elemWidth,
	scene:{ 
	  xaxis: {
	    title: {
          text: 'X',
		  font: {
		    color: colorText
	      }
	    },
	    gridcolor: colorText,
	    zerolinecolor: colorText,
	    tickcolor: colorText,
	    tickfont: {
	      color: colorText
	    },
	    zeroline: false,
	    autorange: false,
	    range: xRange,
	    dtick: 1,
		spikecolor: colorText,
		spikethickness: 2,
		hoverformat: '.3f'
	  },
      yaxis: {
	    title: {
          text: 'Y',
		  font: {
		    color: colorText
	      }
	    },
	    gridcolor: colorText,
	    zerolinecolor: colorText,
	    tickcolor: colorText,
	    tickfont: {
	      color: colorText
	    },
	    zeroline: false,
	    autorange: false,
	    range: yRange,
	    dtick: 1,
		spikecolor: colorText,
		spikethickness: 2,
		hoverformat: '.3f'
	  },
      zaxis: {
	    title: {
          text: 'Z',
		  font: {
		    color: colorText
	      }
	    },
	    gridcolor: colorText,
	    zerolinecolor: colorText,
	    tickcolor: colorText,
	    tickfont: {
	      color: colorText
	    },
	    zeroline: false,
	    autorange: false,
	    range: zRange,
	    dtick: 1,
		spikecolor: colorText,
		spikethickness: 2,
	    backgroundcolor: colorSurf,
        showbackground: true,
		hoverformat: '.3f'
	  },
	},
  };

  //3D VIEW
  Plotly.newPlot(plotId, [plot3d], layout3d, {displayModeBar: false});
  
  var plotElem = document.getElementById(plotId);
  plotElem.on('plotly_click', function(data){
    var ptData = [];
    for(var i=0; i < data.points.length; i++){
        ptData[0] = data.points[i].text;
		ptData[1] = data.points[i].x.toFixed(3);
		ptData[2] = data.points[i].y.toFixed(3);
		ptData[3] = data.points[i].z.toFixed(3);
    }
	var dataDiv = document.getElementById('mTableClick');
	var tableElem = dataDiv.getElementsByTagName('table');
	var startElem = document.getElementById('ptStart');
	var endElem = document.getElementById('ptEnd');
	var distElem = document.getElementById('ptDist');
	if ( startElem.getElementsByTagName('td')[0].innerText == '' ) {
	  startElem.innerHTML = '<tr><th>Name</th><td>'+ptData[0]+'</td></tr><tr><th>X</th><td>'+ptData[1]+'</td></tr><tr><th>Y</th><td>'+ptData[2]+'</td></tr><tr><th>Z</th><td>'+ptData[3]+'</td></tr>';	
	} else if ( endElem.getElementsByTagName('td')[0].innerText == '' ) {
	  endElem.innerHTML = '<tr><th>Name</th><td>'+ptData[0]+'</td></tr><tr><th>X</th><td>'+ptData[1]+'</td></tr><tr><th>Y</th><td>'+ptData[2]+'</td></tr><tr><th>Z</th><td>'+ptData[3]+'</td></tr>';
	} else {
      startElem.innerHTML = endElem.innerHTML;
	  endElem.innerHTML = '<tr><th>Name</th><td>'+ptData[0]+'</td></tr><tr><th>X</th><td>'+ptData[1]+'</td></tr><tr><th>Y</th><td>'+ptData[2]+'</td></tr><tr><th>Z</th><td>'+ptData[3]+'</td></tr>';
		
	}
	if ( endElem.getElementsByTagName('td')[0].innerText != '' ) {
	  // distance
	  var startElem = document.getElementById('ptStart');
	  var startElemTD = startElem.getElementsByTagName('td');
	  var deltaX = ptData[1]-Number(startElemTD[1].innerText);
	  var deltaY = ptData[2]-Number(startElemTD[2].innerText);
	  var deltaZ = ptData[3]-Number(startElemTD[3].innerText);
	  var horDist = Math.sqrt(Math.pow(deltaX,2)+Math.pow(deltaY,2));
	  var slopeDist = Math.sqrt(Math.pow(horDist,2)+Math.pow(deltaZ,2));
	  distElem.innerHTML = '<tr><th>2D</th><td>'+horDist.toFixed(3)+'</td></tr><tr><th>Vert.</th><td>'+deltaZ.toFixed(3)+'</td></tr><tr><th>3D</th><td>'+slopeDist.toFixed(3)+'</td></tr>';
	}
});

}

function plotValve(plotId, ComVelPre) {

  var elemWidth = document.getElementById('contentFrame').offsetWidth - 340;
  var elemHeight = document.getElementById('contentFrame').offsetHeight - 210;
  
  var data;
  var com = [];
  var vel = [];
  var pre = [];
  var countNaN = 0;
  var preIsNaN = true;

   // convert values
  for (var c = 0; c < ComVelPre.length; c++) {
    data = ComVelPre[c];
    com.push(Number(data[0]));
    vel.push(Number(data[1]));
    pre.push(Number(data[2]));
    if (isNaN(Number(data[2]))) {
      countNaN++;
    }
  }
  
  if (countNaN < com.length) {
    preIsNaN = false;  
  }
  
  // get min and max
  var rangeFac = 1.1;
  var tickNum = 5;
  var dec = 1;
  
  var velRange = range(vel, rangeFac,dec);
  var velTicks = ticks(velRange,tickNum,dec);
  var velText = velTicks.map(a => a.toFixed(dec));
  if ( preIsNaN ) {
	var preRange = [-1,1]  
  } else {
    var preRange = range(pre, rangeFac,dec);
  }
  var preTicks = ticks(preRange,tickNum,dec);
  var preText = preTicks.map(a => a.toFixed(dec));
  
  var trace1 = {
    x: com,
    y: vel,
    mode: 'lines+markers',
    type: 'scatter',
    marker: { size: 12 },
    name: 'Velocity'
  };

  var trace2 = {
    x: com,
    y: pre,
    mode: 'lines+markers',
    type: 'scatter',
    marker: { size: 12 },
    name: 'Pressure',
    yaxis: 'y2'
  };

  var colorText = window.getComputedStyle(document.documentElement).getPropertyValue('--content-color');

  var layout = {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    autosize: false,
    margin: {
      l: 80,
      r: 100,
      b: 80,
      t: 20,
      pad: 0
    },
    height: elemHeight,
    width: elemWidth,

    xaxis: {
      title: {
        text: 'Command(%)',
        font: {
          color: colorText
        }
      },
      gridcolor: colorText,
      zerolinecolor: colorText,
      tickcolor: colorText,
      tickfont: {
        color: colorText
      },
      autorange: false,
	  range: [-110,110],
      dtick: 50
    },

    yaxis: {
      title: {
        text: 'Velocity(m/s)',
        font: {
          color: colorText
        }
      },
      gridcolor: colorText,
      zerolinecolor: colorText,
      tickcolor: colorText,
      tickfont: {
        color: colorText
      },
      autorange: false,
	  range: velRange,
	  tickmode: 'array',
	  tickvals: velTicks,
	  ticktext: velText
      },

    yaxis2: {
      title: {
        text: 'Pressure(% duty cycle)',
        font: {
          color: colorText
        }
      },
      gridcolor: colorText,
      zerolinecolor: colorText,
      tickcolor: colorText,
      tickfont: {
        color: colorText
      },
      overlaying: 'y',
      side: 'right',
	  autorange: false,
	  range: preRange,
      tickmode: 'array',
	  tickvals: preTicks,
	  ticktext: preText
    },

    legend: {
      orientation: 'h',
      xanchor: 'center',
      yanchor: 'middle',
      font: {
        color: colorText
      }
    },
	
	hovermode: "x",
  };

  if (preIsNaN) {
	delete layout.yaxis2;
    Plotly.newPlot(plotId, [ trace1 ], layout, {displayModeBar: false});
  } else {
    Plotly.newPlot(plotId, [ trace1, trace2 ], layout, {displayModeBar: false});
  }

}

function range(array, fac, dec) {

  array = array.filter(function (value) {
    return !Number.isNaN(value);
  });
  var offdec = 1/Math.pow(10,dec);

  var min = Math.min.apply(Math,array);
  var minFac = 1;
  if ( min<0 ) {
	  minFac = -1;
  }
  min = Math.abs(min);
  min = min + offdec;
  min = min.toFixed(dec);
  min = Number(min);
  
  var max = Math.max.apply(Math,array);
  var maxFac = 1;
  if ( max<0 ) {
	  maxFac = -1;
  }
  max = Math.abs(max);
  max = max + offdec;
  max = max.toFixed(dec);
  max = Number(max);
  
  var range = Math.max(min,max);
  range = (range * fac).toFixed(dec);
  range = [ range * minFac , range * maxFac];
  
  return range;
}

function ticks(range, num, dec) {
  var ticks = [Number(range[0])];
  var dtick = ( Number(range[1])-Number(range[0]) ) / (num-1);
  for ( var i = 0; i < num-1; i++ ) {
    ticks.push(ticks[i]+dtick);
  }
  
  return ticks;
}