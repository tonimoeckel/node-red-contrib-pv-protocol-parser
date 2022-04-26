var PVProtocolOptionID;
(function (PVProtocolOptionID) {
    PVProtocolOptionID["OnOff"] = "OnOff";
    PVProtocolOptionID["YesNo"] = "YesNo";
    PVProtocolOptionID["ConfigurationOutput"] = "ConfigurationOutput";
    PVProtocolOptionID["RotationSpeedSwitch"] = "RotationSpeedSwitch";
    PVProtocolOptionID["ConfigurationOutputAO"] = "ConfigurationOutputAO";
    PVProtocolOptionID["Ctrl"] = "Ctrl";
    PVProtocolOptionID["OperationMode"] = "OperationMode";
    PVProtocolOptionID["GasMode"] = "GasMode";
    PVProtocolOptionID["VentingMode"] = "VentingMode";
    PVProtocolOptionID["OnOffAccessory"] = "OnOffAccessory";
    PVProtocolOptionID["ConfigurationAccess"] = "ConfigurationAccess";
})(PVProtocolOptionID || (PVProtocolOptionID = {}));
var PfeifferDataTypeID;
(function (PfeifferDataTypeID) {
    PfeifferDataTypeID["int"] = "int";
    PfeifferDataTypeID["float"] = "float";
    PfeifferDataTypeID["string"] = "string";
    PfeifferDataTypeID["string8"] = "string8";
    PfeifferDataTypeID["string16"] = "string16";
    PfeifferDataTypeID["boolean"] = "boolean";
    PfeifferDataTypeID["boolean_old"] = "boolean_old";
    PfeifferDataTypeID["u_short_int"] = "u_short_int";
    PfeifferDataTypeID["u_integer"] = "u_integer";
    PfeifferDataTypeID["u_real"] = "u_real";
    PfeifferDataTypeID["u_expo_new"] = "u_expo_new";
    PfeifferDataTypeID["u_expo"] = "u_expo";
    PfeifferDataTypeID["boolean_new"] = "boolean_new";
})(PfeifferDataTypeID || (PfeifferDataTypeID = {}));
var PfeifferFormatID;
(function (PfeifferFormatID) {
    PfeifferFormatID["exponential"] = "exponential";
})(PfeifferFormatID || (PfeifferFormatID = {}));

class SerialLinkDataParser {
    static reduceParametersForResponse(parameters, input, mode = "r") {
        return parameters.reduce((acc, cur) => {
            acc[cur.id] = SerialLinkDataParser.parseParameterForResponse(cur, input, mode);
            return acc;
        }, {});
    }
    static parseParameterForResponse(parameter, input, mode = "r") {
        if (!input || !input.length) {
            return null;
        }
        let result;
        const length = parameter.length || input.length - parameter.startPosition;
        const resultString = input.slice(parameter.startPosition, parameter.startPosition + length).toString();
        if (typeof parameter.parseResponse === "function") {
            result = parameter.parseResponse(resultString, mode, parameter);
        }
        else if (parameter.bitMaskValue) {
            /**
             * 100001000000001
             * 100000000000001
             * & sets each bit to 1 if both bits are 1
             */
            const bitValue = Number.parseInt(resultString);
            result = bitValue & parameter.bitMaskValue;
            result = !!Number.parseInt(result.toString());
        }
        else {
            switch (parameter.dataType) {
                case PfeifferDataTypeID.boolean:
                    result = !!Number.parseInt(resultString);
                    break;
                case PfeifferDataTypeID.float:
                    result = Number.parseFloat(resultString);
                    break;
                case PfeifferDataTypeID.int:
                    result = Number.parseInt(resultString);
                    break;
                default:
                    result = resultString;
                    break;
            }
        }
        return result;
    }
}

/**

 STA
 #adrSTA<CR>
 #adr,sss,rrrrr,vvv,www,xxx,yyy,zzz,aa,bbbbb,ccc,ddd,ggggggggggggggggggggggggg<CR>
 #000,���,    0,  0,  0,  0,  0,  0,69,    0,  0, 25,0000000200000000002200000
 01234567890123456789012345678901234567890123456789012345678901234567890123456
 0         10        20        30        40        50        60        70
 */
