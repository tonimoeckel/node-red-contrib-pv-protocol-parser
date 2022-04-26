import { PVProtocolParameter } from "../types";
declare class SerialLinkDataParser {
    static reduceParametersForResponse(parameters: PVProtocolParameter[], input: string, mode?: "r" | "w"): {};
    static parseParameterForResponse(parameter: PVProtocolParameter, input: string, mode?: "r" | "w"): any;
}
export default SerialLinkDataParser;
