import { useState, useCallback, useEffect } from 'react';
import type { RectCoords, CanvasSnapOptions } from '../types';
import { useHelperText } from './use-helper-text';

export const useRectangleDrawing = (
    layerCanvas: HTMLCanvasElement | null,
    options: CanvasSnapOptions
) => {

    const { drawHelperText } = useHelperText();
    const [isDrawing, setIsDrawing] = useState(false);
    const [rectCoords, setRectCoords] = useState<RectCoords>({
        width: 0, height: 0, x: 0, y: 0
    });

    const clearDrawing = useCallback(() => {
        if (!layerCanvas) return;
        const ctx = layerCanvas.getContext('2d');
        ctx?.clearRect(0, 0, layerCanvas.width, layerCanvas.height);
        setRectCoords({ width: 0, height: 0, x: 0, y: 0 });
    }, [layerCanvas]);

    const drawRectangle = useCallback(() => {
        if (!layerCanvas || !options.drawingEnabled) return;

        const ctx = layerCanvas.getContext('2d');
        if (!ctx) return;

        const { x: X, y: Y, width, height } = rectCoords;

        // Clear the canvas
        ctx.clearRect(0, 0, layerCanvas.width, layerCanvas.height);

        // Draw overlay
        ctx.fillStyle = options.rect?.outterBackgroundColor!;
        ctx.fillRect(0, 0, layerCanvas.width, layerCanvas.height);

        const lineWidth = options.rect?.borderWidth!;

        // Cut out the rectangle
        ctx.clearRect(X, Y, width, height);

        // Apply border style
        if (options.rect?.borderStyle === 'dashed') {
            ctx.setLineDash([lineWidth * 2, lineWidth]);
        } else if (options.rect?.borderStyle === 'dotted') {
            ctx.setLineDash([lineWidth, lineWidth]);
        } else {
            ctx.setLineDash([]);
        }

        ctx.strokeStyle = options.rect?.borderColor!;
        ctx.lineWidth = lineWidth;
        ctx.strokeRect(
            X - (lineWidth / 2),
            Y - (lineWidth / 2),
            width + lineWidth,
            height + lineWidth
        );

        // Draw helper text if enabled
        if (options.helperText?.show) {
            drawHelperText(
                ctx,
                rectCoords,
                layerCanvas.width,
                layerCanvas.height,
                options.helperText
            );
        }

        // Reset dashed pattern
        ctx.setLineDash([]);
    }, [layerCanvas, rectCoords, options]);

    useEffect(() => {
        if (!layerCanvas) return;
        drawRectangle();
    }, [rectCoords, layerCanvas, drawRectangle]);

    return { isDrawing, setIsDrawing, rectCoords, setRectCoords, clearDrawing };
};
