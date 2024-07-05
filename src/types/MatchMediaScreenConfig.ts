import {ResponsiveSetting} from "./ResponsiveSetting";

export interface MatchMediaScreenConfig {
    dev?: boolean;
    object: {
        responsive?: ResponsiveSetting[];
        [key: string]: any;
    };
    onMatched?: (currentObject: any) => void;
    onUpdate?: (currentObject: any) => void;
    isInherit?: boolean;
    debounce?: number;
}