const MAGPOWER_STA_CONFIG = [
    {
        id: "POWER",
        name: "Power",
        command: "STA",
        description: "",
        startPosition: 5,
        length: 3,
        options: PVProtocolOptionID.OnOff,
        bitMaskValue: 0b1,
        dataType: PfeifferDataTypeID.boolean,
        access: "r",
        min: 0,
        max: 1,
        default: 0
    },
    {
        id: "START",
        name: "Start",
        command: "STA",
        description: "",
        startPosition: 5,
        length: 3,
        bitMaskValue: 0b10,
        options: PVProtocolOptionID.OnOff,
        dataType: PfeifferDataTypeID.boolean,
        access: "r",
        min: 0,
        max: 1,
        default: 0
    },
    {
        id: "ACCELERATING",
        name: "Accelerating",
        command: "STA",
        description: "",
        startPosition: 5,
        length: 3,
        bitMaskValue: 0b100,
        options: PVProtocolOptionID.OnOff,
        dataType: PfeifferDataTypeID.boolean,
        access: "r",
        min: 0,
        max: 1,
        default: 0
    },
    {
        id: "NOM_SPEED_TEMP",
        name: "Nom.speed and Temp",
        command: "STA",
        description: "",
        startPosition: 5,
        length: 3,
        bitMaskValue: 0b1000,
        options: PVProtocolOptionID.YesNo,
        dataType: PfeifferDataTypeID.boolean,
        access: "r",
        min: 0,
        max: 1,
        default: 0
    },
    {
        id: "BRAKING",
        name: "Braking",
        command: "STA",
        description: "",
        startPosition: 5,
        length: 3,
        bitMaskValue: 0b10000,
        options: PVProtocolOptionID.YesNo,
        dataType: PfeifferDataTypeID.boolean,
        access: "r",
        min: 0,
        max: 1,
        default: 0
    },
    {
        id: "WARNING_TEMP",
        name: "Warning temp",
        command: "STA",
        description: "",
        startPosition: 5,
        length: 3,
        bitMaskValue: 0b100000,
        options: PVProtocolOptionID.YesNo,
        dataType: PfeifferDataTypeID.boolean,
        access: "r",
        min: 0,
        max: 1,
        default: 0
    },
    {
        id: "FAULT",
        name: "Fault",
        command: "STA",
        description: "",
        startPosition: 5,
        length: 3,
        bitMaskValue: 0b1000000,
        options: PVProtocolOptionID.YesNo,
        dataType: PfeifferDataTypeID.boolean,
        access: "r",
        min: 0,
        max: 1,
        default: 0
    },
    {
        id: "SPEED",
        name: "Speed",
        command: "STA",
        description: "Returns the current speed",
        startPosition: 9,
        length: 5,
        unit: 'rpm',
        dataType: PfeifferDataTypeID.int,
        access: "r"
    },
    {
        id: "MOTOR_VOLTAGE",
        name: "Motor voltage",
        command: "STA",
        description: "Motor voltage in V",
        startPosition: 35,
        length: 2,
        unit: 'V',
        dataType: PfeifferDataTypeID.int,
        access: "r"
    },
    {
        id: "MOTOR_CURRENT",
        name: "Motor current",
        command: "STA",
        description: "Motor current mA",
        startPosition: 38,
        length: 5,
        unit: 'mA',
        dataType: PfeifferDataTypeID.int,
        access: "r"
    },
    {
        id: "PUMP_TEMP",
        name: "Pump temp",
        command: "STA",
        description: "Pump temp (°C)",
        startPosition: 44,
        length: 3,
        unit: '°C',
        dataType: PfeifferDataTypeID.int,
        access: "r"
    },
    {
        id: "CONTROLLER_TEMP",
        name: "Controller temp",
        command: "STA",
        description: "Controller temp (°C)",
        startPosition: 48,
        length: 3,
        unit: '°C',
        dataType: PfeifferDataTypeID.int,
        access: "r"
    },
    {
        id: "RADIAL_XH",
        name: "Radial Xh",
        command: "STA",
        description: "Radial Xh",
        startPosition: 15,
        length: 3,
        dataType: PfeifferDataTypeID.int,
        access: "r"
    },
    {
        id: "RADIAL_YH",
        name: "Radial Yh",
        command: "STA",
        description: "Radial Yh",
        startPosition: 19,
        length: 3,
        dataType: PfeifferDataTypeID.int,
        access: "r"
    },
    {
        id: "RADIAL_XB",
        name: "Radial Xb",
        command: "STA",
        description: "Radial Xb",
        startPosition: 23,
        length: 3,
        dataType: PfeifferDataTypeID.int,
        access: "r"
    },
    {
        id: "RADIAL_YB",
        name: "Radial Yb",
        command: "STA",
        description: "Radial Yb",
        startPosition: 27,
        length: 3,
        dataType: PfeifferDataTypeID.int,
        access: "r"
    },
    {
        id: "AXIAL_Z",
        name: "Axial Z",
        command: "STA",
        description: "Axial Z",
        startPosition: 31,
        length: 3,
        dataType: PfeifferDataTypeID.int,
        access: "r"
    },
];
function parseMagpowerSTA(input) {
    return SerialLinkDataParser.reduceParametersForResponse(MAGPOWER_STA_CONFIG, input);
}

/**

 STA
 #adrSTA<CR>[<LF>]
 #adr,ABCDEFGHIJK,L123,M123,N12,O12,P12,Q123,R1,abcdefghijklmnopqrstu,S123<CR><LF>
 0         10        20        30        40        50        60        70        80
 0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567
 */
