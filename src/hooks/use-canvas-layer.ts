import { Ref, RefObject, useEffect, useState } from 'react';
import type { CanvasSnapOptions } from '../types';

export function useCanvasLayer(
    canvasRef: RefObject<HTMLCanvasElement | null>,
    drawingEnabled: boolean,
    options: CanvasSnapOptions
) {
    const [layerCanvas, setLayerCanvas] = useState<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Remove existing drawer-layer canvases
        const parent = canvas.parentElement;
        if (parent) {
            parent.querySelectorAll('canvas.rcs__drawer-layer').forEach((layer) => {
                parent.removeChild(layer);
            });
        }

        if (!drawingEnabled) return;

        const layer = canvas.cloneNode(true) as HTMLCanvasElement;
        const ctx = layer.getContext('2d');

        // remove all layer attributes
        Array.from(layer.attributes).forEach((attr) => {
            // Ignore width and height
            if (['width', 'height'].includes(attr.name)) return;
            layer.removeAttribute(attr.name)
        });

        // Setup class and styling
        layer.className = 'rcs__drawer-layer';
        layer.removeAttribute('style');
        // Set aria attributes
        layer.setAttribute('role', 'img');
        layer.setAttribute('aria-label', 'Canvas Layer');

        Object.assign(layer.style, {
            position: 'absolute',
            inset: '0',
            zIndex: '10',
            cursor: options.cursor ?? 'default',
            background: 'transparent',
        });

        // Fill background if context exists
        if (ctx) {
            ctx.clearRect(0, 0, layer.width, layer.height);
            ctx.fillStyle = options.rect?.outterBackgroundColor!;
            ctx.fillRect(0, 0, layer.width, layer.height);
        }

        canvas.after(layer);
        setLayerCanvas(layer);
    }, [canvasRef, drawingEnabled, options.cursor, options.rect?.outterBackgroundColor]);

    return { layerCanvas };
}