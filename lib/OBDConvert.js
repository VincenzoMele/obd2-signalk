module.exports = {
decodeSpeed: function(byte) {
    return parseInt(byte, 16);
},

decodeRPM: function(byteA, byteB) {
    return ((parseInt(byteA, 16) * 256) + parseInt(byteB, 16)) / 4;
},

decodeTemp: function(byte) {
    return parseInt(byte, 16) - 40;
},

decodeFuelSys: function(byteA, byteB){
    let obj = {
        codeFuel1: 0,
        descriptionFuel1: "NULL", 
        codeFuel2: -1,
        descriptionFuel2: "NULL"
    };
    let value = parseInt(byteA, 16);
    switch (value) {
        case 0:
            obj.codeFuel1 = value;
            obj.descriptionFuel1 = "Motor is off";
            //return ({code: value, description: "Motor is off"});
            break;
        case 1:
            obj.codeFuel1 = value;
            obj.descriptionFuel1 = "Open loop, using oxygen sensor feedback to determine duel mix";
            //return({code: value, description: "Open loop, using oxygen sensor feedback to determine duel mix"});
            break;
        case 2:
            obj.codeFuel1 = value;
            obj.descriptionFuel1 = "Closed loop, using oxygen sensor feedback to determine fuel mix";
            //return({code: value, description: "Closed loop, using oxygen sensor feedback to determine fuel mix"});
            break;
        case 4:
            obj.codeFuel1 = value;
            obj.descriptionFuel1 = "Open loop due to engine load OR fuel cut due to deceleration";
            //return({code: value, description: "Open loop due to engine load OR fuel cut due to deceleration"});
            break;
        case 8:
            obj.codeFuel1 = value;
            obj.descriptionFuel1 = "Open loop due to system failure";
            //return({code: value, description: "Open loop due to system failure"});
            break;
        case 16:
            obj.codeFuel1 = value;
            obj.descriptionFuel1 = "Closed loop, using at least one oxygen sensor but there is a fault in the feedback system";
            //return({code: value, description: "Closed loop, using at least one oxygen sensor but there is a fault in the feedback system"});
            break;
         default:
            obj.codeFuel1 = value;
            obj.descriptionFuel1 = "ERROR CODE";
            //return({code: value, description: "ERROR CODE"});
    };
    if(arguments.lenght == 2) {
        var value1 = parseInt(byteB, 16);
        switch (value1) {
        case 0:
            obj.codeFuel2 = value1;
            obj.descriptionFuel2 = "Motor is off";
            //return ({code: value, description: "Motor is off"});
            break;
        case 1:
            obj.codeFuel2 = value1;
            obj.descriptionFuel2 = "Open loop, using oxygen sensor feedback to determine duel mix";
            //return({code: value, description: "Open loop, using oxygen sensor feedback to determine duel mix"});
            break;
        case 2:
            obj.codeFuel2 = value1;
            obj.descriptionFuel2 = "Closed loop, using oxygen sensor feedback to determine fuel mix";
            //return({code: value, description: "Closed loop, using oxygen sensor feedback to determine fuel mix"});
            break;
        case 4:
            obj.codeFuel2 = value1;
            obj.descriptionFuel2 = "Open loop due to engine load OR fuel cut due to deceleration";
            //return({code: value, description: "Open loop due to engine load OR fuel cut due to deceleration"});
            break;
        case 8:
            obj.codeFuel2 = value1;
            obj.descriptionFuel2 = "Open loop due to system failure";
            //return({code: value, description: "Open loop due to system failure"});
            break;
        case 16:
            obj.codeFuel2 = value1;
            obj.descriptionFuel2 = "Closed loop, using at least one oxygen sensor but there is a fault in the feedback system";
            //return({code: value, description: "Closed loop, using at least one oxygen sensor but there is a fault in the feedback system"});
            break;
         default:
            obj.codeFuel2 = value1;
            obj.descriptionFuel2 = "ERROR CODE";
            //return({code: value, description: "ERROR CODE"});
        };
    };
    return obj;
},

decodeLoad: function(byte) {
    return parseInt(byte, 16) * (100 / 256);
},

decodeIntakePressure: function(byte) {
    return parseInt(byte, 16);
},

decodeThrottlePos: function(byte) {
    return parseInt(byte, 16) * (100 / 255);
},

decodeMilDist: function(byteA, byteB){
    var value1 = parseInt(byteA, 16);
    var value2 = parseInt(byteB, 16);
    
    return (256*value1)+value2;
},

decodeFuelType: function(byte){
    var value = parseInt(byte, 16);
    switch(value){
        case 0:
            return({code: value, description: "Not Avaible"});
            break;
        case 1:
            return({code: value, description: "Gasoline"});
            break;
        case 2:
            return({code: value, description: "Methanol"});
            break;
        case 3:
            return({code: value, description: "Ethanol"});
            break;
        case 4:
            return({code: value, description: "Diesel"});
            break;
        case 5:
            return({code: value, description: "Liquefied petroleum gas"});
            break;
        case 6:
            return({code: value, description: "Compressed natural gas"});
            break;
        case 7:
            return({code: value, description: "Propane"});
            break;
        case 8:
            return({code: value, description: "Electric"});
            break;
        case 9:
            return({code: value, description: "Bifuel running Gasoline"});
            break;
        case 10:
            return({code: value, description: "Bifuel running Methanol"});
            break;
        case 11:
            return({code: value, description: "Bifuel running Ethanol"});
            break;
        case 12:
            return({code: value, description: "Bifuel Liquefied petroleum gas"});
            break;
        case 13:
            return({code: value, description: "Bifuel Compressed natural gas"});
            break;
        case 14:
            return({code: value, description: "Bifuel running propane"});
            break;
        case 15:
            return({code: value, description: "Bifuel running electricity"});
            break;
        case 16:
            return({code: value, description: "Bifuel running electric and combustion engine"});
            break;
        case 17:
            return ({code: value, description: "Hybrid gasoline"});
            break;
        case 18:
            return ({code: value, description: "Hybrid Ethanol"});
            break;
        case 19:
            return ({code: value, description: "Hybrid Diesel"});
            break;
        case 20:
            return ({code: value, description: "Hybrid Electric"});
            break;
        case 21:
            return ({code: value, description: "Hybrid running electric and combustion engine"});
            break;
        case 22:
            return ({code: value, description: "Hybrid regenerative"});
            break;
        case 23:
            return ({code: value, description: "Bifuel running diesel"});
            break;
        default:
            return({code: -1, description: "ERROR CODE"});
    };
},

decodeFuelLevel: function(byte){
    let value = parseInt(byte, 16);
    return (100/255)*value;
}
};
