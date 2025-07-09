import { useCallback } from 'react';
import { copyBase64ImageToClipboard } from '../lib/utils';
import { normalizeRectangle } from '../lib/utils';
import type { RectCoords, CanvasSnapOptions, ExportOptions } from '../types';

const ImageQualityValue: Record<NonNullable<ExportOptions['imageQuality']>, number> = {
    low: 0.1,
    medium: 0.5,
    high: 1.0,
};

export const useImageCapture = (
    canvas: HTMLCanvasElement | null,
    rectCoords: RectCoords | null,
    options: CanvasSnapOptions
) => {
    const captureRectAsImage = useCallback(() => {
        console.log('called captur ')
        if (!rectCoords || !canvas) return null;

        const { x: startX, y: startY, width, height } = normalizeRectangle(rectCoords);

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = Math.abs(width);
        tempCanvas.height = Math.abs(height);
        const tempCtx = tempCanvas.getContext('2d');

        if (tempCtx) {
            const { backgroundColor, background } = canvas.style;
            tempCtx.fillStyle = backgroundColor || background || '#ffffff';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

            if (options.isGrayscale) tempCtx.filter = 'grayscale(100%)';

            tempCtx.drawImage(
                canvas,
                startX,
                startY,
                Math.abs(width),
                Math.abs(height),
                0,
                0,
                Math.abs(width),
                Math.abs(height)
            );

            if (options.isGrayscale) tempCtx.filter = 'none';
        }
        return tempCanvas.toDataURL('image/png', ImageQualityValue[options.imageQuality!]);
    }, [rectCoords, canvas, options.isGrayscale, options.imageQuality]);

    const copyImageToClipboard = useCallback(async (imageData: string) => {
        if (options.copyImageToClipBoard) {
            await copyBase64ImageToClipboard(imageData);
        }
    }, [options.copyImageToClipBoard]);

    return { captureRectAsImage, copyImageToClipboard };
};