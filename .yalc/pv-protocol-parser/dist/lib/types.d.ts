export declare enum PVProtocolOptionID {
    OnOff = "OnOff",
    YesNo = "YesNo",
    ConfigurationOutput = "ConfigurationOutput",
    RotationSpeedSwitch = "RotationSpeedSwitch",
    ConfigurationOutputAO = "ConfigurationOutputAO",
    Ctrl = "Ctrl",
    OperationMode = "OperationMode",
    GasMode = "GasMode",
    VentingMode = "VentingMode",
    OnOffAccessory = "OnOffAccessory",
    ConfigurationAccess = "ConfigurationAccess"
}
export declare enum PfeifferDataTypeID {
    int = "int",
    float = "float",
    string = "string",
    string8 = "string8",
    string16 = "string16",
    boolean = "boolean",
    boolean_old = "boolean_old",
    u_short_int = "u_short_int",
    u_integer = "u_integer",
    u_real = "u_real",
    u_expo_new = "u_expo_new",
    u_expo = "u_expo",
    boolean_new = "boolean_new"
}
export declare enum PfeifferFormatID {
    exponential = "exponential"
}
export declare type PVProtocolParameter = {
    id: string;
    name: string;
    description: string;
    dataType: PfeifferDataTypeID;
    format?: PfeifferFormatID;
    command: string;
    writeCommand?: string;
    startPosition: number;
    length?: number;
    bitMaskValue?: number;
    access?: string;
    options?: PVProtocolOptionID;
    parseResponse?: (input: string, mode: 'r' | 'w', slp: PVProtocolParameter) => any;
    buildRequest?: (slp: PVProtocolParameter, mode: 'r' | 'w', data?: any) => string | undefined;
    min?: number;
    max?: number;
    default?: string | number;
    unit?: string;
    writeTime?: number;
    alertLevel?: 'WARNING' | 'ERROR';
};
