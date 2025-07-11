
import type { BaseStyle, CanvasSnapOptions } from "../types";

export const DEFAULT_STYLES: BaseStyle = {
    backgroundColor: "#F14236",
    textColor: "#fff",
    fontSize: 12,
    fontFamily: "Calibri, sans-serif",
    padding: 4,
}

export const DEFAULT_OPTIONS: CanvasSnapOptions = {
    drawingEnabled: false,
    rect: {
        borderStyle: "dashed",
        borderColor: "#F14236",
        borderWidth: 1,
        outterBackgroundColor: "rgba(0, 0, 0, 0.1)",
    },
    copyImageToClipBoard: true,
    imageQuality: "high",
    isGrayscale: false,
    cursor: "crosshair",
    helperText: {
        show: true,
        value: "Press Enter to capture, Escape to cancel",
        position: "bottom-right",
        style: {
            ...DEFAULT_STYLES
        }
    },
    measurementLabel: {
        show: true,
        showWidth: true,
        showHeight: true,
        positionWidth: 'top-center',
        positionHeight: 'right-center',
        style: {
            ...DEFAULT_STYLES
        }
    }
};