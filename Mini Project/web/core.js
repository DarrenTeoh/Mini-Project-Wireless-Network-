var pubnub = new PubNub({
	publishKey : 'pub-c-ce1d47c3-6066-4be8-90fb-7e8fa9b056da',
	subscribeKey : 'sub-c-c0266a0a-dbe4-11e7-96a8-ea37cc28f519'
}); //initial key.....

var N = 0; N2 = 0;
var sum = 0; sum2 = 0; 
var avg = 0; avg2 = 0;
var min = 0; min2 = 0;
var max = 0; max2 = 0;

var gaugechart = eon.chart({
  pubnub: pubnub,
  channels: ['eon-gauge'],
  generate: {
    bindto: '#chart',
    data: {
      type: 'gauge',
    },
    gauge: {
      min: 0,
      max: 100
    },
    color: {
      pattern: ['#FF0000', '#F6C600', '#60B044'],
      threshold: {
        values: [30, 60, 90]
      }
    }
  }
});

var spline = eon.chart({
  pubnub: pubnub,
  channels: ['eon-spline'],
  history: true,
  flow: true,
  pubnub: pubnub,
  generate: {
    bindto: '#spline',
    data: {
      labels: false
    }
  }
});

var bar = eon.chart({
  pubnub: pubnub,
  channels: ['eon-bar'],
  generate: {
    bindto: '#bar',
    data: {
      labels: true,
      type: 'bar'
    },
    bar: {
      width: {
        ratio: 0.5
      }
    },
    tooltip: {
        show: false
    }
  }
});

var gaugechart2 = eon.chart({
  pubnub: pubnub,
  channels: ['eon-gauge2'],
  generate: {
    bindto: '#chart2',
    data: {
      type: 'gauge',
    },
    gauge: {
      min: 0,
      max: 100
    },
    color: {
      pattern: ['#FF0000', '#F6C600', '#60B044'],
      threshold: {
        values: [30, 60, 90]
      }
    }
  }
});

var spline2 = eon.chart({
  pubnub: pubnub,
  channels: ['eon-spline2'],
  history: true,
  flow: true,
  pubnub: pubnub,
  generate: {
    bindto: '#spline2',
    data: {
      labels: false
    }
  }
});

var bar2 = eon.chart({
  pubnub: pubnub,
  channels: ['eon-bar2'],
  generate: {
    bindto: '#bar2',
    data: {
      labels: true,
      type: 'bar'
    },
    bar: {
      width: {
        ratio: 0.5
      }
    },
    tooltip: {
        show: false
    }
  }
});

function gauge_fn(digit){
  pubnub.publish({
    channel: 'eon-gauge',
    message: {
      eon: {
        'data': digit
      }
    }
  });

}

function spline_fn(digit){
  pubnub.publish({
    channel: 'eon-spline',
    message: {
      eon: {
        'data': digit
      }
    }
  });

}

function bar_fn(val) {
  N = N + 1;
  sum = sum + parseFloat(val);

  if(N == 1) min = val;
  if(min >= val) min = val;
  if(max <= val) max = val;

  avg  = sum/N;

  console.log("val: " + val + "min: " + min + ", max: " + max + ", avg: " + avg.toFixed(2));

  pubnub.publish({
      channel: 'eon-bar',
      message: {
          eon: {
            'Min': min,//.toFixed(2),
            'Max': max,//.toFixed(2),
            'Average': avg.toFixed(2)
          }
      }
    }); // end publish
}

function gauge_fn2(digit){
  pubnub.publish({
    channel: 'eon-gauge2',
    message: {
      eon: {
        'data': digit
      }
    }
  });

}

function spline_fn2(digit){
  pubnub.publish({
    channel: 'eon-spline2',
    message: {
      eon: {
        'data': digit
      }
    }
  });

}

function bar_fn2(val2) {
  N2 = N2 + 1;
  sum2 = sum2 + parseFloat(val2);

  if(N2 == 1) min2 = val2;
  if(min2 >= val2) min2 = val2;
  if(max2 <= val2) max2 = val2;

  avg2  = sum2/N2;

  console.log("val: " + val2 + "min: " + min2 + ", max: " + max2 + ", avg: " + avg2.toFixed(2));

  pubnub.publish({
      channel: 'eon-bar2',
      message: {
          eon: {
            'Min': min2,//.toFixed(2),
            'Max': max2,//.toFixed(2),
            'Average': avg2.toFixed(2)
          }
      }
    }); // end publish
}   

var socket = io("http://localhost:02468");

socket.on('connect', function() {
    console.log("Successfully connected to server");

    socket.on('Temperature', function(val){
      var celcius = parseFloat(val * 100).toFixed(2);
      console.log("data: " + celcius);
      
      gauge_fn(celcius); // load eon-chart - gauge
      spline_fn(celcius); // load eon-chart - spline
      bar_fn(celcius); //load eon-chart - bar
    });

    socket.on('Humidity', function(val){
      var humid = parseFloat(val * 100).toFixed(2);
      console.log("data: " + humid);
      
      gauge_fn2(humid); // load eon-chart - gauge
      spline_fn2(humid); // load eon-chart - spline
      bar_fn2(humid); //load eon-chart - bar
    });


});