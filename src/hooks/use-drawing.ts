
import { useState, useCallback } from 'react';
import type { RectCoords } from '../types';

export function useDrawing(enabled: boolean) {
    const [isDrawing, setIsDrawing] = useState(false);
    const [rectCoords, setRectCoords] = useState<RectCoords>({ x: 0, y: 0, width: 0, height: 0 });

    const startDrawing = useCallback((x: number, y: number) => {
        if (!enabled) return;
        setIsDrawing(true);
        setRectCoords({ x, y, width: 0, height: 0 });
    }, [enabled]);

    const updateDrawing = useCallback((x: number, y: number) => {
        if (!enabled || !isDrawing) return;
        setRectCoords(prev => ({
            ...prev,
            width: x - prev.x,
            height: y - prev.y
        }));
    }, [enabled, isDrawing]);

    const stopDrawing = useCallback(() => {
        if (!enabled) return;
        setIsDrawing(false);
        console.log('stopend')
    }, [enabled]);

    return { isDrawing, setIsDrawing, rectCoords, startDrawing, updateDrawing, stopDrawing };
}