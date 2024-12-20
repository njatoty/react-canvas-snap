import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { copyBase64ImageToClipboard, mergeSnapOptions, normalizeRectangle } from './methods';

type HelperText<T extends boolean> = {
    show: T
} & ({
    show: true;
    value?: string;
    backgroundColor?: string;
    textColor?: string;
    fontSize?: number;
    fontFamily?: string;
    padding?: number;
    textHeight?: number;
    position?: "auto" | "top-right" | "bottom-right" | "top-left" | "bottom-left" | "top-center" | "bottom-center"
} | {
    show: false
})

type Cursor = 'auto' | 'default' | 'none' | 'context-menu' | 'help' | 'pointer' | 'progress' | 'wait' | 'cell' | 'crosshair' | 'text' | 'vertical-text' | 'alias' | 'copy' | 'move' | 'no-drop' | 'not-allowed' | 'all-scroll' | 'zoom-in' | 'zoom-out' | 'ew-resize' | 'ns-resize' | 'nesw-resize' | 'nwse-resize' | 'col-resize' | 'row-resize' | 'copy' | 'grab' | 'grabbing';

export type CanvasSnapOptions = {
    drawingEnabled: boolean;
    rect?: {
        outterBackgroundColor?: string;
        borderColor?: string;
        borderStyle?: "dashed" | "dotted" | "solid",
        borderWidth?: number
    }
    isGrayscale?: boolean;
    helperText?: HelperText<boolean>;
    cursor?: Cursor,
    copyImageToClipBoard?: boolean,
    imageQuality?: "low" | "medium" | "high"
}

export type SnapshotProps = {
    isCanceled: boolean;
    capturedImage: string | null;
    rectCoords: {
        x: number;
        y: number;
        height: number;
        width: number;
    } | null
}

export type RectCoords = {
    x: number;
    y: number;
    width: number;
    height: number;
}

const DEFAULT_OPTION: CanvasSnapOptions = {
    drawingEnabled: false,
    isGrayscale: false,
    cursor: 'crosshair',
    copyImageToClipBoard: true,
    imageQuality: "high",
    rect: {
        outterBackgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        borderColor: '#F14236',
        borderStyle: 'dashed',
    },
    helperText: {
        show: true,
        backgroundColor: '#F14236',
        textColor: '#ffffff',
        position: 'auto',
        fontSize: 10,
        fontFamily: 'Arial',
        padding: 2,
        value: 'Press Enter to capture, Escape to cancel',
        textHeight: 10
    },
}

const imageQualityValue = {
    low: 0.1,
    medium: 0.5,
    high: 1.0
}

