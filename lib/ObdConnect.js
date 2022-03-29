const { SerialPort } = require('serialport');
const net = require('net');
const EventEmitter = require('events').EventEmitter;
const util = require('util');
var PIDS = require("./OBDPid.js");

/* Class OBD, with connection params.
 * MODE = 0 => Connection with serial port
 * MODE = 1 => Connection with TCP
 * */
var OBD = function(mode){
	if (mode === 0){
		this.mode = 0;
		this.serialPath = arguments[1];
		this.baudRate = arguments[2];
	}
	else{
		this.mode = 1;
		this.IPAddress = arguments[2];
		this.port = arguments[1];
	}
	this.lastPid;
	this.connected = false;
	
	return this;
};

util.inherits(OBD, EventEmitter);

var queue = new Array();

OBD.prototype.start = function() {
	var selfObd = this;
	if (this.mode === 0){
		this.conn = new SerialPort({path: this.serialPath, baudRate: this.baudRate});
		
		this.conn.on('open', function(){
			selfObd.sendATCommands();  //When SerialPort is opened, send AT commands to OBD II.
		});
		
		this.conn.on('error', function(){
			selfObd.removeQueue(); //clean queue
			selfObd.emit("messageSignalK",false,"Error Connect to " + selfObd.serialPath); //send message to signalk, false means error
			console.log("Error Connect to " + selfObd.serialPath);
		});
		
		this.conn.on('close', function(){
			selfObd.removeQueue(); //clean queue
			selfObd.emit("messageSignalK",false,"Close " + selfObd.serialPath); //send message to signalk, false means error
			console.log("Close " + selfObd.serialPath);
		});
		
		this.conn.on("data", function(data){
			selfObd.dataReceived(data);
		});
	}
	else {
		
        this.conn = new net.Socket();
        
        this.conn.connect(this.port,this.IPAddress);
		
		this.conn.on("ready", function(){ 
			selfObd.sendATCommands(); //When Socket is connected, send AT commands to OBD II
		});
        
		          
        this.conn.on("close", function() {
			selfObd.removeQueue();
            selfObd.emit("messageSignalK",false,"Connection close");
            console.log("Connection close");
        });
        
        this.conn.on("error", function(){
			selfObd.removeQueue();
           selfObd.emit("messageSignalK",false,"Wrong IP Address and Port");
           console.log("Wrong IP Address and Port");
        });
        
        this.conn.on("data", function(data){
            selfObd.dataReceived(data);
        });
	};
};

OBD.prototype.sendATCommands = function(){
	
	this.conn.write("ATE0" + "\r"); //echo off
	this.conn.write("ATL0" + "\r"); //Linefeeds off
	this.conn.write("ATS0" + "\r"); //Space off
	this.conn.write("ATSP0" + "\r"); // auto protocol
	/*this.conn.write("ATH0" + "\r");
	this.conn.write("ATST0A" + "\r");
	this.conn.write("ATAT2" + "\r");*/
	
	this.connected = true;
	
	this.emit("connected");
	
	this.emit("messageSignalK", true,"Done inizializing, connected!");
};

/* 
 * Convert data into utf8
 * Split data into substrings.
 * */
OBD.prototype.dataReceived= function(data){
	var self = this; 
	data = data.toString("utf8");
	var arr = data.split(">");
	var temp;
	for(item in arr){
		if(arr[item] != ""){
			arr_temp = (arr[item].split("\r"));
			for(index in arr_temp){
				if(arr_temp[index] != ""){
					self.parser(arr_temp[index]);
				}
			}
					
		}
	};

};

//Parse data from OBD II.
OBD.prototype.parser = function(data){
	//EXAMPLE DATA "414643"
	var substrings;
	var bytes;
	var value={};
	if(data === "NO DATA"){
		value.pid = this.lastPid;
		value.val = data;
		this.emit("dataSignalK", value);
	}
	else if(data !==  "OK" && data !== "ATE0") {
		substrings = data.match(/.{2}/g); //split string into two-character substrings, example: "414643" => { "41", "46", "43" }
		if (substrings.at(0) == "41"){
				value.pid = substrings.at(1); //Second substring is always PID command
				bytes = PIDS.get(substrings.at(1)).bytes; //Get number of bytes from structure data MAP, exported from OBDPid.js
				switch(bytes){
					case 1:
						value.val = PIDS.get(substrings.at(1)).convertFunction(substrings.at(2));
						break;
					case 2:
						value.val = PIDS.get(substrings.at(1)).convertFunction(substrings.at(2),substrings.at(3));
						break;
					case 4: 
						value.val = PIDS.get(substrings.at(1)).convertFunction(substrings.at(2),substrings.at(3),substrings.at(4),substring.at(5));
						break;
					case 8:
						value.val = PIDS.get(substrings.at(1)).convertFunction(substrings.at(2),substrings.at(3),substrings.at(4),substring.at(5), substrings.at(6), substrings.at(7),substring.at(8),substrings.at(9));
						break;
				};
				this.emit("dataSignalK", value); //Send value to signalK
		}
	}
	
};

//CLOSE CONNECTION - this function is called when the Signalk-plugin stopped.
OBD.prototype.close = function(){
	this.removeQueue(); //clear queue
	// Close connection 
	if(this.mode == 0){
			this.conn.close();
	}
	else{
		this.conn.destroy();
	};
};

//Write Pid command to OBD. We use only mode "01" for reading data.
OBD.prototype.writeToOBD = function(pid){
	
	if (this.connected){
		this.lastPid = pid;
		pid = "01" + pid;
		this.conn.write(pid + "\r");
	}
	else {
		console.log("NOT CONNECTED");
	};
		
};

//Add Pid into a queue for polling.
OBD.prototype.addQueue = function(pids){
	if (Array.isArray(pids)){
		for(const pid of pids){
			queue.push(pid);
		};
	}
	else
		queue.push(pids);
};

var start;

//After added into queue, start polling.
OBD.prototype.startQueue = function(ms){
	var self = this;
	if(ms == undefined){
		ms = 4000;
	};
	start = setInterval(function(){
		for(var i=0; i<queue.length; i++){
			self.writeToOBD(queue.at(i));
		};
	},ms);
};

//Remove queue when close connection.
OBD.prototype.removeQueue = function(){
	if(queue.length > 0){
		queue = [];
		clearInterval(start);
		console.log("clear queue");
	};
};
	
module.exports = OBD;
	
		
		
		
	
