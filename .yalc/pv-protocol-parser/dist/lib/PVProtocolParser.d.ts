import { PfeifferDataTypeID } from "./types";
export default class PVProtocolParser {
    static buildRequestString(pid: string | number, opt: {
        slave?: string | number;
        mode?: "w" | "r";
        dataType?: PfeifferDataTypeID;
        writeData?: any;
        appendCR?: boolean;
        action?: number;
    }): string;
    static parseResponse(input: string, options: {
        request: string;
    }): any;
}