const M4_STA_CONFIG = [
    {
        id: "PUMP_RUNNING",
        name: "Pump Running",
        command: "STA",
        description: "",
        startPosition: 5,
        length: 1,
        dataType: PfeifferDataTypeID.boolean,
        access: "r",
        min: 0,
        max: 1,
        default: 1
    },
    {
        id: "ROOTS_RUNNING",
        name: "Roots Running",
        command: "STA",
        description: "",
        startPosition: 6,
        length: 1,
        dataType: PfeifferDataTypeID.boolean,
        access: "r",
        min: 0,
        max: 1,
        default: 1
    },
    {
        id: "N2_VALVE",
        name: "N2 Valve Opened",
        command: "STA",
        description: "",
        startPosition: 7,
        length: 1,
        dataType: PfeifferDataTypeID.boolean,
        access: "r",
        min: 0,
        max: 1,
        default: 1
    },
    {
        id: "STDBY_VALVE",
        name: "Stand By Valve Opened",
        command: "STA",
        description: "",
        startPosition: 8,
        length: 1,
        dataType: PfeifferDataTypeID.boolean,
        access: "r",
        min: 0,
        max: 1,
        default: 1
    },
    {
        id: "WATER_VALVE",
        name: "Water Valve Opened",
        command: "STA",
        description: "",
        startPosition: 9,
        length: 1,
        dataType: PfeifferDataTypeID.boolean,
        access: "r",
        min: 0,
        max: 1,
        default: 1
    },
    {
        id: "INLET_VALVE",
        name: "Inlet Valve Opened",
        command: "STA",
        description: "",
        startPosition: 10,
        length: 1,
        dataType: PfeifferDataTypeID.boolean,
        access: "r",
        min: 0,
        max: 1,
        default: 1
    },
    {
        id: "PERMIT_VALVE",
        name: "Permit Valve Opened",
        command: "STA",
        description: "",
        startPosition: 11,
        length: 1,
        dataType: PfeifferDataTypeID.boolean,
        access: "r",
        min: 0,
        max: 1,
        default: 1
    },
    {
        id: "FB_POWER",
        name: "FB Power",
        command: "STA",
        description: "",
        unit: "W",
        startPosition: 22,
        length: 4,
        dataType: PfeifferDataTypeID.int,
        access: "r",
        min: 0,
        max: 5000,
        default: 0
    }, {
        id: "PRESSURE",
        name: "Pressure",
        command: "STA",
        description: "",
        unit: "mbar",
        startPosition: 17,
        length: 4,
        dataType: PfeifferDataTypeID.int,
        access: "r",
        min: 500,
        max: 1990,
        default: 0
    },
    {
        id: "LP_FB_TEMP",
        name: "FB Temperature",
        command: "STA",
        description: "",
        unit: "°C",
        startPosition: 27,
        length: 3,
        dataType: PfeifferDataTypeID.int,
        access: "r",
        min: 0,
        max: 170,
        default: 0
    }, {
        id: "HP_FB_TEMP",
        name: "Roots Temperature",
        command: "STA",
        description: "",
        unit: "°C",
        startPosition: 31,
        length: 3,
        dataType: PfeifferDataTypeID.int,
        access: "r",
        min: 0,
        max: 170,
        default: 0
    }, {
        id: "AUX_TEMP",
        name: "AUX Temperature",
        command: "STA",
        description: "",
        unit: "°C",
        startPosition: 35,
        length: 3,
        dataType: PfeifferDataTypeID.int,
        access: "r",
        min: 0,
        max: 170,
        default: 0
    }, {
        id: "ANALOG_INPUT",
        name: "Analog input",
        command: "STA",
        description: "",
        unit: "mV",
        startPosition: 39,
        length: 4,
        dataType: PfeifferDataTypeID.int,
        access: "r",
        min: 0,
        max: 9950,
        default: 0
    }, {
        id: "MFS",
        name: "MFS",
        command: "STA",
        description: "",
        unit: "slm",
        startPosition: 44,
        length: 2,
        dataType: PfeifferDataTypeID.int,
        access: "r",
        min: 0,
        max: 99,
        default: 0
    },
    {
        id: "MAINTENANCE_FAULT",
        name: "Maintenance Fault",
        command: "STA",
        description: "",
        startPosition: 60,
        length: 1,
        dataType: PfeifferDataTypeID.int,
        access: "r",
        min: 0,
        max: 1,
        default: 1
    },
    {
        id: "FAULT",
        name: "Fault",
        command: "STA",
        description: "",
        startPosition: 60,
        length: 1,
        dataType: PfeifferDataTypeID.int,
        access: "r",
        min: 0,
        max: 1,
        default: 1
    }
];
function parseM4STA(input) {
    return SerialLinkDataParser.reduceParametersForResponse(M4_STA_CONFIG, input);
}

const MAGPOWER_IDN_CONFIG = [
    {
        id: "SOFTWARE_VERSION",
        name: "Software Version",
        command: "IDN",
        description: "Vx.zz - The software Version (x), the software edition (zz)",
        startPosition: 5,
        dataType: PfeifferDataTypeID.string,
        access: "r"
    }
];
function parseMagpowerIDN(input) {
    return SerialLinkDataParser.reduceParametersForResponse(MAGPOWER_IDN_CONFIG, input);
}

