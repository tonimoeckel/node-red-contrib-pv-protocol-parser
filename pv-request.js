const {PVProtocolParser, PV_PARAMETERS} = require("pv-protocol-parser");
module.exports = function(RED) {
    RED.httpNode.get("/pv/parameters",(req, res) => {
        res.json(PV_PARAMETERS)
    })
    function PVProtocolNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {

            var slave = msg.slave || config.slave;
            var dataType = msg.dataType || config.dataType;
            var mode = config.mode;

            let writeData = "";
            if (config.writeType === "msg"){
                writeData = msg[config.write]
            }else {
                writeData = config.write
            }

            let pid = config.pid;
            if (config.pidType === "msg"){
                pid = msg[config.pid];
            }

            var response =  PVProtocolParser.buildRequestString(pid, {
                slave,
                mode: mode,
                dataType: dataType && dataType.length ? dataType : undefined,
                writeData
            });
            if (response){
                msg.payload = response
                msg.slave = slave
                msg.request = response;
            }

            node.send(msg);
        });
    }
    RED.nodes.registerType("pv-request",PVProtocolNode);
}
