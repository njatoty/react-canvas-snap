import React, { useEffect, useMemo, useRef } from "react";
import type { CanvasSnapOptions, SnapshotProps } from "../types";
import { mergeSnapOptions } from "../lib/utils";
import { useCanvasLayer } from "./use-canvas-layer";
import { useRectangleDrawing } from "./use-rectangle-drawing";
import { useMouseEvents } from "./use-mouse-events";
import { useImageCapture } from "./use-image-capture";
import { useKeyboardEvents } from "./use-keyboard-events";
import { DEFAULT_OPTIONS } from "../configs";

export function useCanvasSnap(
    ref: React.RefObject<HTMLCanvasElement>,
    callBack?: (snapshot: SnapshotProps) => void,
    options?: CanvasSnapOptions
) {
    const canvasRef = ref ?? useRef<HTMLCanvasElement>(null);

    // merge options to get config
    const defaultOption = useMemo(
        () =>
            options === undefined
                ? DEFAULT_OPTIONS
                : mergeSnapOptions(DEFAULT_OPTIONS, options),
        [options]
    );

    const keyboardOptions = useMemo(
        () => ({
            captureKey: defaultOption.captureKey,
            cancelKey: defaultOption.cancelKey,
        }),
        [defaultOption.captureKey, defaultOption.cancelKey]
    );

    // Create canvas layer
    const { layerCanvas } = useCanvasLayer(
        canvasRef,
        defaultOption.drawingEnabled,
        defaultOption
    );

    // Rectangle drawing logic
    const { isDrawing, setIsDrawing, rectCoords, setRectCoords, clearDrawing } =
        useRectangleDrawing(layerCanvas, defaultOption);

    // Image capture logic
    const { captureRectAsImage, copyImageToClipboard } = useImageCapture(
        canvasRef,
        rectCoords,
        defaultOption
    );

    // Mouse event handling
    useMouseEvents(layerCanvas, isDrawing, setRectCoords, setIsDrawing);

    // Keyboard event handling
    useKeyboardEvents(
        isDrawing,
        rectCoords,
        (snapshot) => {
            callBack?.(snapshot);
            if (snapshot.capturedImage && defaultOption.copyImageToClipBoard) {
                copyImageToClipboard(snapshot.capturedImage);
            }
        },
        (snapshot) => callBack?.(snapshot),
        captureRectAsImage,
        clearDrawing,
        keyboardOptions
    );

    // Effect to clear drawing when drawingEnabled is disabled and layerCanvas is available
    useEffect(() => {
        if (!defaultOption.drawingEnabled && layerCanvas) {
            clearDrawing();
        }
    }, [defaultOption.drawingEnabled, clearDrawing, layerCanvas]);

    return { canvasRef };
}