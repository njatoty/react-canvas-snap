import { useEffect } from 'react';
import type { RectCoords, SnapshotProps } from '../types';

export const useKeyboardEvents = (
    isDrawing: boolean,
    rectCoords: RectCoords,
    onCapture: (snapshot: SnapshotProps) => void,
    onCancel: (snapshot: SnapshotProps) => void,
    captureImage: () => string | null,
    clearDrawing: () => void
) => {
    useEffect(() => {
        const handlePressKey = async (e: KeyboardEvent) => {
            e.preventDefault();

            if (e.key === 'Enter') {
                if (!isDrawing || rectCoords.height === 0 || rectCoords.width === 0) return;

                const capturedImage = captureImage();
                if (!capturedImage) return;

                onCapture({
                    isCanceled: false,
                    capturedImage,
                    rectCoords
                });

                clearDrawing();
            }

            if (e.key === 'Escape') {
                clearDrawing();
                onCancel({
                    isCanceled: true,
                    capturedImage: null,
                    rectCoords: null
                });
            }
        };

        document.body.addEventListener("keydown", handlePressKey, { passive: false });
        return () => {
            document.body.removeEventListener("keydown", handlePressKey);
        };
    }, [isDrawing, rectCoords, onCapture, onCancel, captureImage, clearDrawing]);
};