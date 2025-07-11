import { useCallback } from 'react';
import { RectCoords, HelperTextConfig, Position, MeasurementLabelConfig } from '../types';
import { calculateAutoPosition, drawMeasurementLabel } from '../lib/draw';

export const useRectLabels = () => {
    const drawHelperText = useCallback((
        ctx: CanvasRenderingContext2D,
        rectCoords: RectCoords,
        canvasWidth: number,
        canvasHeight: number,
        helperText: HelperTextConfig
    ) => {
        if (!helperText.show) return;


        const { x: X, y: Y, width, height } = rectCoords;
        if (width === 0 || height === 0) return;

        const fontSize = helperText.style?.fontSize || 10;
        const fontFamily = helperText.style?.fontFamily || 'Arial';
        const padding = helperText.style?.padding || 2;
        const backgroundColor = helperText.style?.backgroundColor || '#000';
        const textColor = helperText.style?.textColor || '#fff';

        // Determine dynamic helper text position
        let position: Position = helperText.position || 'auto';
        if (position === 'auto') {
            const textWidth = ctx.measureText(helperText.value || '').width;
            const marginY = fontSize * 2 + padding;
            position = calculateAutoPosition(
                X, Y, width, height,
                textWidth, marginY,
                canvasWidth, canvasHeight
            );
        }

        drawMeasurementLabel({
            ctx,
            text: helperText.value || '',
            position,
            fontSize,
            fontFamily,
            backgroundColor,
            textColor,
            rectCoords,
            padding
        });
    }, []);

    const drawMeasurementLabels = useCallback((
        ctx: CanvasRenderingContext2D,
        rectCoords: RectCoords,
        config: MeasurementLabelConfig
    ) => {
        if (!config.show) return;

        const fontSize = config.style?.fontSize!;
        const fontFamily = config.style?.fontFamily!;
        const padding = config.style?.padding!;
        const textColor = config.style?.textColor!;
        const backgroundColor = config.style?.backgroundColor!;

        const { width, height } = rectCoords;

        if (config.showWidth) {
            drawMeasurementLabel({
                ctx,
                text: `${Math.abs(width)}px`,
                position: config.positionWidth!,
                fontSize,
                fontFamily,
                backgroundColor: backgroundColor,
                textColor: textColor,
                rectCoords,
                padding
            });
        }

        if (config.showHeight) {
            drawMeasurementLabel({
                ctx,
                text: `${Math.abs(height)}px`,
                position: config.positionHeight!,
                fontSize,
                fontFamily,
                backgroundColor: backgroundColor,
                textColor: textColor,
                rectCoords,
                padding
            });
        }
    }, []);

    return {
        drawHelperText,
        drawMeasurementLabels
    };
};

