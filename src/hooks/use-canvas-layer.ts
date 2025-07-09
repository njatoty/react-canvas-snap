import { useEffect, useState } from 'react';
import type { CanvasSnapOptions } from '../types';

export function useCanvasLayer(
    canvas: HTMLCanvasElement | null,
    drawingEnabled: boolean,
    options: CanvasSnapOptions
) {
    const [layerCanvas, setLayerCanvas] = useState<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!canvas) return;

        // Remove existing drawer-layer canvases
        [...(canvas.parentElement?.children || [])].forEach(child => {
            if (child.tagName === 'CANVAS' && child.classList.contains('rcs__drawer-layer')) {
                canvas.parentElement?.removeChild(child);
            }
        });

        if (!drawingEnabled) return;

        const layer = canvas.cloneNode(true) as HTMLCanvasElement;
        layer.className = 'rcs__drawer-layer';
        layer.removeAttribute('style');
        layer.style.position = 'absolute';
        layer.style.cursor = options.cursor!;
        layer.style.inset = '0';
        layer.style.zIndex = '10';
        layer.style.background = 'transparent';

        const ctx = layer.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, layer.width, layer.height);
            ctx.fillStyle = options.rect?.outterBackgroundColor!;
            ctx.fillRect(0, 0, layer.width, layer.height);
        }

        canvas.after(layer);
        setLayerCanvas(layer);
    }, [canvas, drawingEnabled, options.cursor, options.rect?.outterBackgroundColor]);

    return { layerCanvas };
}