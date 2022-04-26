import parseMagpowerSTA from "./parser/magpower/sta";
import parseMagpowerIDN from "./parser/magpower/idn";
import parsePVParameter from "./parser/pv";
interface PVProtocolCatalog {
    request?: string | RegExp;
    validator?: (input: string) => boolean;
    products: {
        id: string;
        length?: number;
        validator?: (input: string) => boolean;
    }[];
}
declare const PVProtocolCatalog: ({
    request: RegExp;
    products: {
        id: string;
        parser: typeof parsePVParameter;
    }[];
} | {
    request: string;
    products: {
        id: string;
        parser: typeof parseMagpowerIDN;
    }[];
} | {
    request: string;
    products: {
        id: string;
        length: number;
        validator: (input: string) => boolean;
        parser: typeof parseMagpowerSTA;
    }[];
})[];
export default PVProtocolCatalog;
