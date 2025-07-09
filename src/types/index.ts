
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


export type HelperTextPosition =
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right"
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

export interface HelperTextConfig {
    show: boolean;
    value?: string;
    position?: HelperTextPosition;

    style?: {
        backgroundColor?: string;
        textColor?: string;
        fontSize?: number;
        fontFamily?: FontFamily | string;
        padding?: number;
        textHeight?: number;
    };
}

export interface ExportOptions {
    copyImageToClipBoard?: boolean;
    imageQuality?: "low" | "medium" | "high";
    isGrayscale?: boolean;
    clipboardHandler?: (data: string) => void;
}


export interface UIOptions {
    helperText?: HelperTextConfig
}

export type CanvasSnapOptions = DrawingOptions & UIOptions & ExportOptions;

export interface SnapshotProps {
    isCanceled: boolean;
    capturedImage: string | null;
    rectCoords: RectCoords | null;
}
