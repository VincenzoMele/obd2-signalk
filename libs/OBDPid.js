const functions = require("./OBDConvert.js");

var PIDS = new Map();

PIDS.set("0D", {bytes: 1, description: "Vehicle Speed", unit: "km/h", convertFunction: functions.decodeSpeed});
PIDS.set("0C", {bytes: 2, description: "RPM", unit: "rev/min", convertFunction: functions.decodeRPM});
PIDS.set("05", {bytes: 1, description: "Coolant Temperature", unit: "Celsius", convertFunction: functions.decodeTemp});
PIDS.set("03", {bytes: 2, description: "Fuel 1 and 2", convertFunction: functions.decodeFuelSys});
PIDS.set("04", {bytes: 2, description: "LOAD Value", unit: "%", convertFunction: functions.decodeLoad});
PIDS.set("0B", {bytes: 1, description: "Intake Manifold Absolute Pressure",unit: "kPa", convertFunction: functions.decodeIntakePressure});
PIDS.set("0F", {bytes: 1, description: "Intake Air Temperature", unit: "Celsius", convertFunction: functions.decodeTemp});
PIDS.set("11", {bytes: 1, description: "Absolute Throttle Position", unit: "%", convertFunction: functions.decodeThrottlePos});
PIDS.set("21", {bytes: 2, description: "Distance Travelled While MIL is Activated", unit: "km", convertFunction: functions.decodeMilDist});
PIDS.set("1F", {bytes: 2, description: "Time Since Engine Start",unit: "seconds", convertFunction: functions.decodeMilDist});
PIDS.set("46", {bytes: 1, description: "Ambient air temperature", unit: "Celsius", convertFunction: functions.decodeTemp});
PIDS.set("51", {bytes: 1, description: "Fuel Type", unit: "object", convertFunction: functions.decodeFuelType});
PIDS.set("2F", {bytes: 1, description: "Fuel level", unit: "%", convertFunction: functions.decodeFuelLevel});

module.exports = PIDS;
	

	
	
