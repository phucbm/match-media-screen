export interface CurrentObject {
    type: string;
    lastBreakpoint?: number;
    breakpoint: number | undefined;
    object: Record<string, any>;
}
