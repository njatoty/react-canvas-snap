import { Position, RectCoords } from '../types';

interface DrawMeasurementLabelParams {
    ctx: CanvasRenderingContext2D;
    text: string;
    position: Position;
    fontSize: number;
    fontFamily: string;
    backgroundColor: string;
    textColor: string;
    rectCoords: RectCoords;
    padding: number;
}

export const drawMeasurementLabel = ({
    ctx,
    text,
    position,
    fontSize,
    fontFamily,
    backgroundColor,
    textColor,
    rectCoords,
    padding
}: DrawMeasurementLabelParams) => {
    const { x: X, y: Y, width, height } = rectCoords;

    // Set text styling
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textBaseline = 'bottom';
    ctx.textAlign = 'right';

    // Measure text dimensions
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const textHeight = fontSize;
    const marginY = textHeight * 2 + padding;

    // Calculate coordinates for text and background
    const { textX, textY, rectX, rectY } = calculateTextCoordinates(
        position,
        X, Y, width, height,
        textWidth, textHeight, padding, marginY
    );

    // Draw background rectangle
    if (backgroundColor !== 'transparent') {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(
            rectX,
            rectY,
            textWidth + padding * 2,
            textHeight + padding * 2
        );
    }

    // Draw the text
    ctx.fillStyle = textColor;
    ctx.fillText(text, textX, textY);
};


// Helper function to calculate auto position
export const calculateAutoPosition = (
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

    // Handle new right-* positions
    if (position === 'right-top' || position === 'right-center' || position === 'right-bottom') {
        const isNegWidth = width < 0;
        const isNegHeight = height < 0;
        const rectW = Math.abs(width);
        const rectH = Math.abs(height);
        const baseX = isNegWidth ? X + width : X + width;
        const baseY = isNegHeight ? Y + height : Y;

        // Horizontal positioning (always right)
        rectX = baseX + padding;
        textX = rectX + textWidth;

        // Vertical positioning
        switch (position) {
            case 'right-top':
                rectY = baseY - marginY;
                textY = rectY + textHeight + padding;
                break;
            case 'right-center':
                rectY = baseY + rectH / 2 - textHeight / 2 - padding;
                textY = rectY + textHeight;
                break;
            case 'right-bottom':
                rectY = baseY + rectH + padding;
                textY = rectY + textHeight;
                break;
        }

        return { textX, textY, rectX, rectY };
    }

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