export const useCanvasSnap = (
    ref: React.RefObject<HTMLCanvasElement> | null, // Optional ref parameter
    callBack?: (snapshot: SnapshotProps) => void,
    option: CanvasSnapOptions = DEFAULT_OPTION,
) => {
    const canvasRef = ref ?? useRef<HTMLCanvasElement>(null);
    const [layerCanvas, setLayerCanvas] = useState<HTMLCanvasElement | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const initialRecCoords = useMemo(() => ({
        width: 0, height: 0,
        x: 0, y: 0
    }), []);
    const [rectCoords, setRectCoords] = useState<RectCoords>(initialRecCoords); // To store rect dimensions

    const defaultOption = useMemo(() => mergeSnapOptions(DEFAULT_OPTION, option), [option]);

    const clearLayerCanvas = useCallback(() => {
        if (!layerCanvas) return;
        // Clear the canvas
        const ctx = layerCanvas.getContext('2d');
        ctx?.clearRect(0, 0, layerCanvas.width, layerCanvas.height);
        setRectCoords(initialRecCoords);
    }, [layerCanvas]);

    // create layer canvas
    useEffect(() => {

        const currentCanvas = canvasRef.current;

        if (currentCanvas) {

            // init coords 
            setRectCoords(initialRecCoords);

            // check if layer exists yet
            [...(currentCanvas.parentElement?.children || [])].forEach(child => {
                if (child.tagName === 'CANVAS' && child.classList.contains('drawer-layer')) {
                    currentCanvas.parentElement?.removeChild(child);
                }
            })

            if (!defaultOption.drawingEnabled) {

                return;
            }

            const layer = currentCanvas.cloneNode(true) as HTMLCanvasElement;
            layer.className = 'drawer-layer';
            layer.removeAttribute('style');
            layer.style.position = 'absolute';
            layer.style.cursor = defaultOption.cursor!;
            layer.style.inset = '0';
            layer.style.zIndex = '10';
            layer.style.background = 'transparent';

            const ctx = layer.getContext('2d');
            if (ctx) {
                // Clear the canvas
                ctx.clearRect(0, 0, layer.width, layer.height);
                // Draw a dark semi-transparent overlay
                ctx.fillStyle = defaultOption.rect?.outterBackgroundColor!;
                ctx.fillRect(0, 0, layer.width, layer.height);
            }

            setLayerCanvas(layer);

            currentCanvas.after(layer);
        }

    }, [canvasRef, defaultOption.drawingEnabled, initialRecCoords]);


    // Method to capture image inside the rect
    const captureRectAsImage = useCallback(() => {

        if (!rectCoords || !canvasRef.current) return null;

        const { x: startX, y: startY, width, height } = normalizeRectangle(rectCoords);

        // Create a new canvas for the cropped area
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = Math.abs(width);
        tempCanvas.height = Math.abs(height);
        const tempCtx = tempCanvas.getContext('2d');

        if (tempCtx) {

            // Optionally, fill the background color (adjust the color as needed)
            const { backgroundColor, background } = canvasRef.current.style;
            tempCtx.fillStyle = backgroundColor || background || '#ffffff';  // Example background color (white)
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);  // Fill background

            // Apply grayscale filter
            if (defaultOption.isGrayscale)
                tempCtx.filter = 'grayscale(100%)';

            // Copy the area inside the rectangle
            tempCtx?.drawImage(
                canvasRef.current,
                startX,
                startY,
                Math.abs(width),
                Math.abs(height),
                0,
                0,
                Math.abs(width),
                Math.abs(height)
            );

            if (defaultOption.isGrayscale)
                // Reset the filter to avoid affecting subsequent drawings
                tempCtx.filter = 'none';
        }

        // Convert to data URL
        return tempCanvas.toDataURL('image/png', imageQualityValue[defaultOption.imageQuality!]);

    }, [rectCoords, canvasRef, defaultOption.isGrayscale]);


    useEffect(() => {

        if (!layerCanvas) return;

        const ctx = layerCanvas.getContext('2d');

        if (!ctx) return;

        if (!defaultOption.drawingEnabled) {
            // Clear the layerCanvas
            ctx.clearRect(0, 0, layerCanvas.width, layerCanvas.height);
            return;
        };

        const handleMouseDown = (event: MouseEvent) => {

            const rect = layerCanvas.getBoundingClientRect();

            // Adjust for both scaling and DPR
            const scaleX = (layerCanvas.width / rect.width);
            const scaleY = (layerCanvas.height / rect.height);

            const x = (event.clientX - rect.left) * scaleX;
            const y = (event.clientY - rect.top) * scaleY;

            setRectCoords(prev => ({ ...prev, x, y }));
            setIsDrawing(true);
        };

        const handleMouseMove = (event: MouseEvent) => {
            if (!isDrawing) return;

            const rect = layerCanvas.getBoundingClientRect();

            const { x: X, y: Y } = rectCoords;

            // Adjust for both scaling and DPR
            const scaleX = (layerCanvas.width / rect.width);
            const scaleY = (layerCanvas.height / rect.height);

            const x = (event.clientX - rect.left) * scaleX;
            const y = (event.clientY - rect.top) * scaleY;

            const width = x - X;
            const height = y - Y;

            // Update the rectangle dimensions
            setRectCoords((prev) => ({
                ...prev,
                width,
                height,
            }));

            // Clear the canvas
            ctx.clearRect(0, 0, layerCanvas.width, layerCanvas.height);

            // Draw a dark semi-transparent overlay
            ctx.fillStyle = defaultOption.rect?.outterBackgroundColor!;
            ctx.fillRect(0, 0, layerCanvas.width, layerCanvas.height);

            const lineWidth = defaultOption.rect?.borderWidth!;

            // Cut out the rectangle (sharp area)
            ctx.clearRect(X, Y, width, height);

            // Apply border style
            if (defaultOption.rect?.borderStyle === 'dashed') {
                ctx.setLineDash([lineWidth * 2, lineWidth]); // Dash pattern: 6px dash, 4px gap
            } else if (defaultOption.rect?.borderStyle === 'dotted') {
                ctx.setLineDash([lineWidth, lineWidth]); // Dot pattern: 2px dash, 2px gap
            } else {
                ctx.setLineDash([]); // Solid line (normal)
            }

            ctx.strokeStyle = defaultOption.rect?.borderColor!; // Border color
            ctx.lineWidth = lineWidth; // Border thickness

            // Draw the border outside the cleared rectangle
            ctx.strokeRect(
                X - (lineWidth / 2), // Shift left by half the border width
                Y - (lineWidth / 2), // Shift up by half the border width
                width + lineWidth, // Increase width to include the border
                height + lineWidth // Increase height to include the border
            );

            // draw text if set
            if (!defaultOption.helperText || defaultOption.helperText.show) {

                if (!defaultOption.helperText?.show) return;

                // Add text with a background at the bottom-right corner of the rectangle
                const text = defaultOption.helperText?.value!;

                ctx.font = `${defaultOption.helperText?.fontSize}px ${defaultOption.helperText?.fontFamily}`; // Customize font and size
                ctx.textBaseline = "bottom"; // Align text to the bottom
                ctx.textAlign = "right"; // Align text to the right

                // Measure the text dimensions
                const textMetrics = ctx.measureText(text);
                const padding = defaultOption.helperText?.padding!; // Padding around the text
                const textWidth = textMetrics.width;
                const textHeight = defaultOption.helperText?.fontSize!; // Approximation of text height
                const marginY = textHeight * 2 + padding;

                // Background color
                ctx.fillStyle = defaultOption.helperText?.backgroundColor!; // Semi-transparent black

                let position = defaultOption.helperText?.position!;

                if (position === 'auto') {
                    let positionY = 'top', positionX = 'right';
                    // top close
                    if (Y < marginY) {
                        positionY = 'bottom';
                    }
                    // for bottom close 
                    if (Y + height >= rect.height - marginY) {
                        positionY = 'top';
                    }

                    // for negative height
                    if (height < 0) {
                        positionY = 'top';
                        if (height + Y <= marginY) {
                            positionY = 'bottom';
                        }
                    }

                    // for left close
                    if (textWidth <= rect.width && width > 0) {
                        positionX = 'left';
                        if (X + textWidth >= rect.width) {
                            positionX = 'right';
                        }
                    } else {
                        positionX = 'right';
                        if (X + width < textWidth) {
                            positionX = 'left';
                        }
                    }

                    position = (`${positionY}-${positionX}` as typeof position);

                }

                let textY = 0, rectY = 0, textX = 0, rectX = 0;
                const [yPosition, xPosition] = position.split('-');

                switch (yPosition) {
                    case 'top':
                        if (height < 0) {
                            rectY = Y - marginY + height;
                            textY = Y - textHeight + height;
                        } else {
                            rectY = Y - marginY;
                            textY = Y - textHeight;
                        }
                        break;
                    case 'bottom':
                        if (height < 0) {
                            rectY = Y - textHeight - padding * 2 + marginY;
                            textY = Y + (marginY) - padding;
                        } else {
                            rectY = Y + height - textHeight - padding * 2 + marginY;
                            textY = Y + height + (marginY) - padding;
                        }
                        break;
                }

                switch (xPosition) {
                    case 'left':
                        if (width < 0) {
                            rectX = X + width;
                            textX = X + width + textWidth + padding;
                        } else {
                            rectX = X;
                            textX = X + textWidth + padding;
                        }
                        break;
                    case 'right':
                        if (width < 0) {
                            rectX = X - textWidth - padding * 2;
                            textX = X - padding;
                        } else {
                            rectX = X + width - textWidth - padding * 2;
                            textX = X + width - padding;
                        }
                        break;
                    case 'center': default:
                        rectX = X + (width - textWidth) / 2 - padding * 2;
                        textX = X + (width + textWidth) / 2 - padding;
                        break;

                }


                ctx.fillRect(
                    rectX, // x position for background
                    rectY, // y position top for background
                    textWidth + padding * 2, // Background width
                    textHeight + padding * 2 // Background height
                );

                // Text color
                ctx.fillStyle = defaultOption.helperText?.textColor!;
                ctx.fillText(
                    text,
                    textX, // x position for text inside the background
                    textY // y position for text inside the background
                );
                // Reset dashed pattern for other drawings
                ctx.setLineDash([]);
            }

        };

        const handleMouseUp = () => {
            setIsDrawing(false);
        };

        // press enter
        const handlePressKey = async (e: KeyboardEvent) => {
            // prevent default behaviour
            e.preventDefault();

            if (e.key === 'Enter') {

                if (rectCoords.height === 0 || rectCoords.width === 0) return;

                // create snapshot
                const snapshot: SnapshotProps = {
                    isCanceled: false,
                    capturedImage: captureRectAsImage(),
                    rectCoords: rectCoords
                }

                // return calback
                callBack?.(snapshot);

                // copy image to clipboard
                if (defaultOption.copyImageToClipBoard) {
                    await copyBase64ImageToClipboard(snapshot.capturedImage!);
                }

                setIsDrawing(false);
            }

            // to cancel drawing
            if (e.key === 'Escape') {

                clearLayerCanvas();

                // create snapshot
                const snapshot: SnapshotProps = {
                    isCanceled: true,
                    capturedImage: null,
                    rectCoords: null
                }

                // return calback
                callBack?.(snapshot);
            }
        }

        // Add event listeners
        layerCanvas.addEventListener('mousedown', handleMouseDown);
        layerCanvas.addEventListener('mousemove', handleMouseMove);
        layerCanvas.addEventListener('mouseup', handleMouseUp);
        document.body.addEventListener("keydown", handlePressKey, { passive: false });

        // Cleanup event listeners
        return () => {
            layerCanvas.removeEventListener('mousedown', handleMouseDown);
            layerCanvas.removeEventListener('mousemove', handleMouseMove);
            layerCanvas.removeEventListener('mouseup', handleMouseUp);
            // remove key press
            document.body.removeEventListener("keydown", handlePressKey);
        };

    }, [layerCanvas, isDrawing, rectCoords, defaultOption, captureRectAsImage, callBack, clearLayerCanvas]);



    return { canvasRef };
};

export default useCanvasSnap;
