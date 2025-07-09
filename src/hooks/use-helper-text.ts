import { useCallback } from 'react';
import { RectCoords, HelperTextConfig } from '../types';

type Position = NonNullable<HelperTextConfig['position']>;

export const useHelperText = () => {
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

        const text = helperText.value || '';
        const padding = helperText.style?.padding || 2;
        const fontSize = helperText.style?.fontSize || 10;

        // Set text styling
        ctx.font = `${fontSize}px ${helperText.style?.fontFamily || 'Arial'}`;
        ctx.textBaseline = "bottom";
        ctx.textAlign = "right";

        // Measure text dimensions
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;
        const textHeight = fontSize;
        const marginY = textHeight * 2 + padding;

        // Determine position
        let position = helperText.position || 'auto';

        if (position === 'auto') {
            position = calculateAutoPosition(
                X, Y, width, height,
                textWidth, marginY,
                canvasWidth, canvasHeight
            );
        }

        // Calculate coordinates based on position
        const { textX, textY, rectX, rectY } = calculateTextCoordinates(
            position,
            X, Y, width, height,
            textWidth, textHeight, padding,
            marginY
        );

        // Draw background
        ctx.fillStyle = helperText.style?.backgroundColor || '#F14236';
        ctx.fillRect(
            rectX,
            rectY,
            textWidth + padding * 2,
            textHeight + padding * 2
        );

        // Draw text
        ctx.fillStyle = helperText.style?.textColor || '#ffffff';
        ctx.fillText(text, textX, textY);
    }, []);

    return { drawHelperText };
};

// Helper function to calculate auto position
const calculateAutoPosition = (
    X: number, Y: number, width: number, height: number,
    textWidth: number, marginY: number,
    canvasWidth: number, canvasHeight: number
): Position => {
    let positionY = 'top', positionX = 'right';

    // Vertical positioning
    if (Y < marginY) {
        positionY = 'bottom';
    }
    if (Y + height >= canvasHeight - marginY) {
        positionY = 'top';
    }
    if (height < 0) {
        positionY = 'top';
        if (height + Y <= marginY) {
            positionY = 'bottom';
        }
    }

    // Horizontal positioning
    if (textWidth <= canvasWidth && width > 0) {
        positionX = 'left';
        if (X + textWidth >= canvasWidth) {
            positionX = 'right';
        }
    } else {
        positionX = 'right';
        if (X + width < textWidth) {
            positionX = 'left';
        }
    }

    return `${positionY}-${positionX}` as Position;
};

// Helper function to calculate text coordinates
const calculateTextCoordinates = (
    position: string,
    X: number, Y: number, width: number, height: number,
    textWidth: number, textHeight: number, padding: number, marginY: number
) => {
    let textY = 0, rectY = 0, textX = 0, rectX = 0;
    const [yPosition, xPosition] = position.split('-');

    // Vertical positioning
    switch (yPosition) {
        case 'top':
            if (height < 0) {
                rectY = Y - marginY + height;
                textY = Y - padding + height;
            } else {
                rectY = Y - marginY;
                textY = Y - padding;
            }
            break;
        case 'bottom':
            if (height < 0) {
                rectY = Y - textHeight - padding * 2 + marginY;
                textY = Y + marginY - padding;
            } else {
                rectY = Y + height - textHeight - padding * 2 + marginY;
                textY = Y + height + marginY - padding;
            }
            break;
        default:
            rectY = Y + (height / 2) - (textHeight / 2) - padding;
            textY = Y + (height / 2) + (textHeight / 2) - padding;
    }

    // Horizontal positioning
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
        case 'center':
        default:
            rectX = X + (width - textWidth) / 2 - padding;
            textX = X + (width + textWidth) / 2 - padding;
    }

    return { textX, textY, rectX, rectY };
};