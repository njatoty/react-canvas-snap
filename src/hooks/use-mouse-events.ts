import { useEffect } from 'react';
import { RectCoords } from '../types';

export const useMouseEvents = (
    layerCanvas: HTMLCanvasElement | null,
    isDrawing: boolean,
    setRectCoords: React.Dispatch<React.SetStateAction<RectCoords>>,
    setIsDrawing: (drawing: boolean) => void
) => {
    useEffect(() => {
        if (!layerCanvas) return;

        const handleMouseDown = (event: MouseEvent) => {
            const rect = layerCanvas.getBoundingClientRect();
            const scaleX = (layerCanvas.width / rect.width);
            const scaleY = (layerCanvas.height / rect.height);

            const x = (event.clientX - rect.left) * scaleX;
            const y = (event.clientY - rect.top) * scaleY;

            setRectCoords({ x, y, width: 0, height: 0 });
            setIsDrawing(true);
        };

        const handleMouseMove = (event: MouseEvent) => {
            if (!isDrawing) return;

            const rect = layerCanvas.getBoundingClientRect();
            const scaleX = (layerCanvas.width / rect.width);
            const scaleY = (layerCanvas.height / rect.height);

            const x = (event.clientX - rect.left) * scaleX;
            const y = (event.clientY - rect.top) * scaleY;

            setRectCoords((prev: RectCoords) => ({
                ...prev,
                width: x - prev.x,
                height: y - prev.y
            }));
        };

        const handleMouseUp = () => {
            setIsDrawing(false);
        };

        layerCanvas.addEventListener('mousedown', handleMouseDown);
        layerCanvas.addEventListener('mousemove', handleMouseMove);
        layerCanvas.addEventListener('mouseup', handleMouseUp);

        return () => {
            layerCanvas.removeEventListener('mousedown', handleMouseDown);
            layerCanvas.removeEventListener('mousemove', handleMouseMove);
            layerCanvas.removeEventListener('mouseup', handleMouseUp);
        };
    }, [layerCanvas, isDrawing, setRectCoords, setIsDrawing]);
};