const PV_PARAMETERS = [
    {
        id: "001",
        name: "Heating",
        description: "Standby",
        dataType: PfeifferDataTypeID.boolean_old,
        access: "rw",
        options: PVProtocolOptionID.OnOff,
        min: 0,
        max: 1,
        default: 0
    },
    {
        id: "002",
        name: "Standby",
        description: "Standby",
        dataType: PfeifferDataTypeID.boolean_old,
        access: "rw",
        options: PVProtocolOptionID.OnOff,
        min: 0,
        max: 1,
        default: 0
    },
    {
        id: "004",
        name: "RUTimeCtrl",
        description: "Run-up time control",
        dataType: PfeifferDataTypeID.boolean_old,
        access: "rw",
        options: PVProtocolOptionID.OnOff,
        min: 0,
        max: 1,
        default: 1
    },
    {
        id: "006",
        name: "Auto-Stdby",
        description: "automatisches Standby",
        dataType: PfeifferDataTypeID.boolean_old,
        access: "rw",
        options: PVProtocolOptionID.OnOff,
        min: 0,
        max: 1,
        default: 0
    },
    {
        id: "009",
        name: "ErrorAckn",
        description: "Störungsquittierung",
        dataType: PfeifferDataTypeID.boolean_old,
        access: "w",
        min: 1,
        max: 1,
    },
    {
        id: "010",
        name: "PumpgStatn",
        description: "Pumpstand",
        dataType: PfeifferDataTypeID.boolean_old,
        access: "rw",
        options: PVProtocolOptionID.OnOff,
        min: 0,
        max: 1,
        default: 0,
    },
    {
        id: "011",
        name: "Auto-Boost",
        description: "automatischer Boostbetrieb",
        dataType: PfeifferDataTypeID.boolean_old,
        access: "rw",
        options: PVProtocolOptionID.OnOff,
        min: 0,
        max: 1,
        default: 0
    },
    {
        id: "012",
        name: "EnableVent",
        description: "Enable venting",
        dataType: PfeifferDataTypeID.boolean_old,
        access: "rw",
        options: PVProtocolOptionID.YesNo,
        min: 0,
        max: 1,
        default: 0
    },
    {
        id: "017",
        name: "CfgSpdSwPt",
        description: "Configuration rotation speed switch point",
        dataType: PfeifferDataTypeID.boolean_old,
        access: "rw",
        options: PVProtocolOptionID.RotationSpeedSwitch,
        min: 0,
        max: 1,
        default: 0
    },
    {
        id: "019",
        name: "Cfg DO2",
        description: "Konfiguration Ausgang DO2",
        dataType: PfeifferDataTypeID.u_short_int,
        access: "rw",
        options: PVProtocolOptionID.ConfigurationOutput,
        min: 0,
        max: 21,
        default: 5
    },
    {
        id: "020",
        name: "PressMode",
        description: "Druckregelung",
        dataType: PfeifferDataTypeID.boolean_old,
        access: "rw",
        options: PVProtocolOptionID.OnOff,
        min: 0,
        max: 1,
        default: 0
    },
    {
        id: "023",
        name: "MotorPump",
        description: "Motor pump",
        dataType: PfeifferDataTypeID.u_short_int,
        access: "rw",
        options: PVProtocolOptionID.OnOff,
        min: 0,
        max: 1,
        default: 1
    },
    {
        id: "024",
        name: "Cfg DO1",
        description: "Konfiguration Ausgang DO1",
        dataType: PfeifferDataTypeID.u_short_int,
        access: "rw",
        options: PVProtocolOptionID.ConfigurationOutput,
        min: 0,
        max: 21,
        default: 21
    },
    {
        id: "025",
        name: "OpMode BKP",
        description: "Operation mode backing pump",
        dataType: PfeifferDataTypeID.u_short_int,
        access: "rw",
        options: PVProtocolOptionID.OperationMode,
        min: 0,
        max: 3,
        default: 0
    },
    {
        id: "026",
        name: "SpdSetMode",
        description: "Rotation speed setting mode",
        dataType: PfeifferDataTypeID.u_short_int,
        options: PVProtocolOptionID.OnOff,
        access: "rw",
        min: 0,
        max: 1,
        default: 0
    },
    {
        id: "027",
        name: "GasMode",
        description: "Drehzahlstellbetrieb",
        dataType: PfeifferDataTypeID.u_short_int,
        access: "rw",
        options: PVProtocolOptionID.GasMode,
        min: 0,
        max: 2,
        default: 0
    },
    {
        id: "030",
        name: "VentMode",
        description: "Venting mode",
        dataType: PfeifferDataTypeID.u_short_int,
        access: "rw",
        options: PVProtocolOptionID.VentingMode,
        min: 0,
        max: 2,
        default: 0
    },
    {
        id: "034",
        name: "Auto-Start",
        description: "automatischer Start nach Netzausfall",
        dataType: PfeifferDataTypeID.boolean_old,
        access: "rw",
        min: 0,
        max: 1,
        default: 0
    },
    {
        id: "035",
        name: "Cfg Acc A1",
        description: "Configuration accessory connection A1",
        dataType: PfeifferDataTypeID.u_short_int,
        access: "rw",
        options: PVProtocolOptionID.ConfigurationAccess,
        min: 0,
        max: 14,
        default: 0
    },
    {
        id: "036",
        name: "Cfg Acc B1",
        description: "Configuration accessory connection B1",
        dataType: PfeifferDataTypeID.u_short_int,
        access: "rw",
        options: PVProtocolOptionID.ConfigurationAccess,
        min: 0,
        max: 14,
        default: 1
    },
    {
        id: "037",
        name: "Cfg Acc A2",
        description: "Configuration accessory connection A2",
        dataType: PfeifferDataTypeID.u_short_int,
        access: "rw",
        options: PVProtocolOptionID.ConfigurationAccess,
        min: 0,
        max: 14,
        default: 3
    },
    {
        id: "038",
        name: "Cfg Acc B2",
        description: "Configuration accessory connection B2",
        dataType: PfeifferDataTypeID.u_short_int,
        access: "rw",
        options: PVProtocolOptionID.ConfigurationAccess,
        min: 0,
        max: 14,
        default: 2
    },
    {
        id: "041",
        name: "Press1HVen",
        description: "Configuration accessory connection B2",
        dataType: PfeifferDataTypeID.u_short_int,
        access: "rw",
        options: PVProtocolOptionID.OnOffAccessory,
        min: 0,
        max: 3,
        default: 2
    },
    {
        id: "050",
        name: "SealingGas",
        description: "Sealing gas",
        dataType: PfeifferDataTypeID.u_short_int,
        access: "rw",
        options: PVProtocolOptionID.OnOff,
        min: 0,
        max: 1,
        default: 0
    },
    {
        id: "052",
        name: "BalGasValv",
        description: "Steuerung Gasballastventil",
        dataType: PfeifferDataTypeID.boolean_old,
        access: "rw",
        min: 0,
        max: 1,
        default: 0
    },
    {
        id: "055",
        name: "Cfg AO1",
        description: "Configuration output AO1",
        dataType: PfeifferDataTypeID.u_short_int,
        options: PVProtocolOptionID.ConfigurationOutputAO,
        access: "rw",
        min: 0,
        max: 8,
        default: 0
    },
    {
        id: "060",
        name: "CtrlViaInt",
        description: "Control via interface",
        dataType: PfeifferDataTypeID.u_short_int,
        options: PVProtocolOptionID.Ctrl,
        access: "rw",
        min: 1,
        max: 255,
        default: "1"
    },
    {
        id: "061",
        name: "IntSelLckd",
        description: "Interface selection locked",
        dataType: PfeifferDataTypeID.boolean_old,
        access: "rw",
        options: PVProtocolOptionID.OnOff,
        min: 0,
        max: 1,
        default: 0
    },
    {
        id: "062",
        name: "Cfg DI1",
        description: "Configuration input DI1",
        dataType: PfeifferDataTypeID.u_short_int,
        access: "rw",
        min: 0,
        max: 5,
        default: 1
    },
    {
        id: "063",
        name: "Cfg DI2",
        description: "Configuration input DI2",
        dataType: PfeifferDataTypeID.u_short_int,
        access: "rw",
        min: 0,
        max: 5,
        default: 0
    },
    {
        id: "068",
        name: "Cfg Acc C1",
        description: "Configuration accessory connection C1",
        dataType: PfeifferDataTypeID.u_short_int,
        access: "rw",
        options: PVProtocolOptionID.ConfigurationAccess,
        min: 0,
        max: 14,
        default: 0
    },
    {
        id: "069",
        name: "Cfg Acc D1",
        description: "Configuration accessory connection D1",
        dataType: PfeifferDataTypeID.u_short_int,
        access: "rw",
        options: PVProtocolOptionID.ConfigurationAccess,
        min: 0,
        max: 14,
        default: 0
    },
    {
        id: "095",
        name: "FactorySet",
        description: "Werkseinstellungen",
        dataType: PfeifferDataTypeID.boolean_old,
        access: "rw",
        min: 0,
        max: 1,
        default: 0
    },
    {
        id: "300",
        name: "RemotePrio",
        description: "Remote priority",
        dataType: PfeifferDataTypeID.boolean_old,
        options: PVProtocolOptionID.YesNo,
        access: "r",
        min: 0,
        max: 1,
    },
    {
        id: "302",
        name: "RemotePrio",
        description: "Rotation speed switch point reached",
        dataType: PfeifferDataTypeID.boolean_old,
        options: PVProtocolOptionID.YesNo,
        access: "r",
        min: 0,
        max: 1,
    },
    {
        id: "303",
        name: "Error code",
        description: "Fehlercode",
        dataType: PfeifferDataTypeID.string,
        access: "r"
    },
    {
        id: "304",
        name: "OvTempElec",
        description: "Übertemperatur Antriebselektronik",
        dataType: PfeifferDataTypeID.boolean_old,
        options: PVProtocolOptionID.YesNo,
        access: "r",
        min: 0,
        max: 1,
    },
    {
        id: "305",
        name: "OvTempPump",
        description: "Übertemperatur Pumpe",
        dataType: PfeifferDataTypeID.boolean_old,
        options: PVProtocolOptionID.YesNo,
        access: "r",
        min: 0,
        max: 1,
    },
    {
        id: "306",
        name: "SetSpdAtt",
        description: "Target speed reached",
        dataType: PfeifferDataTypeID.boolean_old,
        options: PVProtocolOptionID.YesNo,
        access: "r",
        min: 0,
        max: 1,
    },
    {
        id: "307",
        name: "PumpAccel",
        description: "Pump accelerating",
        dataType: PfeifferDataTypeID.boolean_old,
        options: PVProtocolOptionID.YesNo,
        access: "r",
        min: 0,
        max: 1,
    },
    {
        id: "308",
        name: "SetRotSpd",
        description: "Solldrehzahl (Hz)",
        dataType: PfeifferDataTypeID.u_integer,
        access: "r",
        min: 0,
        max: 999999,
        simulateMin: 40,
        simulateMax: 40,
        unit: "Hz",
    },
    {
        id: "309",
        name: "ActualSpd",
        description: "Istdrehzahl (Hz)",
        dataType: PfeifferDataTypeID.u_integer,
        access: "r",
        min: 0,
        max: 999999,
        simulateMin: 39,
        simulateMax: 42,
        unit: "Hz"
    },
    {
        id: "310",
        name: "DrvCurrent",
        description: "Antriebsstrom",
        dataType: PfeifferDataTypeID.u_real,
        access: "r",
        min: 0,
        max: 9999.99,
        unit: "A"
    },
    {
        id: "311",
        name: "OpHrsPump",
        description: "Betriebsstunden Pumpe",
        dataType: PfeifferDataTypeID.u_integer,
        access: "r",
        min: 0,
        max: 65535,
        simulate: 60000,
        unit: "h"
    },
    {
        id: "312",
        name: "Fw version",
        simulate: "FW SIMULATION",
        description: "Softwareversion Antriebselektronik",
        dataType: PfeifferDataTypeID.string,
        access: "r",
    },
    {
        id: "313",
        name: "DrvVoltage",
        description: "Antriebsspannung",
        dataType: PfeifferDataTypeID.u_real,
        access: "r",
        min: 0,
        max: 9999.99,
        unit: "V"
    },
    {
        id: "314",
        name: "OpHrsElec",
        description: "Betriebsstunden Antriebselektronik",
        dataType: PfeifferDataTypeID.u_integer,
        access: "r",
        simulate: 61000,
        min: 0,
        max: 999999,
        unit: "h"
    },
    {
        id: "315",
        name: "Nominal Spd",
        description: "Nenndrehzahl (Hz)",
        dataType: PfeifferDataTypeID.u_integer,
        access: "r",
        simulate: 40,
        min: 0,
        max: 999999,
        unit: "Hz"
    },
    {
        id: "316",
        name: "DrvPower",
        description: "Antriebsleistung",
        dataType: PfeifferDataTypeID.u_integer,
        access: "r",
        simulate: 5,
        min: 0,
        max: 999999,
        unit: "W"
    },
    {
        id: "317",
        name: "MotoCurrent",
        description: "Motorstrom",
        dataType: PfeifferDataTypeID.u_real,
        access: "r",
        simulate: 5,
        min: 0,
        max: 999999,
        unit: "A"
    },
    {
        id: "319",
        name: "PumpCycles",
        description: "Pump cycles",
        dataType: PfeifferDataTypeID.u_integer,
        access: "r",
        min: 0,
        max: 65535
    },
    {
        id: "324",
        name: "TempPwrStg",
        description: "Temperatur Endstuf",
        dataType: PfeifferDataTypeID.u_integer,
        access: "r",
        min: 0,
        max: 999999,
        unit: "°C"
    },
    {
        id: "326",
        name: "TempElec",
        description: "Temperature electronics",
        dataType: PfeifferDataTypeID.u_integer,
        access: "r",
        min: 0,
        max: 999999,
        unit: "°C"
    },
    {
        id: "330",
        name: "TempPmpBot",
        description: "Temperature pump bottom part",
        dataType: PfeifferDataTypeID.u_integer,
        access: "r",
        min: 0,
        max: 999999,
        unit: "°C"
    },
    {
        id: "336",
        name: "AccelDecel",
        description: "Acceleration/deceleration",
        dataType: PfeifferDataTypeID.u_integer,
        access: "r",
        min: 0,
        max: 999999,
        unit: "rpm/s"
    },
    {
        id: "337",
        name: "SealGasFlw",
        description: "Sealing gas flow",
        dataType: PfeifferDataTypeID.u_integer,
        access: "r",
        min: 0,
        max: 999999,
        unit: "sccm"
    },
    {
        id: "340",
        name: "Pressure",
        description: "Actual pressure value (ActiveLine)",
        dataType: PfeifferDataTypeID.u_short_int,
        access: "r",
        min: 1E-10,
        max: 1E3,
        unit: 'hPa'
    },
    {
        id: "342",
        name: "TempBearng",
        description: "Temperature bearing",
        dataType: PfeifferDataTypeID.u_integer,
        access: "r",
        min: 0,
        max: 999999,
        unit: "°C"
    },
    {
        id: "346",
        name: "TempMotor",
        description: "Temperatur Motor",
        dataType: PfeifferDataTypeID.u_integer,
        access: "r",
        min: 0,
        max: 999999,
        unit: "°C"
    },
    {
        id: "349",
        name: "ElecName",
        simulate: "SIMULATION ElecName",
        description: "Bezeichnung Antriebselektronik",
        dataType: PfeifferDataTypeID.string,
        access: "r",
    },
    {
        id: "350",
        name: "Ctr Name",
        description: "Display and control panel: type",
        dataType: PfeifferDataTypeID.string,
        access: "r",
    },
    {
        id: "351",
        name: "Ctr Software",
        description: "Display and control panel: software version",
        dataType: PfeifferDataTypeID.string,
        access: "r",
    },
    {
        id: "354",
        name: "HW Version",
        description: "Hardware version",
        dataType: PfeifferDataTypeID.string,
        access: "r",
    },
    {
        id: "360",
        name: "ErrHist1",
        description: "Fehlercode Historie, Pos. 1",
        dataType: PfeifferDataTypeID.string,
        access: "r",
    },
    {
        id: "361",
        name: "ErrHist2",
        description: "Fehlercode Historie, Pos. 2",
        dataType: PfeifferDataTypeID.string,
        access: "r",
    },
    {
        id: "362",
        name: "ErrHist3",
        description: "Fehlercode Historie, Pos. 3",
        dataType: PfeifferDataTypeID.string,
        access: "r",
    },
    {
        id: "363",
        name: "ErrHist4",
        description: "Fehlercode Historie, Pos. 4",
        dataType: PfeifferDataTypeID.string,
        access: "r",
    },
    {
        id: "364",
        name: "ErrHist5",
        description: "Fehlercode Historie, Pos. 5",
        dataType: PfeifferDataTypeID.string,
        access: "r",
    },
    {
        id: "365",
        name: "ErrHist6",
        description: "Fehlercode Historie, Pos. 6",
        dataType: PfeifferDataTypeID.string,
        access: "r",
    },
    {
        id: "366",
        name: "ErrHist7",
        description: "Fehlercode Historie, Pos. 7",
        dataType: PfeifferDataTypeID.string,
        access: "r",
    },
    {
        id: "367",
        name: "ErrHist8",
        description: "Fehlercode Historie, Pos. 8",
        dataType: PfeifferDataTypeID.string,
        access: "r",
    },
    {
        id: "368",
        name: "ErrHist9",
        description: "Fehlercode Historie, Pos. 9",
        dataType: PfeifferDataTypeID.string,
        access: "r",
    },
    {
        id: "369",
        name: "ErrHist10",
        description: "Fehlercode Historie, Pos. 10",
        dataType: PfeifferDataTypeID.string,
        access: "r",
    },
    {
        id: "397",
        name: "SetRotSpd",
        description: "Solldrehzahl (1/min)",
        dataType: PfeifferDataTypeID.u_integer,
        access: "r",
        min: 0,
        max: 999999,
        unit: "rpm"
    },
    {
        id: "398",
        name: "ActualSpd",
        description: "Istdrehzahl (1/min)",
        dataType: PfeifferDataTypeID.u_integer,
        access: "r",
        min: 0,
        max: 999999,
        unit: "rpm"
    },
    {
        id: "399",
        name: "NominalSpd",
        description: "Nenndrehzahl (1/min)",
        dataType: PfeifferDataTypeID.u_integer,
        access: "r",
        min: 0,
        max: 999999,
        unit: "rpm"
    },
    {
        id: "707",
        name: "SpdSVal",
        description: "Vorgabe im Drehzahlstellbetrieb",
        dataType: PfeifferDataTypeID.u_real,
        access: "rw",
        min: 40,
        max: 100,
        default: "83",
        unit: "%"
    },
    {
        id: "717",
        name: "StdbySVal",
        description: "Vorgabe Drehzahl im Standby",
        dataType: PfeifferDataTypeID.u_real,
        access: "rw",
        min: 40,
        max: 100,
        default: 50,
        unit: "%"
    },
    {
        id: "730",
        name: "Press. Set",
        description: "Einschaltschwelle bei Auto-Standby / Zieldruck bei Druckregelun",
        dataType: PfeifferDataTypeID.u_expo_new,
        access: "rw",
        min: 0.01,
        max: 30.0,
        default: 20.0,
        unit: "hPa"
    },
    {
        id: "732",
        name: "Press. Rel",
        description: "Ausschaltschwelle bei Auto-Standby",
        dataType: PfeifferDataTypeID.u_expo_new,
        access: "rw",
        min: 1.0,
        max: 100.0,
        default: 20.0,
        unit: "hPa"
    },
    {
        id: "739",
        name: "PrsSn1Name",
        description: "Name Sensor 1",
        dataType: PfeifferDataTypeID.string,
        access: "r",
    },
    {
        id: "740",
        name: "Pressure 1",
        description: "Druckwert 1",
        dataType: PfeifferDataTypeID.u_expo_new,
        access: "rw",
        min: 1E-5,
        max: 1200.0,
        unit: "hPa"
    },
    {
        id: "742",
        name: "PrsCorrPi 1",
        description: "Korrekturfaktor 1",
        dataType: PfeifferDataTypeID.u_real,
        access: "rw",
        min: 0.1,
        max: 8.0,
    },
    {
        id: "797",
        name: "RS485Adr",
        description: "RS-485-Schnittstellenadresse",
        dataType: PfeifferDataTypeID.u_integer,
        access: "rw",
        min: 1,
        max: 255,
        default: "2"
    },
    {
        id: "738",
        name: "Gaugetype",
        description: "Typ Druckmessröhre",
        dataType: PfeifferDataTypeID.string,
        simulate: "SIMULATION",
        access: "rw"
    },
    {
        id: "794",
        name: "Activate Extended Mode",
        description: "Activate the extended parameter mode",
        dataType: PfeifferDataTypeID.u_short_int,
        simulate: 1,
        access: "rw",
        writeTime: 28,
    },
];

