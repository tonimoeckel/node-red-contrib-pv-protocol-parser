const {PVProtocolParser} = require("pv-protocol-parser");
module.exports = function(RED) {
    function PVProtocolNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            var response =  PVProtocolParser.parseResponse(msg.payload, {
                request: msg["request_payload"] || msg["request"]
            });
            if (response){
                msg.payload = response
            }

            node.send(msg);
        });
    }
    RED.nodes.registerType("pv-protocol",PVProtocolNode);
}
