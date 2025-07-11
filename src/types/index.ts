import type { KeyCommandName, KeyBinding } from "./key-commands";

export type RectCoords = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export interface DrawingOptions {
    drawingEnabled: boolean;
    rect?: {
        outterBackgroundColor?: string;
        borderColor?: string;
        borderStyle?: "dashed" | "dotted" | "solid";
        borderWidth?: number;
    };
    cursor?: string;
}


export type Position =
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right"
    | "right-top"
    | "right-center"
    | "right-bottom"
    | "left-top"
    | "left-center"
    | "left-bottom"
    | "center"
    | "auto";

export type FontFamily =
    | "Arial"
    | "Verdana"
    | "Helvetica"
    | "Tahoma"
    | "Courier New"
    | "Times New Roman"
    | "Georgia"
    | "CustomFont";

export type BaseStyle = {
    backgroundColor?: string;
    textColor?: string;
    fontSize?: number;
    fontFamily?: FontFamily | string;
    padding?: number;
}

export type HelperTextConfig = {
    show: boolean;
} & ({
    show: true;
    value?: string;
    position?: Position;
    style?: BaseStyle;
} | {
    show: false;
});


type ShowTrueOptions<
    W extends boolean,
    H extends boolean
> = {
    show: true;
    showWidth: W;
    showHeight: H;
    style?: BaseStyle;
} & (W extends true ? { positionWidth: Position } : {})
    & (H extends true ? { positionHeight: Position } : {});


export type MeasurementLabelConfig =
    | { show: false }
    | ShowTrueOptions<true, true>
    | ShowTrueOptions<true, false>
    | ShowTrueOptions<false, true>
    | ShowTrueOptions<false, false>;

export interface ExportOptions {
    copyImageToClipBoard?: boolean;
    imageQuality?: "low" | "medium" | "high";
    isGrayscale?: boolean;
    clipboardHandler?: (data: string) => void;
}


export interface UIOptions {
    helperText?: HelperTextConfig;
    measurementLabel?: MeasurementLabelConfig;
}

export interface KeyboardOptions {
    captureKey?: KeyTrigger;
    cancelKey?: KeyTrigger;
}

export type CanvasSnapOptions = DrawingOptions & UIOptions & ExportOptions & KeyboardOptions;

export interface SnapshotProps {
    isCanceled: boolean;
    capturedImage: string | null;
    rectCoords: RectCoords | null;
}


export type KeyTrigger = KeyCommandName | KeyBinding;
