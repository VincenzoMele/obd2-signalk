
module.exports = function (app) {  
  var plugin = {};
  var OBD = require('./libs/ObdConnect.js');
  var OBDConnect;
  
  plugin.id = 'OBD2-SIGNALK';
  plugin.name = 'OBD2';
  plugin.description = 'This Plugin allows to convert OBD2 data into Signalk data';
  
  const EventEmitter = require("events");
  
  const myEmitter = new EventEmitter();
  
  var nameContext;
  
  function ObdSignalK(Path_Value, Path_string){
	  app.handleMessage(plugin.id, {
			context: nameContext,
			updates: [
				{
					values: [
						{
							path: Path_string,
							value: Path_Value
						}
					]
				}
			]
		})
  };
  

  plugin.start = function (options, restartPlugin) {
	nameContext = options.vehicle + ".self";
	if(options.device == "Serial"){
		OBDConnect = new OBD(0,options.SerialPath, options.baudRate);
	}
	else{
		OBDConnect = new OBD(1, options.port, options.IPAddress);
	};
	let dataReceived= {};

	
	
	OBDConnect.on('dataSignalK', function (data) {
		dataReceived= data;
		myEmitter.emit(dataReceived.pid, dataReceived.val);
	});
   
	OBDConnect.on("connected", function (data) {
		var pids = ["0D", "0C", "05", "03", "04", "0B", "0F", "11", "21", "1F", "46","2F"];
		this.addQueue(pids);
		this.writeToOBD("51"); //fuel type
		this.startQueue(options.Interval);
	});
	
	OBDConnect.start();
	
	myEmitter.on("0D", function(temp) {
		ObdSignalK(temp,'engine.0.speed.vehicle');
	});
	
	myEmitter.on("0C", function(temp) {
		ObdSignalK(temp,'engine.0.speed.engine');
	});
	
	myEmitter.on("05", function(temp) {
		ObdSignalK(temp,'engine.0.temperature.coolant');
	});
	
	myEmitter.on("03", function(temp) {
		ObdSignalK(temp,'engine.0.fuel.systemStatus');
	});
	
	
	myEmitter.on("04", function(temp) {
		ObdSignalK(temp,"engine.0.engineLoad");
	});
	
	myEmitter.on("0B", function(temp) {
		ObdSignalK(temp,'engine.0.map');
	});
	
	myEmitter.on("0F", function(temp) {
		ObdSignalK(temp,"engine.0.temperature.intakeAir");
	});
	
	myEmitter.on("11", function(temp) {
		ObdSignalK(temp,'engine.0.ThrottlePosition');
	});
	
	myEmitter.on("51", function(temp){
		ObdSignalK(temp,"engine.0.fuel.type");
	});
	
	myEmitter.on("21", function(temp){
		ObdSignalK(temp,"engine.0.MILDist");
	});
	
	myEmitter.on("1F", function(temp){
		ObdSignalK(temp, "engine.0.RunTimeSinceStart");
	});
	
	myEmitter.on("46", function(temp){
		ObdSignalK(temp, "engine.0.temperature.ambientAir");
	});
	
	myEmitter.on("2F", function(temp){
		ObdSignalK(temp, "engine.0.fuel.level");
	});
	
	OBDConnect.on("messageSignalK", function(bool, message){
		if(bool == false)
		  app.setPluginError(message);
		else
		  app.setPluginStatus(message);
	});
	
	app.debug('Plugin started');
};
  plugin.stop = function () {
    if (typeof OBDConnect !== 'undefined')
	OBDConnect.close();
    app.debug('Plugin stopped');
  };

  plugin.schema = {  
	type: 'object',
    properties: {
            device: {
              type: 'string',
              default: 'Serial',
              title: 'Select device',
              enum: [
                'Serial',
                'TCP',
              ],
            },
            SerialPath: {
              type: 'string',
              title: 'Serial Path',
              description: 'TCP: Ignored, Insert Serial Path of your device'
            },
            baudRate: {
				type: 'number',
				title: 'Baud Rate',
				description: 'TCP: Ignored, Insert Baud Rate'
			},
            IPAddress:{
				type: 'string',
				title: 'IPAddress',
				description: 'Serial: ignored, TCP:Insert IP Address'
			},
            port: {
              type: 'number',
              title: 'Port',
              description: 'Serial: ignored, TCP: port',
              default: 35000
            },
            vehicle: {
				type: 'string',
				default: 'vehicle',
				title: 'Select vehicle o vessel',
				enum:[
					'vehicle',
					'vessel'
				]
		      },
	    Interval: {
				type: "number",
				title: "Interval: ms",
				description: "Interval for polling",
				default: 1000
		      }
				
          }
  };
  
  plugin.uiSchema = {
	 //EMPTY
};
  return plugin;
};