function u_expo_new(str) {
    if (str.length < 6)
        return null;
    const arr = [str.slice(0, 4), str.slice(4, 6)];
    const exp = parseInt(arr[1]) - 20;
    const real = arr[0].slice(0, 1) + "." + arr[0].slice(1);
    return Number(real + "E" + exp);
}
function stringToDataType(str, dataType) {
    switch (dataType) {
        case PfeifferDataTypeID.boolean_old:
            return str === "111111";
        case PfeifferDataTypeID.u_integer:
            return parseInt(str);
        case PfeifferDataTypeID.u_real:
            return parseFloat(str.slice(0, 4) + "." + str.slice(4, 6));
        case PfeifferDataTypeID.u_expo:
            return str.split('E').join('*10^');
        case PfeifferDataTypeID.boolean_new:
            return str === "1";
        case PfeifferDataTypeID.u_short_int:
            return parseInt(str);
        case PfeifferDataTypeID.u_expo_new:
            return u_expo_new(str);
        default:
            return str;
    }
}
function findParamById(id) {
    return PV_PARAMETERS.find((p) => p.id === id);
}
class PVDataParser {
    static parseForResponse(input) {
        if (!input || !input.length) {
            return null;
        }
        const funcCode = input.slice(5, 8);
        const len = input.slice(8, 10);
        const len_int = parseInt(len);
        const data = input.slice(10, 10 + len_int);
        const param = findParamById(funcCode);
        if (!param)
            return undefined;
        return {
            [param.name.replace(" ", "_")]: stringToDataType(data, param === null || param === void 0 ? void 0 : param.dataType),
        };
    }
}

