const {PVProtocolParser} = require("pv-protocol-parser");
module.exports = function(RED) {
    function PVProtocolNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            var request = msg["request_payload"] || msg["request"];
            if (!request){
                console.warn("No request found");
                return;
            }
            var response =  PVProtocolParser.parseResponse(msg.payload, {
                request
            });
            if (response){
                console.log("Response",msg.payload.length,request.length )
                msg.payload = response
                node.send(msg);
            }else {
                console.log("No response",msg.payload.length,request.length )
            }

        });
    }
    RED.nodes.registerType("pv-protocol",PVProtocolNode);
}
