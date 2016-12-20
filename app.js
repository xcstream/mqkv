var mosca = require('mosca');

var mqtt = require('mqtt')
var settings = {
  port: 1883,
};

var server = new mosca.Server(settings);

server.on('clientConnected', function(client) {
    console.log('client connected', client.id);
});

server.on('published', function(packet, client) {
  console.log('Published', packet.payload);
});

server.on('ready', setup);

var storage = {}
function setup() {
  var client = mqtt.connect('mqtt://localhost')
  client.subscribe('/mqkv/in')
  client.on('message', function (topic, message) {
  	var strmsg = message.toString()
  		messagearr= message.split(' ')
  	    if (messagearr[0] == 'set'){
  	    	var key = messagearr[1];
  	    	var value = messagearr[2];
  	    	storage[key] = value
  	    	client.publish('/mqkv/out','ok')
  	    }
  	    if (messagearr[0] == 'get'){
  	    	var key = messagearr[1];
  	    	var value = storage['key']
  	    	client.publish('/mqkv/out','value')
  	    }
  })
}