function parsePVParameter(input) {
    return PVDataParser.parseForResponse(input);
}

const PVProtocolCatalog = [
    {
        "request": /[0-9]{10}=\?[0-9]{1,3}/,
        "products": [{
                id: "PVProtocol",
                parser: parsePVParameter
            }]
    },
    {
        "request": "IDN",
        "products": [{
                id: "MAGPOWER",
                parser: parseMagpowerIDN
            }]
    },
    {
        "request": "STA",
        "products": [
            {
                id: "MAGPOWER",
                length: 77,
                validator: (input) => {
                    return input.includes(",");
                },
                parser: parseMagpowerSTA
            },
            {
                id: "M4",
                length: 73,
                validator: (input) => {
                    return input.includes(",");
                },
                parser: parseM4STA
            },
            {
                id: "M6",
                length: 73,
                validator: (input) => {
                    return !input.includes(",");
                },
                parser: parseM4STA
            }
        ]
    }
];

class PVProtocolParser {
    static buildRequestString(pid, opt) {
        const paramId = String(pid).padStart(3, '0');
        const parameter = PV_PARAMETERS.find((p) => {
            return p.id === paramId || p.id === pid;
        });
        const { mode, slave, writeData, appendCR, action } = Object.assign({ slave: 0, mode: "r", action: 0 }, opt);
        let dataType = opt.dataType || (parameter === null || parameter === void 0 ? void 0 : parameter.dataType);
        const modeNum = mode === "w" ? "1" : "0";
        // Default
        let dataLength = 2;
        let writeString = '';
        if (mode === "w") {
            switch (dataType) {
                case PfeifferDataTypeID.boolean_new:
                    dataLength = 1;
                    break;
                case PfeifferDataTypeID.u_short_int:
                    dataLength = 3;
                    break;
                case PfeifferDataTypeID.string8:
                    dataLength = 8;
                    break;
                case PfeifferDataTypeID.string16:
                    dataLength = 16;
                    break;
                default: {
                    dataLength = 6;
                }
            }
            if (dataType === PfeifferDataTypeID.boolean_old) {
                writeString = [1, true, "1"].indexOf(writeData) > -1 ? "111111" : "000000";
            }
            else {
                if ([1, true].indexOf(writeData) > -1) {
                    writeString = "1";
                }
                else if ([0, false].indexOf(writeData) > -1) {
                    writeString = "0";
                }
                else {
                    writeString = String(writeData).padStart(dataLength, '0');
                }
            }
        }
        else {
            writeString = '=?';
        }
        const padSlave = String(slave).padStart(3, "0");
        const dataTypeLen = String(dataLength).padStart(2, '0');
        const body = `${padSlave}${modeNum}${action ? String(action) : '0'}${paramId}${dataTypeLen}${writeString}`;
        const dataChecksum = body.split("").map((item) => {
            return item.charCodeAt(0);
        }).reduce((acc, item) => acc + item, 0);
        const padChecksum = String(dataChecksum % 256).padStart(3, "0");
        return `${body}${padChecksum}${appendCR ? `\r` : ''}`;
    }
    static parseResponse(input, options) {
        const clearInput = input.replace(/(\r\n|\n|\r)/, "");
        const command = PVProtocolCatalog.find((c) => {
            if (c.request && c.request.constructor == RegExp) {
                const rx = c.request;
                const testRes = rx.test(options.request);
                return testRes;
            }
            return new RegExp(c.request).test(options.request);
        });
        if (!command)
            return new Error("Command not found");
        const product = command.products.find((product) => {
            let valid = !product.length || product.length === clearInput.length;
            if (valid && product.validator) {
                valid = product.validator(clearInput);
            }
            return valid;
        });
        if (product) {
            return product.parser(clearInput);
        }
        return new Error("Product not found");
    }
}

export { PVProtocolParser, PV_PARAMETERS };
//# sourceMappingURL=index.es.js.map
